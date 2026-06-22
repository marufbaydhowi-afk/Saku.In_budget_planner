const transactions =
StorageManager.getTransactions();

initializeAnalytics();

function formatRupiah(value){

return new Intl.NumberFormat(
"id-ID",
{
style:"currency",
currency:"IDR",
maximumFractionDigits:0
}
).format(value);

}

function initializeAnalytics(){

loadStatistics();

loadPieChart();

loadBarChart();

loadLineChart();

}

function loadStatistics(){

const income =
transactions.filter(
t=>t.type==="income"
);

const expense =
transactions.filter(
t=>t.type==="expense"
);

const totalExpense =
expense.reduce(
(a,b)=>a+b.amount,
0
);

const totalIncome =
income.reduce(
(a,b)=>a+b.amount,
0
);

const maxExpense =
expense.length
?
Math.max(
...expense.map(t=>t.amount)
)
:0;

document.getElementById(
"totalTransactions"
).innerText =
transactions.length;

document.getElementById(
"avgExpense"
).innerText =
formatRupiah(
expense.length
?
totalExpense/expense.length
:0
);

document.getElementById(
"avgIncome"
).innerText =
formatRupiah(
income.length
?
totalIncome/income.length
:0
);

document.getElementById(
"maxExpense"
).innerText =
formatRupiah(maxExpense);

}

function loadPieChart(){

const expenseData =
transactions.filter(
t=>t.type==="expense"
);

const categoryTotals = {};

expenseData.forEach(item=>{

categoryTotals[item.category] =
(categoryTotals[item.category]||0)
+
item.amount;

});

new Chart(

document.getElementById(
"pieChart"
),

{

type:"pie",

data:{

labels:
Object.keys(categoryTotals),

datasets:[{

data:
Object.values(categoryTotals)

}]

}

}

);

}

function loadBarChart(){

const income =
transactions
.filter(t=>t.type==="income")
.reduce((a,b)=>a+b.amount,0);

const expense =
transactions
.filter(t=>t.type==="expense")
.reduce((a,b)=>a+b.amount,0);

new Chart(

document.getElementById(
"barChart"
),

{

type:"bar",

data:{

labels:[
"Pemasukan",
"Pengeluaran"
],

datasets:[{

label:"Total",

data:[
income,
expense
]

}]

}

}

);

}

function loadLineChart(){

const dailyTotals = {};

transactions
.filter(
t=>t.type==="expense"
)
.forEach(item=>{

dailyTotals[item.date] =
(dailyTotals[item.date]||0)
+
item.amount;

});

const labels =
Object.keys(dailyTotals)
.sort();

const values =
labels.map(
date=>dailyTotals[date]
);

new Chart(

document.getElementById(
"lineChart"
),

{

type:"line",

data:{

labels,

datasets:[{

label:
"Pengeluaran Harian",

data:values,

fill:false,

tension:0.3

}]

}

}

);

}