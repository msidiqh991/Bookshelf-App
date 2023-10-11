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
        // saveData();
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

    document.addEventListener(RENDER_EVENT, function(){
        const uncompletedBookList = document.getElementById('books');
        uncompletedBookList.innerHTML = '';
       
        const completedBookList = document.getElementById('completedBooks');
        completedBookList.innerHTML = '';

        for (const getBookItem of books) {
            const bookElement = postBook(getBookItem);
            if (!getBookItem.isCompleted)
                uncompletedBookList.append(bookElement);
            else
                completedBookList.append(bookElement);
        }
    })

    function addBookToCompleted(bookId) {
        const bookTarget = findBook(bookId);

        if(bookTarget == null) return;

        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBook(bookId){
        for(const bookItem of books) {
            if(bookItem.id === bookId) {
                return bookItem;
            }
        }
        return null;
    }

    function removeBookFromCompleted(bookId) {
        const bookTarget = findBookIndex(bookId);

        if(bookTarget === -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBookIndex(bookId) {
        for(const index in books) {
            if(books[index].id === bookId) {
                return index;
            }
        }
        return -1;
    }

    function undoBookFromCompleted(bookId) {
        const bookTarget = findBook(bookId);

        if(bookTarget == null) return;

        bookTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function postBook(bookObject) {
        const writeTitle = document.createElement('h2');
        writeTitle.innerText = bookObject.title;
        writeTitle.setAttribute('id', 'book-title');

        const writeAuthor = document.createElement('span');
        writeAuthor.innerText = bookObject.author;
        writeAuthor.classList.add('book-author');

        const writeYear = document.createElement('span');
        writeYear.innerText = bookObject.year;
        writeYear.classList.add('book-year');

        const getBookStatus = document.createElement('span');
        getBookStatus.innerText = bookObject.isCompleted;
        getBookStatus.classList.add('book-status');

        const getBookItem = document.createElement('div');
        getBookItem.classList.add('bookItem');
        getBookItem.append(writeTitle, writeAuthor, writeYear, getBookStatus);
    
        const container = document.createElement('div');
        container.classList.add('cardBox-item');
        container.append(getBookItem);

        if(bookObject.isCompleted) {
            
        } else {
            
        }
        return container;
    }

    // window.localStorage.removeItem(STORAGE_KEY);



    // function isStorageExist(){
    //     if(typeof(Storage) === undefined) {
    //         alert("Browser tidak mendukung fitur local storage");
    //         return false;
    //     }
    //     return true;
    // }
    
    // function saveData(){
    //     if(isStorageExist()){
    //         const parsed = JSON.stringify(books);
    //         localStorage.setItem(STORAGE_KEY, parsed);
    //         document.dispatchEvent(new Event(SAVED_EVENT));
    //     }
    // }
    
    // function loadDataFromStorage(){
    //     const serializedData = localStorage.getItem(STORAGE_KEY);
    //     let data = JSON.parse(serializedData);
    
    //     if(data !== null) {
    //         for(const tempBook of data) {
    //             books.push(tempBook);
    //         }
    //     }
    //     document.dispatchEvent(new Event(RENDER_EVENT))
    // }

    // if(isStorageExist) {
    //     loadDataFromStorage();
    // } 

    document.addEventListener(SAVED_EVENT, function() {
        console.log(localStorage.getItem(STORAGE_KEY));
    });
})