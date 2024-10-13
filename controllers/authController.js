//import
const db = require('../config/db');
const bcrypt = require('bcryptjs');

//user registration function
exports.registerUser = async (request, response) => {
    //fetching user data from the request body when the form is submitted. 
    const { name, email, password } = request.body;// body is a property of the request and that's where we will fetch the data such as email...
    try{
        //check if user exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if(rows.length > 0){
            return response.status(400).json({ message: 'User already exists!'});
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //insert recorde into db table
        await db.execute('INSERT INTO users (name, email, password) VALUES (?,?,?)', [
            name,
            email,
            hashedPassword
        ]);
        response.status(201).json({ message: 'User registered successfully!'});
    } catch(error) {
        response.status(500).json({ message: 'An error occured!', error });
    }
}

exports.loginUser = async (request, response) => {
    const { email, password } = request.body;
    try{
        //check if user exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if(rows.length === 0){
            return response.status(400).json({ message: 'User not found! Please register.'});
        }
        const user = rows[0];//if user exist we create a varible that will hold the records.it is holding the result of our query

        //compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return response.status(400).json({ message: 'Invalid credentials!' });
        }
        //if password matches,we can store this to the session, by accessing the request then the session and store it under a user variable. 
        // req.session.user = user
        response.status(200).json({ message: 'Login successful!', name: user.name, email : user.email });
    } catch(error) {
        response.status(500).json({ message: 'An error occured!', error });
    }
}
