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

function checkInventory (chosenItem, quantity) {

    if (chosenItem.stock_quantity >= quantity) {

        var newQuantity = chosenItem.stock_quantity - quantity;
        var sets = ['stock_quantity'];
        var column = 'item_id';
        var query = updateQuery('products', sets, newQuantity, column, chosenItem.item_id);

        connection.query(query, function(err, results) {

            if (err) throw err;

            var total = chosenItem.price * parseInt(quantity);
            connection.end();
            console.log("Your total is $" + total);
        });
    }
    
    else {

        connection.end();
        console.log("Insufficient quantity!");
    }
}

function getProducts () {

    var query = selectAllQuery("products");

    connection.query(query, function(err, results) {

        if (err) throw err;

        var choiceArray = [["item_id", "product_name", "price"]];

        for (var i = 0; i < results.length; i++) {

            choiceArray.push([results[i].item_id, results[i].product_name, '$' + results[i].price]);
        }
        
        var output = table(choiceArray);
        console.log(output);
    
        inquirer.prompt([
            {
                name: "id",
                type: "text",
                message: "Type the item_id of the product you will like to buy:"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many will you will to buy:"
            }
        ]).then(function(answer) {

            var chosenItem;

            for (var i = 0; i < results.length; i++) {

                if (results[i].item_id == answer.id) {
                    chosenItem = results[i];
                    checkInventory(chosenItem, answer.quantity);
                }
            }
        });
    });
}

connection.connect(function(err) {

    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    getProducts();
});