
const token = localStorage.getItem('token');
const role = localStorage.getItem('role')?.trim();


if(role !== 'admin'){
    showToast('access denied. Admins only.');
    setTimeout(() => {
        window.location.href = 'index.html'
         }, 500); 
}

let editingBookId = null;

document.getElementById('add-book-form').addEventListener('submit',async(e)=>{
    e.preventDefault();

    const bookData = {
        title : document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: Number(document.getElementById('price').value),
        image: document.getElementById('image').value,
        stock: Number(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        featured: document.getElementById('featured').checked
         
    }

    const isEditing = editingBookId !== null;
    const url = isEditing ?`${books_url}/${editingBookId}` : `${API_BASE}`;
    const method = isEditing ? 'PUT' : 'POST'


    try {
        
        const res = await fetch(url,{
            method : method,
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
             },
             body : JSON.stringify(bookData)
        });
        if(res.ok){
            showToast('book added!');
            e.target.reset();
            loadBooks();
        } else {
            const data = await res.json();
            showToast(data.message);
        }
    }catch(e){
        console.error(e)
    }
});

async function loadBooks(){
   document.getElementById('admin-book-list').innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
    const res = await fetch(`${books_url}`);
    const books = await res.json();

    const container = document.getElementById('admin-book-list');
    container.innerHTML = books.map(book =>`
        <div class="admin-book-item">
            <p>${book.title} - ₹${book.price}</p>
            <button onclick="editBook('${book._id}')">Edit</button>
            <button onclick="deleteBook('${book._id}')">Delete</button>
            </div>
        `).join('');
}

async function editBook(bookId){
    try{
        const res = await fetch(`${books_url}/${bookId}`);
        const result = await res.json();
        const book = result.data;

        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('price').value = book.price;
        document.getElementById('image').value = book.image || '';
        document.getElementById('stock').value = book.stock;
        document.getElementById('category').value = book.category || '';
        document.getElementById('description').value = book.description || '';
        document.getElementById('featured').checked = book.featured;
        
        editingBookId = bookId;

        document.querySelector('button[type="submit"]').textContent = 'Update Book';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }catch(e){
        console.error(e);
    }
}
 
async function deleteBook(bookId){
    try{
        const res = await fetch(`${books_url}/${bookId}`,{
            method : 'DELETE',
            headers : { 'Authorization' : `Bearer ${token}`}
        });
    if(res.ok){
        loadBooks();
    }else{
        const data = await res.json();
        showToast(data.message);
    }
    }catch(e){
        console.error(e);
    }
}



loadBooks();