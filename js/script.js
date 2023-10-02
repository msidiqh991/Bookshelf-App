const modalButton = document.getElementById('modalButton');
const getModal = document.getElementById('bookModal');
const closeButton = document.getElementsByClassName('close')[0];

modalButton.onclick = function(){
    getModal.style.display = "block";
}

closeButton.onclick = function() {
    getModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == getModal) {
        getModal.style.display = "none";
    }
}


const books = [];
const RENDER_EVENT = 'render-books';

const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS'

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })

    function addBook(){
        const bookTitle = document.getElementById('title').value;
        const bookAuthor = document.getElementById('author').value;
        const bookYear = document.getElementById('year').value;

        const generatedID = generatedId();
        const bookObject = generatedBookObject(generatedID, bookTitle, bookAuthor, bookYear, false);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generatedId(){
        return +new Date();
    }

    function generatedBookObject(id, title, author, year, isCompleted) {
        return {
            id,
            title,
            author,
            year,
            isCompleted,
        }
    }

    function postBook(bookObject) {
        
    }

})