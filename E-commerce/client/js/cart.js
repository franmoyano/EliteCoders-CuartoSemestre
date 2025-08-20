const modalConteiner= document.getElementById("modal-container");
const modalOverlay= document.getElementById("modal-overlay");

const cartBtn= document.getElementById("cart-btn");

const displayCart=() => {
    modalConteiner.innerHTML="";
    modalConteiner.style.display= "block";
    modalOverlay.style.display="block";
    //modal header
    const modalHeader =document.createElement("div");
    
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌"
    modalClose.className="modal-close";
    modalHeader.append(modalClose);


    modalClose.addEventListener("click",()=>{
        modalConteiner.style.display= "none";
        modalOverlay.style.display= "none";
    })

    const modalTitle= document.createElement("div");
    modalTitle.innerText="Cart";
    modalTitle.className= "modal-title";
    modalHeader.append(modalTitle);

    modalConteiner.append(modalHeader);
};

cartBtn.addEventListener("click",displayCart);



