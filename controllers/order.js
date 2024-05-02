const express = require('express');
const Order = require('../models/order.js');
const router = express.Router();
router.use(express.static('public')); 