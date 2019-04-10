const inquirer = require('inquirer');
const mysql = require('mysql');
const fancyline = "------------------------------------------------------------------------------------";
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

        // console.log("     _   _   _   _   _   _   _     _   _   _   _   _");  
        // console.log("    / \\ / \\ / \\ / \\ / \\ / \\ / \\   / \\ / \\ / \\ / \\ / \\"); 
        // console.log("   ( B | a | m | a | z | o | n ) ( P | r | i | m | o )");
        // console.log("    \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/   \\_/ \\_/ \\_/ \\_/ \\_/"); 

        console.log("    __                                                          _");                
        console.log("   / /_  ____ _____ ___  ____ _____  ____  ____     ____  _____(_)___ ___  ____"); 
        console.log("  / __ \\/ __ `/ __ `__ \\/ __ `/_  / / __ \\/ __ \\   / __ \\/ ___/ / __ `__ \\/ __ \\");
        console.log(" / /_/ / /_/ / / / / / / /_/ / / /_/ /_/ / / / /  / /_/ / /  / / / / / / / /_/ /");
        console.log("/_.___/\\__,_/_/ /_/ /_/\\__,_/ /___/\\____/_/ /_/  / .___/_/  /_/_/ /_/ /_/\\____/"); 
        console.log("                                                /_/");                             
        
        console.log("\n" + fancyline);
        console.log("\nWelcome to Bamazon Primo, I am your virtual assistant Balexa. Here are our offerings:")
        console.log("\n" + fancyline + "\n");
        res.forEach(row => {
            console.log(`Product Id: ${row.item_id}  \| Item: ${row.product_name} \| ($${row.price})`); 
            // \| Department: ${row.department_name} \| No. in Stock: ${row.stock_quantity}`);
        });
        console.log(fancyline + "\n");
        userPrompts();
    })
};

const userPrompts = () => {
    inquirer.prompt([
        {
            message: "Balexa >>> What is the ID of the product you'd like to buy? >>> ",
            type: "input",
            name: "inputID"
        },
        {
            message: "Balexa >>> How many of this item would you like to buy? >>>",
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
            console.log(`\n${fancyline}\n\n! Balexa >>> Oops! We are unable to fulfill your order: Insufficient Quantity.`);
            console.log(`\n! Bbezos >>> Psst, try ordering less of this or buy a different product.. BUY BUY BABY! :D \n\n${fancyline}`);
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

    console.log(`\n${fancyline}\n\n* Balexa >>> Your order total: $${billAmt}. Payable in USD or BTC Thx!`);
    console.log(`\n* Bbezos >>> Thanks for your purchase! Mmm money! :D\n\n${fancyline}`);
}