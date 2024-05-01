const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const itemController = require('./controllers/item.js');
const Item = require('./models/item.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.use(express.static('public')); 
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use('/item', itemController);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))


app.get('/', async(req, res) => {
    const menuItems = await Item.find({});
    
    res.render('index.ejs', {
        menu: menuItems,
    });
})

app.listen('3000', () => {
    console.log(`The express app is ready on port 3000`);
})