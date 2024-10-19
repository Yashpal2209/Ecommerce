function setMinHeight() {
    const elements = document.querySelectorAll('.bgforms, .home, .carts, .orders, .createproduct');
    elements.forEach(element => {
        element.style.minHeight = `${window.innerHeight}px`;
    });
}

// Set the height on initial load
setMinHeight();

// Adjust the height when the window is resized
window.addEventListener('resize', setMinHeight);


// document.addEventListener("DOMContentLoaded", function() {
//     const modal = document.getElementById("detailsModal");
//     const closeModal = document.querySelector(".close");

//     //view detail for a product
//     document.querySelectorAll(".viewDetails").forEach(button => {
//         button.addEventListener("click", function() {
//             const card = this.closest(".card");
//             const image = card.querySelector("img").src;
//             const title = card.querySelector(".card-title").innerText;
//             const description = card.querySelector(".card-text").innerText;
//             const price = card.querySelectorAll(".card-text")[1].innerText;
//             const quantity = card.querySelectorAll(".card-text")[2].innerText;

//             document.getElementById("modal-image").src = image;
//             document.getElementById("modal-title").innerText = title;
//             document.getElementById("modal-description").innerText = description;
//             document.getElementById("modal-price").innerText = price;
//             document.getElementById("modal-quantity").innerText = quantity;

//             modal.style.display = "block";
//             document.body.classList.add("modal-active");
//         });
//     });

//     closeModal.addEventListener("click", function() {
//         modal.style.display = "none";
//         document.body.classList.remove("modal-active");
//     });

//     window.addEventListener("click", function(event) {
//         if (event.target === modal) {
//             modal.style.display = "none";
//             document.body.classList.remove("modal-active");
//         }
//     });

//     //pagination
//     const buttonlist = document.getElementsByClassName("page");
//     for (let i = 0; i < buttonlist.length; i++) {
//         buttonlist[i].addEventListener("click", function() {
//             const page = this.id; // get the page number from the button's id
//             window.location.href = `/?page=${page}`;
//         });
//     }

//     // const buttonlist1 = document.getElementsByClassName("page1");
//     // const text=document.getElementById("searchedInput")
//     // for (let i = 0; i < buttonlist1.length; i++) {
//     //     buttonlist1[i].addEventListener("click", function() {
//     //         const page = this.id; // get the page number from the button's id
//     //         window.location.href = `/search/?page=${page}&searchedText=${text}`;
//     //     });
//     // }

//     //add to cart
//     const btnlist=document.getElementsByClassName("cart");
//     for(let i=0;i<btnlist.length;i++){
//         btnlist[i].addEventListener("click",async (event)=>{
//             console.log(event.target);
//             await fetch("/cart",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         id: event.target.id
//                     })
//                 }
//             ).then((response)=>{
//                 return response.json();
//                 // return response.json()
//             }).then((data)=>{
//                 alert(data.message);
//                 // alert(data);
//             }).catch((error)=>{
//                 alert("Error: "+error);
//             });
//         })
//     };
// });

function setMinHeight() {
    const elements = document.querySelectorAll('.bgforms, .home, .carts, .orders, .createproduct');
    elements.forEach(element => {
        element.style.minHeight = `${window.innerHeight}px`;
    });
}

// Set the height on initial load
setMinHeight();

// Adjust the height when the window is resized
window.addEventListener('resize', setMinHeight);


document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("detailsModal");
    const closeModal = document.querySelector(".close");

    //view detail for a product
    document.querySelectorAll(".viewDetails").forEach(button => {
        button.addEventListener("click", function() {
            const card = this.closest(".card");
            const image = card.querySelector("img").src;
            const title = card.querySelector(".card-title").innerText;
            const description = card.querySelector(".card-text").innerText;
            const price = card.querySelectorAll(".card-text")[1].innerText;
            const quantity = card.querySelectorAll(".card-text")[2].innerText;

            document.getElementById("modal-image").src = image;
            document.getElementById("modal-title").innerText = title;
            document.getElementById("modal-description").innerText = description;
            document.getElementById("modal-price").innerText = price;
            document.getElementById("modal-quantity").innerText = quantity;

            modal.style.display = "block";
            document.body.classList.add("modal-active");
        });
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
        document.body.classList.remove("modal-active");
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.classList.remove("modal-active");
        }
    });

    //pagination

    const text=document.getElementById("searchInput");
    text.addEventListener("keydown",(event)=>{
         // get the page number from the button's id
         if(event.key==='Enter'){
             window.location.href = `/?page=${1}&searchedText=${text.value}`;
         }
    });
    text.value=window.location.search.toString().split("&")[1].split("=")[1];
    const buttonlist = document.getElementsByClassName("page");
    for (let i = 0; i < buttonlist.length; i++) {
        buttonlist[i].addEventListener("click", function() {
            console.log(text.value);
            const page = this.id; // get the page number from the button's id
            const params=window.location.search;
            console.log(params.toString().split("&")[1].split("=")[1]);
            window.location.href = `/?page=${page}&searchedText=${params.toString().split("&")[1].split("=")[1]}`;
        });
    }

    //add to cart
    const btnlist=document.getElementsByClassName("cart");
    for(let i=0;i<btnlist.length;i++){
        btnlist[i].addEventListener("click",async (event)=>{
            console.log(event.target);
            await fetch("/cart",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: event.target.id
                    })
                }
            ).then((response)=>{
                return response.json();
                // return response.json()
            }).then((data)=>{
                alert(data.message);
                // alert(data);
            }).catch((error)=>{
                alert("Error: "+error);
            });
        })
    };

    var myCarousel = document.querySelector('#carouselExampleIndicators');
    var carousel = new bootstrap.Carousel(myCarousel, {
      interval: 4000, // 5 seconds
      wrap: true
    });
});

