let currentPage = 'home';
let currentBook = null;
let books = [];

const main = document.querySelector('main');

const pageListMainContent = `<h2 class="text-2xl font-bold mb-4">Daftar Buku Perpustakaan</h2>

<table class="min-w-full border border-gray-300">
  <thead>
    <tr>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Judul</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Penulis</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Tahun Terbit</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Jumlah</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-center">Action</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>`;

const pageEditBookMainContent = `<h2 class="text-2xl font-bold mb-4">Edit Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleEditForm(event)">
</form>
`;

const pageAddBookMainContent = `<h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>

<form class="max-w-sm mx-auto" onsubmit="return handleAddForm(event)">
  <div class="mb-4">
    <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
    <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
    <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
    <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
    <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="flex justify-center">
    <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="Tambah Buku" />
  </div>
</form>
`;

async function handleClickEditButton(bookId) {
  try {
    const response = await fetch(`http://localhost:3333/books/${bookId}`);
    currentBook = await response.json();
    currentPage = 'edit';
    loadPage();
    return currentBook
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat mengambil data buku');
  }
}
async function handleClickDeleteButton(bookId) {
  try {
    // const confirmation = confirm('Apakah anda yakin ingin menghapus buku ini?');
    // if (!confirmation) {
    //   return;
    // }
    await deleteBook(bookId)
    loadPage();
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat menghapus buku');
  }
}

async function handleEditForm(event) {
  try {
    // gunakan preventDefault untuk mencegah browser melakukan reload halaman
    // TODO: answer here
    event.preventDefault()
    let title = document.getElementById('title').value
    let author = document.getElementById('author').value
    let year = document.getElementById('year').valueAsNumber
    let quantity = document.getElementById('quantity').valueAsNumber
    console.log(title, author, year, quantity);
    let bookId = currentBook.id
    console.log(bookId);
    /* 
      Ambil data dari form, simpan ke dalam variabel book
      bentuknya seperti ini:
      {
        title: 'example judul',
        author: 'example penulis',
        year: 2020,
        quantity: 10,
      }
    */
    // TODO: answer here

    // panggil function editBook dengan parameter book
    // TODO: answer here
    const book = {
      title,
      author,
      year,
      quantity,
      bookId
    }
   await editBook({book, bookId});
   console.log(book);
    currentBook = null;
    currentPage = 'home';
    loadPage();
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat mengubah buku');
  }
}

async function handleAddForm(event) {
  try {
    event.preventDefault()
    let title = document.getElementById('title').value
    let author = document.getElementById('author').value
    let year = document.getElementById('year').valueAsNumber
    let quantity = document.getElementById('quantity').valueAsNumber
    console.log(title, author, year, quantity);
    const book = {
      title,
      author,
      year,
      quantity,
    }
   await addBook(book);
   console.log(book);
    currentPage = 'home';
    loadPage();
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat menambah buku');
  }
}

function handleClickAddNav() {
  currentPage = 'add';
  loadPage();
}


const navLinks = document.querySelectorAll('li a');
navLinks.forEach((navLink) => {
  navLink.addEventListener('click', () => {
    handleClickAddNav()
  })
});

function generateRows(books) {
  let rows = '';
  if (books.length === 0) {
    rows = `<tr>
   <td colspan="6" class="px-6 py-4 border-b text-center">Tidak ada buku yang ditemukan</td>
</tr>`;
  } else {
    books.map((item) => {
      const row = `<tr class="book-item">
      <td class="px-6 py-4 border-b">${item.title}</td>
      <td class="px-6 py-4 border-b">${item.author}</td>
      <td class="px-6 py-4 border-b">${item.year}</td>
      <td class="px-6 py-4 border-b">${item.quantity}</td>
      <td class="px-6 py-4 border-b text-center">
        <button class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickEditButton(${item.id})">Edit</button>
        <button class="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickDeleteButton(${item.id})">Hapus</button>  
      </td>
    </tr>`
    rows += row
    })
  }
  return rows;
}

function generateEditFormInput() {
  return `<div class="mb-4">
  <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
  <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.title}">
</div>
<div class="mb-4">
  <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
  <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.author}">
</div>
<div class="mb-4">
  <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
  <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.year}">
</div>
<div class="mb-4">
  <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
  <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.quantity}">
</div>
<div class="flex justify-center">
  <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="simpan" />
</div>`;
}

async function loadPage() {
  switch (currentPage) {
    case 'home':
      await fetchBooks().then()
      main.innerHTML = pageListMainContent;
      const tableBody = document.querySelector('tbody');
      const rows = generateRows(books)
      tableBody.insertAdjacentHTML("afterbegin",rows)
      break;
    case 'edit':
      main.innerHTML = pageEditBookMainContent;
      const form = document.querySelector('form');
      const formInput = generateEditFormInput()
      console.log(formInput);
      form.insertAdjacentHTML("beforeend", formInput)
      break;
    case 'add':
      main.innerHTML = pageAddBookMainContent;
      break;
  }
}

async function fetchBooks() {
  try {
    const response = await fetch("http://localhost:3333/books");
    books = await response.json();
    return books
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat mengambil data buku');
  }
}


async function addBook(book) {
  try {
    const response = await fetch("http://localhost:3333/books",
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(book),
      });
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat menambah buku');
  }
}

async function editBook({book, bookId}) {
  try {
    /* 
      ubah buku yang ada di http://localhost:3333/books/:id dengan method PUT
      body yang dikirim adalah book yang dikirimkan sebagai parameter function
    */
    // TODO: answer here
    const response = await fetch(`http://localhost:3333/books/${bookId}`,
      {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(book),
      });
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat mengubah buku');
  }
}

async function deleteBook(bookId) {
  try {
    const response = await fetch(`http://localhost:3333/books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
        },
    });
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error);
    console.log('Terjadi kesalahan saat menghapus buku');
  }
}

loadPage();
