var mysql = require('mysql');
var {connection} = require('./connection.js')

var getAllProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT product_id, Products.name as name, Products.description as description, price, url, caption  FROM Products JOIN Photos on Products.photo_id=Photos.id;', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results); 
            }
        });
    });
}

var getOrder = (order_id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT Products.product_id, name, price FROM Orders JOIN Ordered_Items ON Orders.order_id = Ordered_Items.order_id JOIN Products ON Ordered_items.product_id = Products.product_id WHERE Orders.order_id=?;', [order_id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results); 
            }
        });
    });
}

var placeOrder = (order_arr) => {
    return new Promise((resolve, reject)=> {
        var orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        connection.query("INSERT INTO Orders (order_time) VALUES (?);", [orderDate], (error, results, fields) => {
            if (error) {
                reject(error);
            } 
        });
        order_arr.forEach((i) => {
            connection.query("INSERT INTO Ordered_Items(order_id, product_id) VALUES (LAST_INSERT_ID(), ?);", [i.product_id], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results); 
                }
            });
        }, this);
    });
}

var deleteOrder = (order_id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM Orders WHERE order_id = ?;', [order_id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results); 
            }
        });
    });
}

var updateOrder = (order_id, new_order) => {
    return new Promise((resolve, reject)=> {
        getOrder(order_id).then((message)=>{
            var prev_order = [];
            message.forEach((i) => {
                prev_order.push(i.product_id); 
            });  
            new_order.forEach((i) => {    //check if the item is in the current orders,
                if (prev_order.indexOf(i.product_id) === -1) { // if not, then query to add it.
                    connection.query("INSERT INTO Ordered_Items(order_id, product_id) VALUES (?, ?);", [order_id, i.product_id], (error, results, fields) => {
                        if (error) {
                            reject(error);
                        }
                    });    
                } else { // if it is, then remove from the array copy.
                    prev_order.splice(prev_order.indexOf(i.product_id), 1);
                }
            }, this);
            if (prev_order.length !== 0) {   //take the copy array, and anything remaining should be deleted. 
                prev_order.forEach((item) => {  
                    connection.query('DELETE FROM Ordered_Items WHERE product_id = ?;', [item], (error, results, fields) => {
                        if (error) {
                            reject(error);
                        } 
                    });
                }, this);
            }
            resolve(message);  
        },(message)=>{
            reject(message);
        });
    });
}



module.exports = {
    getAllProducts,
    getOrder,
    placeOrder,
    deleteOrder,
    updateOrder
    
}