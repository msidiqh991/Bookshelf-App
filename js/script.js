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


