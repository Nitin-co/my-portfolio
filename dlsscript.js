let currentUser = localStorage.getItem("loggedInUser");
let users = JSON.parse(localStorage.getItem("users")) || {};
let books = currentUser ? JSON.parse(localStorage.getItem(`${currentUser}_books`)) || [] : [];
let editIndex = null;
const allowedGenres = ["Classics", "Fantasy", "Horror", "Comedy", "Sci-fi"];

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveBooks() {
  if (currentUser) {
    localStorage.setItem(`${currentUser}_books`, JSON.stringify(books));
  }
}

function clearBookSections() {
  allowedGenres.forEach(genre => {
    const section = document.getElementById(genre);
    section.querySelectorAll(".book-entry").forEach(entry => entry.remove());
  });
}

function addBookToPage(book, index) {
  const section = document.getElementById(book.genre);
  if (section) {
    const entry = document.createElement("div");
    entry.className = "book-entry fade-in";
    const searchLink = book.link || `https://www.goodreads.com/search?q=${encodeURIComponent(book.title + ' ' + book.author)}`;
    const thumbnail = book.thumbnail ? `<img src="${book.thumbnail}" alt="Cover" style="max-height:80px; float:right; margin-left:12px;">` : "";
    entry.innerHTML = `
      ${thumbnail}
      <strong>${book.title}</strong> by ${book.author}<br>
      <em>${book.description}</em><br><br>
      <a class="btn-primary" href="${searchLink}" target="_blank" rel="noopener noreferrer">📖 View Book</a>
      <button class="btn-secondary edit-btn" data-index="${index}">Edit</button>
      <button class="btn-danger delete-btn" data-index="${index}">Delete</button>
    `;
    section.appendChild(entry);
  }
}

function renderBooks() {
  clearBookSections();
  const sortType = document.getElementById("sortSelect")?.value;
  let sortedBooks = [...books];
  if (sortType === "title") {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortType === "author") {
    sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
  }
  sortedBooks.forEach((book, index) => addBookToPage(book, index));
}

document.getElementById("bookForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const genre = document.getElementById("genre").value;
  const description = document.getElementById("description").value.trim();
  if (!allowedGenres.includes(genre)) return alert("Please select a valid genre.");
  let book = { title, author, genre, description };
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title + ' ' + author)}`);
    const data = await res.json();
    const item = data.items?.[0];
    if (item) {
      book.thumbnail = item.volumeInfo.imageLinks?.thumbnail || "";
      if (!description) book.description = item.volumeInfo.description || description;
    }
  } catch {}
  book.link = `https://www.goodreads.com/search?q=${encodeURIComponent(title)}`;
  if (editIndex !== null) {
    books[editIndex] = book;
    editIndex = null;
  } else {
    books.push(book);
  }
  saveBooks();
  renderBooks();
  this.reset();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const index = parseInt(e.target.dataset.index);
    if (confirm("Delete this book?")) {
      books.splice(index, 1);
      saveBooks();
      renderBooks();
    }
  }
  if (e.target.classList.contains("edit-btn")) {
    const index = parseInt(e.target.dataset.index);
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("description").value = book.description;
    editIndex = index;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.getElementById("clearAllBtn")?.addEventListener("click", () => {
  if (confirm("Delete all books?")) {
    books = [];
    saveBooks();
    renderBooks();
  }
});

document.getElementById("downloadBtn")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(books, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "books.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("searchInput")?.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  document.querySelectorAll(".book-entry").forEach(entry => {
    const text = entry.textContent.toLowerCase();
    entry.style.display = text.includes(keyword) ? "block" : "none";
  });
});

document.getElementById("sortSelect")?.addEventListener("change", renderBooks);

const toggleTheme = document.getElementById("toggleTheme");
const themeIcon = document.getElementById("themeIcon");
const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 0112.21 3 7 7 0 1019 19a9 9 0 012-6.21z"/></svg>`;
const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 24 24"><path d="M12 4.75a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1A.75.75 0 0112 4.75zM4.75 12a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM12 18.25a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM18.25 12a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM6.47 6.47a.75.75 0 011.06 0l.71.71a.75.75 0 01-1.06 1.06l-.71-.71a.75.75 0 010-1.06zM16.76 16.76a.75.75 0 011.06 0l.71.71a.75.75 0 01-1.06 1.06l-.71-.71a.75.75 0 010-1.06zM6.47 17.53a.75.75 0 000 1.06l.71.71a.75.75 0 001.06-1.06l-.71-.71a.75.75 0 00-1.06 0zM16.76 7.24a.75.75 0 010 1.06l-.71.71a.75.75 0 11-1.06-1.06l.71-.71a.75.75 0 011.06 0zM12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>`;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeIcon.innerHTML = sunSVG;
} else {
  themeIcon.innerHTML = moonSVG;
}

toggleTheme?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.innerHTML = sunSVG;
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.innerHTML = moonSVG;
    localStorage.setItem("theme", "light");
  }
});

document.getElementById("registerForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;
  const error = document.getElementById("registerError");

  users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    error.textContent = "Username already exists!";
    return;
  }

  users[username] = password;
  saveUsers();

  localStorage.setItem("loggedInUser", username);
  currentUser = username;
  books = JSON.parse(localStorage.getItem(`${currentUser}_books`)) || [];

  this.reset();
  error.textContent = "";
  showLibraryIfLoggedIn();
});

document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedInUser", username);
    currentUser = username;
    books = JSON.parse(localStorage.getItem(`${currentUser}_books`)) || [];
    error.textContent = "";
    showLibraryIfLoggedIn();
  } else {
    error.textContent = "Invalid username or password.";
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  currentUser = null;
  books = [];
  showLibraryIfLoggedIn();
});

function showLibraryIfLoggedIn() {
  const libApp = document.getElementById("libraryApp");
  const authForms = document.getElementById("authForms");
  const currentUserLabel = document.getElementById("currentUser");
  const logoutBtn = document.getElementById("logoutBtn");

  if (currentUser) {
    libApp.classList.remove("hidden");
    authForms.classList.add("hidden");
    currentUserLabel.textContent = `Logged in as: ${currentUser}`;
    logoutBtn.classList.remove("hidden");
    renderBooks();
  } else {
    libApp.classList.add("hidden");
    authForms.classList.remove("hidden");
    currentUserLabel.textContent = "";
    logoutBtn.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("genreBtn")?.addEventListener("click", () => {
    document.getElementById("Genres").classList.toggle("hidden");
  });
  showLibraryIfLoggedIn();
});
