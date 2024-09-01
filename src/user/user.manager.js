import bcrypt from 'bcryptjs';
import {pool} from '../db.js'
import { createAccount } from '../account/account.manager.js';

export const createUser = async (body, res) => {    
    try {
        const { lastName, firstName, email, password, phone,birthDay } = body;
    
        if (!email) {
          return await res.status(400).send("Email and Username cannot be empty");
        }
        const userExistQuery = `
          SELECT * FROM users
          WHERE email = ?`;
    
        const userAlreadyExists = await pool.query(userExistQuery, email);
    
        if (userAlreadyExists.length > 0) {
          const existingEmail = userAlreadyExists.find(
            (user) => user.email === email
          );
    
          if (existingEmail) {
            return await res.status(400).send("Email already exists");
          }
        }
        
        const salt = await bcrypt.hash(password, 12);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const insertUserQuery = `
          INSERT INTO users (lastName, firstName, email, password, phone, birthDay)
          VALUES (?, ?, ?, ?, ?, ?)`;
        
        const newUserValues = [
            lastName, firstName, email, hashedPassword, phone,birthDay
        ];

        const newUser = await pool.query(insertUserQuery, newUserValues);

        await createAccount({currencyType:'Dram',userId:newUser[0].insertId}, res)
        
        return res.status(200).send("User has been created");
      } catch (error) {
        return res.status(500).send({ error: error.message });
      }
}