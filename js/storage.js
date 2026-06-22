class StorageManager {

static TRANSACTIONS_KEY = "transactions";

static CATEGORIES_KEY = "categories";

static BUDGET_KEY = "budget";


// kategori default

static initialize() {

if(!localStorage.getItem(this.CATEGORIES_KEY)){

const defaultCategories = [

"Makanan",
"Transportasi",
"Hiburan",
"Pendidikan",
"Tagihan"

];

localStorage.setItem(
this.CATEGORIES_KEY,
JSON.stringify(defaultCategories)
);

}

if(!localStorage.getItem(this.TRANSACTIONS_KEY)){

const dummyTransactions = [

{
id:1,
name:"Uang Saku",
amount:1500000,
type:"income",
category:"Beasiswa",
date:"2025-01-01"
},

{
id:2,
name:"Makan Siang",
amount:25000,
type:"expense",
category:"Makanan",
date:"2025-01-02"
},

{
id:3,
name:"Transport Kampus",
amount:15000,
type:"expense",
category:"Transportasi",
date:"2025-01-03"
}

];

localStorage.setItem(
this.TRANSACTIONS_KEY,
JSON.stringify(dummyTransactions)
);

}

}

static getTransactions(){

return JSON.parse(
localStorage.getItem(this.TRANSACTIONS_KEY)
)||[];

}

static saveTransactions(data){

localStorage.setItem(
this.TRANSACTIONS_KEY,
JSON.stringify(data)
);

}

static getCategories(){

return JSON.parse(
localStorage.getItem(this.CATEGORIES_KEY)
)||[];

}

static saveCategories(categories){

localStorage.setItem(
this.CATEGORIES_KEY,
JSON.stringify(categories)
);

}

static saveBudget(amount){

localStorage.setItem(
this.BUDGET_KEY,
amount
);

}

static getBudget(){

return Number(
localStorage.getItem(this.BUDGET_KEY)
)||0;

}

}

StorageManager.initialize();