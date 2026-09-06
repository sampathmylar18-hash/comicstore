

let allBooks = []

const Books_per_page = 8;
let currentPage = 1;

function getBooksForCurrentPage(){
    const startIndex = (currentPage -1) * Books_per_page;
    const endIndex = startIndex + Books_per_page
    const booksToShow = allBooks.slice(startIndex,endIndex)
    return booksToShow;
}

function renderPagination(booksArray){
    const totalPages = Math.ceil(booksArray.length / Books_per_page);
    
    document.getElementById("pagination").innerHTML=`
    <button  id="previous">previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button id="next">next</button>
    `

        document.getElementById("previous").addEventListener('click', ()=>{
          
            if (currentPage > 1) {
                currentPage--;
                renderBooks(getBooksForCurrentPage());
                renderPagination(allBooks);
            }
});
    
       document.getElementById("next").addEventListener('click',()=>{
       
            if (currentPage < totalPages) {
                currentPage++;
                renderBooks(getBooksForCurrentPage());
                renderPagination(allBooks);
            }
        
});
    
 }

async function fetchBooks(){
    try{
        document.getElementById('book-list').innerHTML =  '<div class="spinner-container"><div class="spinner"></div></div>';
        const res = await fetch(books_url);
         allBooks = await res.json();
        renderBooks(getBooksForCurrentPage());
        renderFeaturedBooks(allBooks)
        renderPagination(allBooks)
        renderUsername();
    }catch(e){
        console.error('error while fetching books',e);
    }
}
function renderUsername(){
    const name = localStorage.getItem('name');
    const usernameEl = document.getElementById('username');
    if(usernameEl){
        usernameEl.innerHTML = name ? `welcome, ${name}` :  document.getElementById('username').remove();    }
}
function renderBooks(books){
        const container = document.getElementById('book-list');
        container.innerHTML = books.map(book =>`
        <div class="book-card">
        <a href="book.html?id=${book._id}">
        <img src="${book.image || 'https://via.placeholder.com/150'}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.price}</p>
        </a>
        <button onclick ="addToCart('${book._id}','${book.title}',${book.price} ,'${book.image}',${book.stock})">Add to Cart</button>
        </div>
    `).join('');

}
function renderFeaturedBooks(books){
    const container = document.getElementById('featured-books');
    const featured = books.filter(book=>book.featured)
    container.innerHTML = featured.map(book =>`
        <div class="book-card">
        <a href="book.html?id=${book._id}">
       <img src="${book.image || 'https://via.placeholder.com/150'}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.price}</p>
        </a>
        <button onclick ="addToCart('${book._id}','${book.title}',${book.price} ,'${book.image}',${book.stock})">Add to Cart</button>
        </div>
        `).join('')
}

 let searchDebounceTimer = null;

 document.getElementById('search-input').addEventListener('input',(e)=>{
    const term = e.target.value.toLowerCase();

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(()=>{
        const featuredWrapper = document.querySelector('.featured-wrapper');
    
    if(term == ''){
        renderBooks(getBooksForCurrentPage());
        renderPagination(allBooks);
        if(featuredWrapper) featuredWrapper.style.display = '';
    }else{
    const filtered = allBooks.filter(book => book.title.toLowerCase().includes(term));
    renderBooks(filtered);
    document.getElementById('pagination').innerHTML='';
    if(featuredWrapper) featuredWrapper.style.display = 'none'
 }
},200);
})


    
fetchBooks();