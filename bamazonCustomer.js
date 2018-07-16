var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

//upon a succesful check of the users input, this will lower the stock level in the database
function reduceStock(id, quantityReduced) {
    var query = connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - " + quantityReduced + " WHERE item_id = " + id,
        function (err, res) {
            if (err) {
                console.log(err);
            }
        }
    )
};

//takes users input for what they want to buy and compares it
function userPromptAndCheck(res) {
    inquirer.prompt([{
        name: 'wantedID',
        type: 'input',
        message: "Specified by ID, what product did you want?"
    },
    {
        name: 'quantity',
        type: 'input',
        message: "How many do you want?"
    }]).then(function (answers) {
        //finds item based of users input (res is the response from connection) and then compares quantity wanted to stock quantity
        var selectedItem = res.find(function (element) {
            return element.item_id === parseInt(answers.wantedID);
        });
        if (selectedItem.stock_quantity >= answers.quantity) {
            reduceStock(answers.wantedID, answers.quantity);
            console.log("Item Sold!");
            console.log("Total price: $" + selectedItem.price * answers.quantity);
            connection.end();
        }
        else {
            console.log("Not enough stock to complete order.");
            connection.end();
        }
    })
};

//pulls and displays info from database then calls prompt function
function runApp() {
    var query = connection.query(
        "SELECT * FROM products", function (err, res) {
            var productArray = []
            console.log("Available Products:");
            for (var i = 0; i < res.length; i++) {
                console.log("Item Code: " + res[i].item_id + " | Product: " + res[i].product_name + " | Price: $" + res[i].price);
                productArray.push(res[i]);
            }
            userPromptAndCheck(res);
        });
};

runApp();
