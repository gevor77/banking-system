import express from'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv'; 
const port = process.env.PORT || 3000;

dotenv.config();
export const pool = mysql.createPool({
    host:process.env.db_host,
    user:process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
})