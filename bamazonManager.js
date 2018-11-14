var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
});
  
function selelectQuery (table, column, value) {
    
    var sql = "SELECT * FROM ?? WHERE ?? = ?";
    var inserts = [table, column, value];
    sql = mysql.format(sql, inserts);
    return sql;
}
  
function selectAllQuery (table) {

    var sql = "SELECT * FROM ?? ";
    var inserts = [table];
    sql = mysql.format(sql, inserts);
    return sql;
}

function insertQuery (table, values) {

    var inserts = [table, values];
    var sql = "INSERT INTO ?? SET ?";
    sql = mysql.format(sql, inserts);
    return sql;
}

function updateQuery(table, sets, values, column, value) {

    var inserts = [table, sets, values, column, value]
    var sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    sql = mysql.format(sql, inserts);
    return sql;
}

function deleteQuery(table, column, value) {

    var inserts = [table, column, value]
    var sql = "DELETE FROM ?? WHERE ?? = ?";
    sql = mysql.format(sql, inserts);
    return sql;
}

function viewProducts () {

    var query = selectAllQuery("products");

    connection.query(query, function(err, results) {

        if (err) throw err;

        var data = [["item_id", "product_name", "price", "stock_quantity"]];

        for (var i = 0; i < results.length; i++) {

            data.push([results[i].item_id, results[i].product_name, '$' + results[i].price, results[i].stock_quantity]);
        }

        connection.end();
        var output = table(data);
        console.log(output);
    });
}

function viewLowInventory() {

    var query = "SELECT * FROM products WHERE stock_quantity < 5";

    connection.query(query, function(err, results) {

        if (err) throw err;

        var data = [["item_id", "product_name", "price", "stock_quantity"]];

        for (var i = 0; i < results.length; i++) {

            data.push([results[i].item_id, results[i].product_name, '$' + results[i].price, results[i].stock_quantity]);
        }

        connection.end();
        var output = table(data);
        console.log(output);
    });
}

function addToInventory () {

    var query = selectAllQuery("products");

    connection.query(query, function(err, results) {

        if (err) throw err;

        var choiceArray = [["item_id", "product_name", "price", "stock_quantity"]];

        for (var i = 0; i < results.length; i++) {

            choiceArray.push([results[i].item_id, results[i].product_name, '$' + results[i].price, results[i].stock_quantity]);
        }
        
        var output = table(choiceArray);
        console.log(output);
    
        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "Type the item_id of the product you will like to add more to:"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many will you add:"
            }
        ]).then(function(answer) {

            var chosenItem = results[answer.id - 1];
            var newQuantity = chosenItem.stock_quantity + parseInt(answer.quantity);
            var sets = ['stock_quantity'];
            var column = 'item_id';
            var query = updateQuery('products', sets, newQuantity, column, answer.id);

            connection.query(query, function (err, results) {

                if (err) throw err;
                viewProducts();
                console.log("item updated succesfully!");
            });
        });
    });
}

function addNewProduct () {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Type the name of the item: "
        },
        {
            name: "department",
            type: "input",
            message: "Type the department for the item: "
        },
        {
            name: "price",
            type: "input",
            message: "Type the price for the item: "
        },
        {
            name: "quantity",
            type: "input",
            message: "Type the quantity for the item: "
        }
    ]).then(function(answer) {

        var name = answer.name.trim();
        var department = answer.department.trim();
        var quantity = parseInt(answer.quantity);
        var price = answer.price;
        var values = {product_name: name, department_name: department, price: price, stock_quantity: quantity};
        var query = insertQuery("products", values);

        connection.query(query, function(err, results) {

            if (err) throw err;
            console.log("item added succesfully!");
            menu();
        })
    });
}

function menu () {

    inquirer.prompt([
        {
            name: "choice",
            type: "rawlist",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            message: "Choose from the following options: "
        }
    ]).then(function(answer) {

        if (answer.choice == "View Products for Sale")
            viewProducts();

        else if (answer.choice == "View Low Inventory")
            viewLowInventory();

        else if (answer.choice == "Add to Inventory")
            addToInventory();

        else if (answer.choice == "Add New Product")
            addNewProduct();

        else if (answer.choice == "Exit")
            connection.end();
    });
}

menu();