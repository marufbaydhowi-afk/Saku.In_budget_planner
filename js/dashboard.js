// dashboard.js

document.addEventListener("DOMContentLoaded", () => {

loadDashboard();
initializeDarkMode();

});

function formatRupiah(number){

return new Intl.NumberFormat("id-ID",{
style:"currency",
currency:"IDR",
maximumFractionDigits:0
}).format(number);

}

function loadDashboard(){

const transactions = StorageManager.getTransactions();

const income = transactions
.filter(t=>t.type==="income")
.reduce((a,b)=>a+b.amount,0);

const expense = transactions
.filter(t=>t.type==="expense")
.reduce((a,b)=>a+b.amount,0);

const balance = income-expense;

document.getElementById("totalIncome").innerText =
formatRupiah(income);

document.getElementById("totalExpense").innerText =
formatRupiah(expense);

document.getElementById("totalBalance").innerText =
formatRupiah(balance);

loadLargestCategory();
loadRecentTransactions();
loadChart();
loadBudgetStatus();

}

function loadLargestCategory(){

const transactions =
StorageManager.getTransactions()
.filter(t=>t.type==="expense");

const categories = {};

transactions.forEach(t=>{

categories[t.category] =
(categories[t.category]||0)+t.amount;

});

let largest = "-";
let max = 0;

for(let category in categories){

if(categories[category] > max){

max = categories[category];
largest = category;

}

}

document.getElementById("largestCategory")
.innerText = largest;

}

function loadRecentTransactions(){

const container =
document.getElementById("recentTransactions");

const transactions =
StorageManager.getTransactions()
.sort((a,b)=>
new Date(b.date)-new Date(a.date))
.slice(0,5);

container.innerHTML="";

transactions.forEach(item=>{

container.innerHTML += `

<div class="d-flex justify-content-between border-bottom py-2">

<div>

<strong>${item.name}</strong>
<br>
<small>${item.category}</small>

</div>

<div>

${formatRupiah(item.amount)}

</div>

</div>

`;

});

}

function loadChart(){

const data =
StorageManager.getTransactions();

const income =
data.filter(t=>t.type==="income")
.reduce((a,b)=>a+b.amount,0);

const expense =
data.filter(t=>t.type==="expense")
.reduce((a,b)=>a+b.amount,0);

const ctx =
document.getElementById("incomeExpenseChart");

new Chart(ctx,{

type:"bar",

data:{

labels:["Pemasukan","Pengeluaran"],

datasets:[{

data:[income,expense]

}]

}

});

}

function loadBudgetStatus(){

const budget =
StorageManager.getBudget();

document.getElementById("budgetInput")
.value = budget;

const expense =
StorageManager.getTransactions()
.filter(t=>t.type==="expense")
.reduce((a,b)=>a+b.amount,0);

const alert =
document.getElementById("budgetAlert");

if(!budget) return;

const percentage =
(expense/budget)*100;

if(percentage>=100){

alert.innerHTML=`
<div class="alert alert-danger">
Budget telah habis!
</div>
`;

}

else if(percentage>=80){

alert.innerHTML=`
<div class="alert alert-warning">
Budget mencapai 80%
</div>
`;

}

else{

alert.innerHTML=`
<div class="alert alert-success">
Budget Aman
</div>
`;

}

}

document
.getElementById("saveBudget")
?.addEventListener("click",()=>{

const value =
document.getElementById("budgetInput").value;

StorageManager.saveBudget(value);

loadBudgetStatus();

});

function initializeDarkMode(){

const btn =
document.getElementById("darkModeBtn");

if(localStorage.getItem("darkMode")==="true"){

document.body.classList.add("dark-mode");

}

btn?.addEventListener("click",()=>{

document.body.classList.toggle("dark-mode");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark-mode")
);

});

}