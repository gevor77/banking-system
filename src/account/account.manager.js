import bcrypt from 'bcryptjs';
import {pool} from '../db.js'

const createAccountNumber = () => {
    return Math.floor(1+Math.random()*9000000000000000).toString()
}

const startTranaction = async (data, res) => {
  const conn = await pool.getConnection();
  
  try {
    const addSumm = data.transmitter.summary - data.summ;
    const newSumm = data.transmitter-data.summ
    if(data.exchangeRate !== data.receiver.currencyType){
      throw new Error('You cannot transfer to other account number!');
    }
    if(newSumm < 0) {
      throw new Error('Your account doesn\'\t have enough money!');
    }
    conn.query(`UPDATE account SET summary=? WHERE id=?`,[data.transmitter.summary-data.summ,data.from])
    conn.query(`UPDATE account SET summary=? WHERE id=?`,[data.receiver.summary+data.summ,data.to])
    
    createTransferRate(data.from,data.to,data.summ,data.exchangeRate,data.userID,res)
    return res.status(200).send('Transfer is done');
  } catch (err) {
    conn.rollback()
    return res.status(500).send({ err: err.message });
  } finally{
    await conn.release();
  }

}

export const transaction = async ({ from, to, summ, exchangeRate, userID }, res)=>{
  try {
    const getAccountByAccountIdQuery = `SELECT * FROM account WHERE id = ?`;
    const transmitter = await pool.query(getAccountByAccountIdQuery, from);

    const getAccountByAccountIdReceiverQuery = `SELECT * FROM account WHERE id = ?`;
    const receiver = await pool.query(getAccountByAccountIdReceiverQuery, to);
    const sendData = {
      from,
      to,
      summ,
      exchangeRate,
      userID,
      receiver:receiver[0][0],
      transmitter:transmitter[0][0]
    }
    
    if(transmitter[0].length && receiver[0].length> 0) {
      startTranaction(sendData, res)
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
  
}

export const createTransferRate = async (from,to,summ,exchangeRate,userID,res) => {  
  try {
    const insertUserQuery = `
          INSERT INTO transfer (fromAccountID, userID, summary, toAccountID, transferRate)
          VALUES (?,?,?,?,?)`;
    
        const newUserValues = [
          from,userID,summ,to,exchangeRate
        ];
        await pool.query(insertUserQuery, newUserValues);
       return res.status(200).send('Transfer Created')
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
export const createAccount = async (body, res) => {
    const accountNumber = createAccountNumber()
    
    try {
        const { currencyType, userID} = body;
    
        const insertUserQuery = `
          INSERT INTO account (currencyType, accountNumber, userID)
          VALUES (?, ?, ?)`;
    
        const newUserValues = [
            currencyType, accountNumber,userID
        ];
    
        await pool.query(insertUserQuery, newUserValues);
        
        return res.status(200).send("Account has been created");
      } catch (error) {
        return res.status(500).send({ error: error.message });
      }
}

export const getAccountsByUserId = async (id, res) => {
  
  try {
    const getAccountByUserIdQuery = `SELECT * FROM account WHERE userID = ?`;
    const dataAccounts = await pool.query(getAccountByUserIdQuery, id);
    if(dataAccounts[0].length === 0) {
      return res.status(200).send('Accounts not found');
    }
    return res.status(200).send(dataAccounts[0]);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export const getAccount = async (id, res) => {
  
  try {
    const getAccountByUserIdQuery = `SELECT * FROM account WHERE id = ?`;
    const dataAccount = await pool.query(getAccountByUserIdQuery, id);
    if(dataAccount[0].length === 0) {
      return res.status(200).send('Accounts not found');
    }
    return res.status(200).send(dataAccount[0]);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export const getTransferByUserId = async (id, res) => {
  
  try {
    const getTransferById = `SELECT * FROM transfer WHERE userID = ?`;
    const dataAccount = await pool.query(getTransferById, id);

    return res.status(200).send(dataAccount[0]);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}


