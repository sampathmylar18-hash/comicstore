const token = localStorage.getItem('token')


async function fetchMyOrders(){
    if(!token){
    showToast('Please log in to view your orders');
      document.getElementById('orders-list').innerHTML = `
        <p>Please log in to view your orders.</p>
        <a href="login.html">Login</a>
    `;
   return;
}

  try{
    
    const res =  await fetch('http://localhost:3000/api/orders/my-orders',{
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    });

    const result = await res.json();
    const orders = result.data || result;
    console.log(orders)
    renderOrders(orders);
}catch(e){
    console.error(e);
}
}

function renderOrders(orders){
    const container = document.getElementById('orders-list');

    if(orders.length === 0){
        container.innerHTML = '<p>You have no past orders.</p>';
        return;
    }
    console.log(orders)
    container.innerHTML = orders.map(order => `
        <div class="cart-item">
          <div>
            <p><strong>Order placed:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            ${order.items.map(item => `
                <div><img src='${item.image}'>
                <span>${item.title} - Qty: ${item.quantity} - ₹${item.price}</span></div>
                `).join('')}
                <p><strong>Total: ₹${order.totalAmount}</strong></p>
                </div>
                </div>
        `).join('')

      
}
  fetchMyOrders()