require("dotenv").config();
const mysql = require('mysql')

const {HOST , USER , PASSWORD , DATABASE} = process.env

var db = mysql.createConnection({
  host: HOST,
  user: USER ,
  password : PASSWORD,
  database: DATABASE
  });

module.exports =db;