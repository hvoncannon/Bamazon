var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

//finds that user wants to do and calls the appropriate function
function userPromptAndAction() {
    inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (answers) {
        if (answers.action === 'View Products for Sale') {
            viewProducts();
        }

        else if (answers.action === 'View Low Inventory') {
            viewLow();
        }

        else if (answers.action === 'Add to Inventory') {
            addInventory();
        }

        else if (answers.action === 'Add New Product') {
            addProduct();
        }
    });
};

//returns all products in table
function viewProducts() {
    var query = connection.query(
        "SELECT * FROM products", function (err, res) {
            console.log("All Products:");
            for (var i = 0; i < res.length; i++) {
                console.log("Item Code: " + res[i].item_id + " | Product: " + res[i].product_name + " | Price: $" + res[i].price + " | Stock Level: " + res[i].stock_quantity);
            };
            connection.end();
        });
};

//returns all products with stock level 5 or under
function viewLow() {
    var query = connection.query(
        "SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
            if (res.length === 0) {
                console.log("No items with stock less than 5 units")
            }
            else {
                console.log("Low Stock Products:");
                for (var i = 0; i < res.length; i++) {
                    console.log("Item Code: " + res[i].item_id + " | Product: " + res[i].product_name + " | Price: $" + res[i].price + " | Stock Level: " + res[i].stock_quantity);
                };
            };
            connection.end();
        });
};

//allows a user to add inventory to existing products
function addInventory() {
    var query = connection.query(
        "SELECT * FROM products", function (err, res) {
            var itemArray = [];
            for (var i = 0; i < res.length; i++) {
                itemArray.push(res[i].product_name);
            };
            inquirer.prompt([{
                name: 'whatProduct',
                type: 'list',
                message: 'Which product did you want to add stock to?',
                choices: itemArray
            },
            {
                name: 'amount',
                type: 'input',
                message: "How many would you like to add?"
            }]).then(function (answers) {
                connection.query(
                    "UPDATE products SET stock_quantity = stock_quantity + " + answers.amount + " WHERE product_name = " + "'" + answers.whatProduct + "'", (function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("Added " + answers.amount + " to stock.")
                        }
                        connection.end();
                    })
                );
            });
        });
};

//adds a new product
function addProduct() {
    inquirer.prompt([{
        name: 'prodName',
        type: 'input',
        message: "What is the product's name?"
    },
    {
        name: 'department',
        type: 'input',
        message: "What department should it be placed in?"
    },
    {
        name: 'price',
        type: 'input',
        message: 'What is the price?'
    },
    {
        name: 'quantity',
        type: 'input',
        message: "What is the initial stock quantity?"
    }]).then(function (answers) {
        var query = connection.query(
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answers.prodName + "','" + answers.department + "'," + answers.price + ',' + answers.quantity + ')',
            function (err, res) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Product added succesfully.");
                };
                connection.end();
            }
        );
    });
};

userPromptAndAction();