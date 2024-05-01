const express = require('express');
const Item = require('../models/item.js');
const router = express.Router();
router.use(express.static('public')); 

router.get('/add', (req, res) => {
    res.render('item/add.ejs');
});
router.post('/add', async (req, res) => {
    const item = await Item.create(req.body);
    res.redirect('/');
})
router.get('/:itemId/edit', async(req, res) => {
    const foundItem = await Item.findById(req.params.itemId);
    res.render('item/edit.ejs', {
        item: foundItem,
    });
})
router.put('/:itemId/edit', async(req, res) => {

    await Item.findByIdAndUpdate(req.params.itemId, req.body)

    res.redirect('/')
})
router.delete('/:itemId/edit', async(req, res) => {

    await Item.findByIdAndDelete(req.params.itemId)

    res.redirect('/')
})


module.exports = router;