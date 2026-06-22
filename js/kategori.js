let categories =
StorageManager.getCategories();

let categoryEditId = null;

renderCategories();

document
.getElementById("saveCategory")
.addEventListener("click", saveCategory);

function saveCategory(){

const input =
document.getElementById("categoryName");

const name =
input.value.trim();

if(!name){

alert("Kategori wajib diisi");
return;

}

if(categoryEditId !== null){

categories[categoryEditId] = name;

categoryEditId = null;

}else{

categories.push(name);

}

StorageManager.saveCategories(categories);

input.value = "";

renderCategories();

}

function renderCategories(){

const table =
document.getElementById("categoryTable");

table.innerHTML = "";

categories.forEach((category,index)=>{

table.innerHTML += `

<tr>

<td>${category}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editCategory(${index})">

Edit

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteCategory(${index})">

Hapus

</button>

</td>

</tr>

`;

});

}

function editCategory(index){

document.getElementById("categoryName").value =
categories[index];

categoryEditId = index;

}

function deleteCategory(index){

if(!confirm("Hapus kategori ini?"))
return;

categories.splice(index,1);

StorageManager.saveCategories(categories);

renderCategories();

}