const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const User = require('../models/user');
const Product = require('../models/product');


router.post('/user/:productId/cart/add', async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    const userId = req.user._id;
    const user = await User.findById(userId);

    let ind = -1;
    const item = user.cart.find((item, index)=>{
        if(item.productId.equals(product._id)){
            ind = index;
            return item;
        }
    });

    if(item){
        user.cart[ind].quantity++;
    }else{
        user.cart.push({productId:product._id});
    }

    await user.save();

    req.flash('success', 'Item added to cart');
    res.redirect('back');
})


router.get('/user/cart', isLoggedIn, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('cart.productId');

    res.render('cart/index', { cart: user.cart });
})


module.exports = router;