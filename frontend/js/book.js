const params = new URLSearchParams(window.location.search);
const bookId = params.get('id');

async function fetchBookDetail() {
  try {
    document.getElementById('book-detail').innerHTML =  '<div class="spinner-container"><div class="spinner"></div></div>';
    const res = await fetch(`${books_url}/${bookId}`);
    const result = await res.json();
    const book = result.data;

    renderBookDetails(book);
  } catch (err) {
    console.error(err);
  }
}

function renderBookDetails(book){
  const container = document.getElementById('book-detail')
  container.innerHTML = `
    <div><button onclick="window.location.href='index.html'">back</button></div>
    <img src="${book.image}" alt="${book.title}">
    <h2>${book.title}</h2>
    <p>by ${book.author}</p>
    <p>${book.price}</p>
    <p>${book.description}</p>
    <p>stock:  ${book.stock}</p>
    <button onclick="addToCartAndRedirect('${book._id}','${book.title}',${book.price},'${book.image}',${book.stock})">Add to cart</button>
  
  `
}

function addToCartAndRedirect(bookId,title,price,image,stock){
  addToCart(bookId,title,price,image,stock);

}
fetchBookDetail();