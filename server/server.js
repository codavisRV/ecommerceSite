var express = require('express');
var bodyParser = require('body-parser');

var functions = require('./functions.js');
// var {connection} = require('./connection.js')

var app = express();

app.use(bodyParser.json())

app.get('/products', (req, res) => {
    functions.getAllProducts().then((message)=> {
        res.send(message);
    }, (message) => {
        res.status(404).send(message);
    });
});

app.get('/products/:order', (req, res) => {
    var order = req.params.order;       /// REVIEW THIS: POSSIBLE TO GET THIS FROM REQUEST?
    functions.getOrder(order).then((message)=>{
        res.send(message);      
    },(message)=>{
        res.status(404).send(message);       
    });
});

app.post('/products', (req, res) => {
    var order = req.body.ordered_items;
    functions.placeOrder(order).then((message)=> { ///NEED TO COME REPLACE WITH REQUEST INFO
        res.send(message);
    }, (message) => {
        res.status(404).send(message);
    });
});

app.delete('/products', (req, res) => {
    var order = req.body.order_id; 
    console.log(order);
    functions.deleteOrder(order).then((message)=> { ///NEED TO GET ID FROM REQUEST?
        res.send(message);
    }, (message) => {
        res.status(404).send(message);
    });
});

app.put('/products/:order', (req, res) => {
    var order_id = req.body.order_id;
    var new_order = req.body.updated_items;
    functions.updateOrder(order_id, new_order).then((message)=> { 
        res.send(message);
    }, (message) => {
        res.status(404).send(message);
    });
});



app.listen(3001, () => {
    console.log('Server started on Port 3001...');
});