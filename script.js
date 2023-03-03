// Get the HTML elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const bookResults = document.querySelector("#book-results");
const searchHistory = document.querySelector("#search-history");
const clearHistoryBtn = document.querySelector("#clear-history");

//time and date
const now = new Date();
const day = now.getDate().toString().padStart(2, "0");
const month = (now.getMonth() + 1).toString().padStart(2, "0");
const year = now.getFullYear();
let hours = now.getHours();
const minutes = now.getMinutes().toString().padStart(2, "0");
const ampm = hours >= 12 ? "PM" : "AM";
hours = hours % 12;
hours = hours ? hours : 12;
const time = `${hours}:${minutes} ${ampm}`;
const datetime = `${day}/${month}/${year} at ${time}`;

let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
updateSearchHistory();

//function to fetch books using from API
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  const h3 = document.createElement("h3");
  h3.textContent = `Book Results for "${searchTerm}"`;
  h3.style.display = "block";


  if (searchTerm !== "") {
    bookResults.innerHTML = "";
    bookResults.appendChild(h3);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          for (let i = 0; i < data.items.length; i++) {
            const book = data.items[i];
            const bookInfo = {
              title: book.volumeInfo.title,
              authors: book.volumeInfo.authors,
              description: book.volumeInfo.description,
              pageCount: book.volumeInfo.pageCount,
              categories: book.volumeInfo.categories,
              imageUrl: book.volumeInfo.imageLinks
                ? book.volumeInfo.imageLinks.thumbnail
                : "noimage.png",
              infoLink: book.volumeInfo.infoLink,
            };
            const bookElement = createBookElement(bookInfo);
            bookResults.appendChild(bookElement);
          }
          history.unshift(searchTerm);
          localStorage.setItem("searchHistory", JSON.stringify(history));
          updateSearchHistory();
        } else {
          const message = document.createElement("p");
          message.textContent = "No results found.";
          bookResults.appendChild(message);
        }
      })
      .catch((error) => {
        console.log(error);
        const message = document.createElement("p");
        message.textContent = "An error occurred.";
        bookResults.appendChild(message);
      });
  }
});

//function to clear history
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("searchHistory");
  updateSearchHistory();
});

//Function to create Book card
function createBookElement(bookInfo) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book");
//   console.log(bookInfo);

  //image
  const img = document.createElement("img");
  img.src = bookInfo.imageUrl;
  img.alt = bookInfo.title;
  bookElement.appendChild(img);

  //title
  const h3 = document.createElement("h3");
  h3.textContent = bookInfo.title;
  bookElement.appendChild(h3);

  //author
  const p1 = document.createElement("p");
  p1.textContent = bookInfo.authors
    ? "Author: "+bookInfo.authors.join(", ")
    : "Unknown author";
  bookElement.appendChild(p1);

  //Category
  const p2 = document.createElement("p");
  p2.textContent = bookInfo.categories
    ? "Description: "+ bookInfo.categories
    : "Description: Description is not Given";
  bookElement.appendChild(p2);

  //Page Count
  const p3 = document.createElement("p");
  p3.textContent ="Page Count: "+ bookInfo.pageCount
    ? `Page Count: ${bookInfo.pageCount} pages`
    : "Page Count: Unknown";
  bookElement.appendChild(p3);

  //Description
  const p4 = document.createElement("p");
  p4.textContent = bookInfo.description
    ? "Description: "+bookInfo.description.substring(0, 100) + "..."
    : "Description: No description available";
  bookElement.appendChild(p4);

  const a = document.createElement("a");
  a.href = bookInfo.infoLink;
  a.textContent = "Buy Now";
  a.style.background = "white";
  a.style.color = "black";
  a.style.textDecoration = "none";
  a.style.padding = "3px";
  a.style.marginTop = "2px";
  a.style.fontWeight = "700";
  a.style.borderRadius = "2px";
  bookElement.appendChild(a);

  return bookElement;
}

// Function to update the search history and date time
function updateSearchHistory() {
  searchHistory.innerHTML = "";
  for (let i = 0; i < history.length; i++) {
    const li = document.createElement("li");
    li.style.textAlign = "center";
    li.style.cursor = "pointer";
    li.style.border = "2px solid white";
    li.style.padding = "10px";
    li.textContent = `${i + 1}. ${history[i]} Searched On: ${datetime}`;
    li.addEventListener("click", (event) => {
      event.preventDefault();
      searchInput.value = history[i];
      searchForm.dispatchEvent(new Event("submit"));
    });
    searchHistory.appendChild(li);
  }
}
