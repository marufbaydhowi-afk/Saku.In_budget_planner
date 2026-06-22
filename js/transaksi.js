let transactions =
StorageManager.getTransactions();

let editId = null;

loadCategories();
renderTable();

function loadCategories(){

const categories =
StorageManager.getCategories();

const select =
document.getElementById("category");

select.innerHTML = `
<option value="">
Pilih Kategori
</option>
`;

categories.forEach(c=>{

select.innerHTML += `
<option value="${c}">
${c}
</option>
`;

});

}

document
.getElementById("saveBtn")
.addEventListener("click",saveTransaction);

function saveTransaction(){

const name =
document.getElementById("name").value;

const amount =
Number(
document.getElementById("amount").value
);

const type =
document.getElementById("type").value;

const category =
document.getElementById("category").value;

const date =
document.getElementById("date").value;

if(
!name ||
!amount ||
amount<=0 ||
!type ||
!category ||
!date
){

alert("Lengkapi semua field");

return;

}

if(editId){

transactions =
transactions.map(t=>{

if(t.id===editId){

return {

...t,
name,
amount,
type,
category,
date

};

}

return t;

});

editId = null;

}else{

transactions.push({

id:Date.now(),

name,
amount,
type,
category,
date

});

}

StorageManager
.saveTransactions(transactions);

clearForm();
renderTable();

}

function clearForm(){

document.getElementById("name").value="";
document.getElementById("amount").value="";
document.getElementById("type").value="";
document.getElementById("category").value="";
document.getElementById("date").value="";

}

function renderTable(){

const table =
document.getElementById("transactionTable");

let data = [...transactions];

const keyword =
document.getElementById("search")?.value
?.toLowerCase() || "";

const filterType =
document.getElementById("filterType")?.value
|| "";

const sort =
document.getElementById("sort")?.value
|| "newest";

if(keyword){

data = data.filter(item=>

item.name.toLowerCase()
.includes(keyword)

||

item.category.toLowerCase()
.includes(keyword)

);

}

if(filterType){

data = data.filter(
t=>t.type===filterType
);

}

switch(sort){

case "oldest":

data.sort((a,b)=>
new Date(a.date)-new Date(b.date)
);

break;

case "highest":

data.sort((a,b)=>
b.amount-a.amount
);

break;

case "lowest":

data.sort((a,b)=>
a.amount-b.amount
);

break;

default:

data.sort((a,b)=>
new Date(b.date)-new Date(a.date)
);

}

table.innerHTML="";

data.forEach(item=>{

table.innerHTML += `

<tr>

<td>${item.name}</td>

<td>${item.category}</td>

<td>${item.type}</td>

<td>
Rp ${item.amount.toLocaleString()}
</td>

<td>${item.date}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editTransaction(${item.id})">

Edit

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteTransaction(${item.id})">

Hapus

</button>

</td>

</tr>

`;

});

}

function deleteTransaction(id){

if(!confirm("Hapus transaksi?"))
return;

transactions =
transactions.filter(
t=>t.id!==id
);

StorageManager
.saveTransactions(transactions);

renderTable();

}

function editTransaction(id){

const trx =
transactions.find(
t=>t.id===id
);

editId = id;

document.getElementById("name").value =
trx.name;

document.getElementById("amount").value =
trx.amount;

document.getElementById("type").value =
trx.type;

document.getElementById("category").value =
trx.category;

document.getElementById("date").value =
trx.date;

}

document
.getElementById("search")
?.addEventListener("input",
renderTable);

document
.getElementById("filterType")
?.addEventListener("change",
renderTable);

document
.getElementById("sort")
?.addEventListener("change",
renderTable);

document
.getElementById("exportCSV")
?.addEventListener("click",
exportCSV);

document
.getElementById("exportJSON")
?.addEventListener("click",
exportJSON);

function exportCSV(){

let csv =
"Nama,Kategori,Jenis,Jumlah,Tanggal\n";

transactions.forEach(t=>{

csv +=
`${t.name},${t.category},${t.type},${t.amount},${t.date}\n`;

});

const blob =
new Blob([csv],{
type:"text/csv"
});

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;
a.download="transactions.csv";
a.click();

}

function exportJSON(){

const blob =
new Blob(
[
JSON.stringify(
transactions,
null,
2
)
],
{
type:"application/json"
}
);

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;
a.download="transactions.json";
a.click();

}