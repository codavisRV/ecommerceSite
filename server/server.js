var express = require('express');
var bodyParser = require('body-parser');


var functions = require('./functions.js');


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

// app.post('/zip', (req, res) => {
//     var zip = new JSZip();
//     var images = zip.folder('images');
//     const tmpdir = os.tmpdir()
//     ///create a temp dir with fs
//     fs.mkdtemp(tmpdir+sep, (err, folder) => {
//         if (err) {console.log('ERROR: ' + err);}
//         var dir = folder;
//         req.body.order.forEach((item) => {
//             // var data = base64Img.base64Sync('../public' + item.url);
//             images.file(item.file_name+'.jpg', '../public' + item.url);
//         });
//         // nodestream zipfile
//             // zip.generateNodeStream({type:'nodebuffer', streamFiles:true})
//             // .pipe(fs.createWriteStream(dir+'/images.zip'))
//             // .on('finish', function() {
//             //     // send the file back to the user in the header
//             //     res.sendFile('/images.zip', {
//             //         root: dir
//             //     });
//             // });
//         zip.generateAsync({type:'nodebuffer'}).then((file)=>{
//             console.log(file);
//             res.sendFile(file, {root: dir});
//         }, (err)=>{
//             console.log(err);
//         });
//     });

    
//       //use filesaver to saveas to the user in React
// });

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
    functions.deleteOrder(order).then((message)=> { ///NEED TO GET ID FROM REQUEST?
        res.send(message);
    }, (message) => {
        res.status(404).send(message);
    });
});

app.put('/products', (req, res) => {
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