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

        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('year').value = '';

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
        container.setAttribute('id', `book-${bookObject.id}`);

        if(bookObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undoBtn');
            undoButton.innerHTML = undoSVG;

            undoButton.addEventListener('click', function() {
                undoBookFromCompleted(bookObject.id);
            })
            
            const removeButton = document.createElement('button');
            removeButton.classList.add('removeBtn');
            removeButton.innerHTML = deleteSVG;

            removeButton.addEventListener('click', function() {
                removeBookFromCompleted(bookObject.id);
            })

            const setListButton = document.createElement('li');
            const setUnorderedList = document.createElement('ul');
            setUnorderedList.classList.add('social-media');

            setListButton.append(undoButton, removeButton);
            setUnorderedList.append(setListButton);
            getBookItem.append(setUnorderedList)
            container.append(getBookItem);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('checkListBtn');
            checkButton.innerHTML = checkSVG;

            checkButton.addEventListener('click', function () {
                addBookToCompleted(bookObject.id);
            });

            const removeButton = document.createElement('button');
            removeButton.classList.add('removeBtn');
            removeButton.innerHTML = deleteSVG;

            removeButton.addEventListener('click', function() {
                removeBookFromCompleted(bookObject.id);
            })

            const setListButton = document.createElement('li');
            const setUnorderedList = document.createElement('ul');
            setUnorderedList.classList.add('social-media');

            setListButton.append(checkButton, removeButton);
            setUnorderedList.append(setListButton);
            getBookItem.append(setUnorderedList)
            container.append(getBookItem);
        }
        return container;
    }

    // window.localStorage.removeItem(STORAGE_KEY);

    function isStorageExist(){
        if(typeof(Storage) === undefined) {
            alert("Browser tidak mendukung fitur local storage");
            return false;
        }
        return true;
    }
    
    function saveData(){
        if(isStorageExist()){
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }
    
    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);
    
        if(data !== null) {
            for(const tempBook of data) {
                books.push(tempBook);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT))
    }

    if(isStorageExist) {
        loadDataFromStorage();
    } 

    document.addEventListener(SAVED_EVENT, function() {
        console.log(localStorage.getItem(STORAGE_KEY));
    });
})


const editSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512">
                      <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/>
                </svg>`

const deleteSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>`

const undoSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512">
                      <path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/>
                </svg>`

const checkSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512">
                    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/>
                </svg>`