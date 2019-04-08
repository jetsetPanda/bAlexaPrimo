const inquirer = require('inquirer');
const mysql = require('mysql');
const fancyline = "----------------------------------------------------------------";
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'megatron81',
    database: 'bamazon'
});

connection.connect();

start()

function start() {
    connection.query('SELECT * FROM products', (error, res) => {
        if (error) throw error;

        console.log(`\nBamazon Prime Menu: \n`);
        console.log(fancyline);
        res.forEach(row => {
            console.log(`Id #${row.item_id} \| Product: ${row.product_name} \| Price: ${row.price}`); 
            // \| Department: ${row.department_name} \| No. in Stock: ${row.stock_quantity}`);
        });
        console.log(fancyline);
        userPrompts();
    })
};

const userPrompts = () => {
    inquirer.prompt([
        {
            message: "What is the ID of the product you'd like to buy?",
            type: "input",
            name: "inputID"
        },
        {
            message: "How many units of this product would you like to buy?",
            type: "input",
            name: "inputQty"
        }
    ]).then((ans) => {
        let inputID = ans.inputID;
        let inputQty = ans.inputQty;

        getProduct(inputID, inputQty)
    });
}

function getProduct(inputID, inputQty) {
    connection.query('SELECT * FROM products', (error, res) => {
        if (error) throw error;
        let product;
        // console.log(res);

        for(let i=0; i < res.length; i++){
            if(res[i].item_id == inputID){
                product = res[i];
            }
        }
        // console.log(product, "product iz found");
        if(product.stock_quantity >= inputQty) {
            fulfillOrder(product, inputID, inputQty);
            connection.end();
        } else {
            console.log("Oops! We are unable to fulfill your order: Insufficient Quantity.");
            connection.end();
        }
    })
};

const fulfillOrder = (product, inputID, inputQty) => {
    let updateQty = product.stock_quantity - inputQty;
    let billAmt = product.price * inputQty;
    let queryUno = "UPDATE products SET stock_quantity = ? where ?";
    let queryDos = "UPDATE products SET product_sales = ? where ?";
    
    connection.query(queryUno,[updateQty,{item_id: inputID}], (error, res) => {});

    connection.query(queryDos,[billAmt, {item_id: inputID }], (error, res) => {});

    console.log(`BTW, your total is ${billAmt} okurrr`);
}