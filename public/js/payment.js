
const btn = document.querySelector('#buy-btn');


async function makeOrder(amount) {
    try {
        const res = await axios({
            method: 'post',
            data: { amount },
            url: `/order`,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        console.log(res.data.order.amount);

        const options = {
            "key": "rzp_test_i1wlOQxtaGQQzK", // Enter the Key ID generated from the Dashboard
            "amount": res.data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Ecommerce Corp",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": res.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": "http://localhost:5000/payment-verify/",
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    } 
    catch (e) {
        window.location.replace('/login');
    }

}

btn.addEventListener('click', () => {
    const amount = document.querySelector('#amount-display').innerText.split(' ')[1];
    makeOrder(amount);
})
