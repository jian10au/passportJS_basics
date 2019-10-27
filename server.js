require('dotenv')

const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport.config')
const flash = require('express-flash')
const session = require('express-session')

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
//again, the way we use passport is super weird. Because first asks you to 
const users = []

app.set('view-engine', 'ejs');

console.log(process.env.SESSION_SECRET);

app.use(express.urlencoded({extended:false}))
app.use(flash());
app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session())

app.get('/',(req,res) => res.render('index.ejs',  {name: req.user.name}))

app.get('/login', (req,res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:'/login',
    failureFlash: true
}))


app.get('/register', (req,res) => {




    res.render('register.ejs')
})

app.post('/register', async (req,res) => { 

try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
        id: Date.now().toString(),
        name:req.body.name,
        password:hashedPassword,
        email:req.body.email
    })


    res.redirect('/login')
}catch{
    res.redirect('/register')

}

console.log(users);

})




app.listen(3000)