const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS'

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

export { 
    saveData, 
    SAVED_EVENT,
    isStorageExist,
    loadDataFromStorage
};