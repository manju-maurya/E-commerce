// const express = require('express');
// const router = express.Router();

const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;

    const user = new User({ username, role, email });
    const newUser = await User.register(user, password);

    // console.log(newUser);
    await newUser.save();

    req.flash('success', 'You are registed successfully!');
    res.redirect('/login');
});

// router.post('/login', 

// passport.authenticate('local', {
//         failureRedirect: '/login'
//     },
//     next()  
// ), 

// (req, res)=>{
//     req.flash('success', `Welcome, ${req.user.username}`);
//     res.redirect('/products');    
// })

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        req.flash('success', `Welcome, ${req.user.username}!`);
        res.redirect('/products');
    });

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }

        res.redirect('/login');
    });
})

module.exports = router;