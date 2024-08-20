document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("detailsModal");
    const closeModal = document.querySelector(".close");

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

    const buttonlist = document.getElementsByClassName("page");
    for (let i = 0; i < buttonlist.length; i++) {
        buttonlist[i].addEventListener("click", function() {
            const page = this.id; // get the page number from the button's id
            window.location.href = `/?page=${page}`;
        });
    }

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

    // const btnlist=document.getElementsByClassName("cart");
    // console.log(btnlist);
    // for(let i=0;i<btnlist.length;i++){
    //     btnlist[i].addEventListener("click",async (event)=>{
    //         console.log(event.target);
    //         window.location.href=`/order?product=${event.target.id}`;
    //     })
    // };
});
