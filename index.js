const express = require('express');
const app = express();
const PORT = 3000;
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const current_sessions= [];
const users = [];


app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

//Créer un nouvel utilisateur
app.post('/users', (req, res) => {
    users.push({'username': req.body.username, 'password': req.body.password});
    res.sendStatus(204);
})

//Demander la page de login
app.get('/login', (req, res) => {
    res.render('login');
})

//Logger in
app.post('/login', (req, res) => {
    const user = users.find((user) => user.username === req.body.username && user.password === req.body.password)
    if (user === undefined) {
        res.sendStatus(403)
    } else {
        const token = crypto.randomUUID();
        current_sessions.push({username: user.username, token})
        res.send({token});
    }
})

//Visualier userprofil
app.get('/userprofile', (req, res) => {
    const token = req.cookies.user_profile_cookie
    const user = current_sessions.find((user) => user.token === token)

    if (token === undefined || user === undefined) {
        res.redirect('/login')
        return
    }

    res.render('userprofile', {username: user.username});
})





app.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log('Server listening at localhost:', PORT)
});
