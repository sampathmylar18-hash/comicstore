const auth_url = 'http://localhost:3000/api/auth'
const books_url = 'http://localhost:3000/api/books'

function showToast(message) {

        const existingToast = document.querySelector('.toast');
        if(existingToast){
            existingToast.remove()
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
     }

    function addToCart(bookId,title,price,image,stock){
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItem = cart.find(item=> item.bookId === bookId)
        
        if(existingItem){
            if(existingItem.quantity >= stock){
                showToast(`Only ${stock} left in stock`);
                return;
            }
        }

        if(existingItem){
            existingItem.quantity += 1;
        }else{
            if(stock <= 0){
                showToast(`${title} is out of stock`)
                return;
            }
            cart.push({ bookId , title , price , quantity : 1 , image , stock});
        }
        localStorage.setItem('cart' , JSON.stringify(cart));
        showToast(`${title} added to cart`)
    }

