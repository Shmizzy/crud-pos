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
const Order = require('./models/order.js');

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
app.use(express.json());



app.get('/menu/entrees', async (req, res) => {
    const menu = await Item.find({type: 'entree'});
    res.status(200).json({ menu });
})
app.get('/menu/sides', async (req, res) => {
    const menu = await Item.find({type: 'side'});
    res.status(200).json({ menu });
})
app.get('/menu/ingredients', async (req, res) => {
    const menu = await Item.find({type: 'ingredient'});
    res.status(200).json({ menu });
})



app.get('/orders', async (req, res) => {
    const orders = await Order.find({});

    res.status(200).json({ orders });
})

app.post('/orders' ,  async (req, res) => {
    
     const order = await Order.create({
        name: req.body.name,
        order: req.body.order
    }) 
    const id = order._id;

    res.json({
        name: req.body.name,
        order: req.body.order,
        id,
        success: true,
    });
})
app.delete('/orders/:id' ,  async (req, res) => {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    console.log('Successfully deleted', deletedOrder);
})

app.get('/', async(req, res) => {
    res.render('index.ejs');
})

app.listen('3000', () => {
    console.log(`The express app is ready on port 3000`);
})