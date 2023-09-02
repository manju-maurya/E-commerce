const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Razorpay = require('razorpay');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
const {isLoggedIn} = require('../../middlewares');
const {RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY} = process.env;


router.post('/order', isLoggedIn, async (req, res) => {
    const instance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_SECRET_KEY })
    const {amount} = req.body;
    const options = {
        amount: parseInt(amount) * 100,
        currency: "INR",
    };

    const order = await instance.orders.create(options);
    await Order.create({
        _id:order.id,
        user:req.user,
        amount
    })

    res.json({
        sucess:true,
        order
    })
});

router.post('/payment-verify', async (req, res)=>{
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const isValid = validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, RAZORPAY_SECRET_KEY);

    if(isValid){
        await Order.findByIdAndUpdate({_id: razorpay_order_id}, {paymentStatus: true})
        return res.status(200).json({
            success:true,
            msg: 'Payment successfull'
        })
    }

    res.json({
        succes:false,
        msg: 'Payment unsuccessfull'
    })
})


module.exports = router;
