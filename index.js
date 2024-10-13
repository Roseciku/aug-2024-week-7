//import
const express = require('express');
const path = require('path');// capturing the location of your directories and files
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

//set-up middleware(application/function/feature that sits between 2 interafces)
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());//using JSON data format in handling data
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes)
//routes for rendering the form
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));// route for displaying the index form/webpage
});

app.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname, 'login.html'));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`)
});