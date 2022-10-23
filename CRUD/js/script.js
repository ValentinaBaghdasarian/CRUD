"use strict";

const root = document.querySelector("#root");
const url = "http://localhost:7777/todo/";


const UI = {
    title: document.createElement("h1"),
    subTitle: document.createElement("p"),
    form: document.createElement("form"),
    screenBlock: document.createElement("div"),
    screenInput: document.createElement("input"),
    screenAddBtn: document.createElement("button"),
    listsBlock: document.createElement("div"),

    elementOptions () {
         this.title.textContent = "CRUD";
         this.subTitle.textContent = "Asyn Application";

         this.form.id = "app-form";
         this.screenBlock.id = "screenBlock";
         this.screenInput.type = "text";
         this.screenInput.placeholder = "Type here...";
         this.screenAddBtn.textContent = "ADD";
         this.screenAddBtn.id = "screenAddBtn";
         this.listsBlock.id = "listsBlock";
    },

    appendElement () {
        root.append(this.title, this.subTitle, this.form, this.listsBlock);
        this.form.append(this.screenBlock);
        this.screenBlock.append(this.screenInput, this.screenAddBtn);
    },

    start () {
        this.elementOptions();
        this.appendElement();
    }
};

UI.start();

/*
    Ստեղծել 4 ֆունցկիա հետևյալ անուններով՝ GET, POST, PUT, DELETE ու անել այնպես
	որպեսզի էդ 4 ֆունկցիաները առանց որևիցէ խնդրի աշխատեն մեր տվյալների բազայի ու
	ամենակարևորը մեր UI-ի հետ
*/ 



const {form , screenInput, listsBlock} = UI;

function forRequest(id, value){
    listsBlock.innerHTML += `
        <div class="listsBlockItem">
            <div class="listsBlockItemContent">
                <span>${id}</span>
                <input type="text" value="${value}" readonly>
            </div>
            <div class="buttons">
                <button class="deleteBtn">Delete</button>
                <button class="editBtn">Edit</button>
                <button class="saveBtn">Save</button>
                <button class="doneBtn">Done</button>
            </div>
        </div>
    `;
}


function POST(){
    form.addEventListener("submit", function(e){
        e.preventDefault();
        const val = screenInput.value.trim();

        if(val !== ""){
            fetch(url, {
                method: "POST",
                headers: {
                    "content-type" : "application/json"
                },
                body: JSON.stringify({title: val})
            });
        }

        e.target.reset();
    });
}

POST();

function GET(){
    fetch(url)
        .then(data => data.json())
        .then(data => {
            data.forEach(todoObj => forRequest(todoObj.id, todoObj.title));
        })
        .then(() => {
            DELETE(document.querySelectorAll(".deleteBtn"));
            PUT(document.querySelectorAll(".editBtn"),
                document.querySelectorAll(".saveBtn")
                // document.querySelectorAll(".listsBlockItemContent")
               );
        });
}

GET();


function PUT(editBtns, saveBtns){
    editBtns.forEach((editBtn, index) => {
        editBtn.addEventListener("click", (e) =>{
            editBtn.style.display = "none";
            saveBtns[index].style.display = "inline-block";
            
            const input = editBtn.parentElement.previousElementSibling.lastElementChild;
            const idEdite = editBtn.parentElement.previousElementSibling.firstElementChild;
            input.classList.add("edit");
            input.removeAttribute("readonly");

            saveBtns[index].addEventListener("click", (e) =>{
                fetch(`${url}/${idEdite}`, {
                    method: "PUT",
                    headers: {
                        "content-type" : "application/json"
                    },
                    body: JSON.stringify({title: input.value.trim(), isComplete: false})
                });
            });
        });
    });
}


function DELETE(deleteBtn){
    deleteBtn.forEach(btn => {
        btn.addEventListener("click", function(e){
            const idDelete = btn.parentElement.previousElementSibling.firstElementChild.textContent;
            btn.parentElement.parentElement.remove();

            fetch(`${url}/${parseInt(idDelete)}`,{
                method: "DELETE"
            });
        });
    });
}





