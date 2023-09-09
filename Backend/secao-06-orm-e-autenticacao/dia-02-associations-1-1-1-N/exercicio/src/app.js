// src/app.js

const express = require('express');

const employee = require('./controllers/employee.controller');

const app = express();

app.use(express.json());

app.post('/employees/', employee.insert);
app.get('/employees/:id', employee.getById);
app.get('/employees', employee.getAll);

module.exports = app;