function getCart(){
    return JSON.parse(localStorage.getItem('cart'))||[]

}

function renderCart(){
    const cart = getCart();
    const container = document.getElementById('cart-items');
    
    if(cart.length === 0 ){
        container.innerHTML='<p> Your cart is empty.<p>';
             document.getElementById('cart-total').remove()
        return;
    }

    container.innerHTML = cart.map(item =>`
        <div class = "cart-item">
        <img src="${item.image}">
        <p>${item.title} - ₹${item.price} x ${item.quantity}</p>
       
        <button onclick="decreseQty('${item.bookId}')">-</button>
        <span>${item.quantity}</span>
         <button onclick="increaseQty('${item.bookId}')">+</button>
        <button onclick="removeFromCart('${item.bookId}')">Remove</button>
        </div>
        `).join('');

        const total = cart.reduce((sum , item)=> sum + item.price * item.quantity , 0);
        document.getElementById('cart-total').textContent = `Total: ₹${total.toFixed(2)}`;
        
}

function removeFromCart(bookId){
        let cart = getCart();
        cart = cart.filter(item => item.bookId !== bookId);
        localStorage.setItem('cart' , JSON.stringify(cart));
        renderCart();
}

function increaseQty(bookId){
    let cart = getCart();
    const item = cart.find(i =>i.bookId === bookId)
    console.log(item)
    if(item){
        if(item.quantity >= item.stock){
            showToast(`Only ${item.stock} left in stock`);
            return;
        }
        item.quantity += 1;
    }
    localStorage.setItem('cart',JSON.stringify(cart));
    renderCart();
}

function decreseQty(bookId){
    let cart = getCart();
    const item = cart.find(i =>i.bookId === bookId)
    if(!item) return;

    if(item.quantity <=1){
        cart = cart.filter(item => item.bookId !== bookId);
    }
    else{
        item.quantity -= 1;
    }
    localStorage.setItem('cart',JSON.stringify(cart));
    renderCart();
}

async function checkout(){
   const token = localStorage.getItem('token');
   
    const cart = getCart();
    if(cart.length === 0){
        showToast('your cart is empty');
  
        return;
    }

   if(!token){
    showToast('please log in to checkout.')
     document.getElementById('cart-alert').innerHTML = `
        <p>Please log in to Checkout</p>
        <a href="login.html">Login</a>
    `;
    return;
   }

   
   const items = cart.map(item =>({
    bookId : item.bookId,
    title : item.title,
    price : item.price,
    quantity : item.quantity,
    image : item.image
   }));

   const totalAmount = cart.reduce((sum , item)=> sum + item.price * item.quantity , 0 )

   try{
    
    const res = await fetch('http://localhost:3000/api/payment/create-order',{
        method : 'POST',
        headers : {
            'content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({ items , totalAmount})
    });
    const razorpayOrder = await res.json();

    if(!res.ok){
        showToast(razorpayOrder.message || 'failed to start payment')
        return;
    }

    const options = {
        key : 'rzp_test_TJzrrJDdidNSsP',
        amount : razorpayOrder.amount,
        currency : razorpayOrder.currency,
        order_id : razorpayOrder.id,
        name : "sammyy's Bookstore",
        description : "Book purchase",
        handler : async function (response) {
            await verifyPaymentAndCreateOrder(response , items , totalAmount , token)
        },
        theme : {
            color : "#2455d9"
        }
    }
    const razorpayCheckout = new Razorpay(options);
    razorpayCheckout.open();
   }catch(e){
    console.error(e)
    showToast('something went wrong. please try again')
   }
}
   async function verifyPaymentAndCreateOrder(razorpayResponse , items , totalAmount , token){
    try{
        const res = await fetch('http://localhost:3000/api/payment/verify',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({
            razorpay_order_id : razorpayResponse.razorpay_order_id,
            razorpay_payment_id : razorpayResponse.razorpay_payment_id,
            razorpay_signature : razorpayResponse.razorpay_signature,
            items,
            totalAmount
        })
    })
   

    const data = await res.json();

    if(res.ok){
        localStorage.removeItem('cart');
        showToast('order placed successfully!')
        setTimeout(() => {
        window.location.href = 'index.html'
         }, 500); 
    }else {
        showToast(data.message || 'failed to place order.')
    }
   }catch(e){
    console.error(e);
    showToast('something went wrong. please try again.')
   }
}

renderCart()