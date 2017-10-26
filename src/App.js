import React, { Component } from 'react';
import FileSaver from 'filesaver.js';

import OrderList from './OrderList.js';
import ProductBlock from './ProductBlock.js';
import data from './data';
import ThankYou from './ThankYou.js';


import './App.css';


var JSZip = require("jszip");
var zip;
const request = require('superagent');


class App extends Component {
  constructor() {
    super();
    this.state=data;
    this.handleAddToOrder = this.handleAddToOrder.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleDownloadPhotos = this.handleDownloadPhotos.bind(this);
    
  }

  componentDidMount() {
    request.get('/products').end((err, res) => {
      var products = [];
      res.body.forEach(function(product) {
        products[product.product_id] = product;
      }, this);
      this.setState({products});
    }
  )};

  handleAddToOrder(event) {
    event.preventDefault();
    var id=event.target.parentNode.id;
    var newState = Object.assign({}, this.state);
    newState.curOrderActive ? newState.curOrder.push(newState.products[id]) : newState.searchedOrder.push(newState.products[id]);
    newState.showOrderBox = true;
    newState.searchDisabled = true;
    this.setState(newState);
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    if (this.state.searchBoxText !== "" && (this.state.searchDisabled === false || this.state.curOrder.length === 0)) {
      request.get('/products/'+this.state.searchBoxText).end((err, res)=> {
        if (res.body.length > 0) {
          var newState = Object.assign({}, this.state);
          res.body.forEach((product)=>{
            newState.searchedOrder.push(product);
          })
          newState.showOrderBox = true;
          newState.curOrderActive = false;
          newState.searchDisabled = true;
          this.setState(newState);
        } else alert("No order with that number");
      }, this)
    }
  }

  handleSearchChange(event) {
    var newState = Object.assign({}, this.state);
    newState.searchBoxText = event.target.value;
    this.setState(newState);
  }

  handleRemoveItem(event) {
    var rowId= parseInt(event.target.parentNode.parentNode.id.slice(3), 10);
    var newState = Object.assign({}, this.state);
    var order = newState.curOrderActive ? newState.curOrder : newState.searchedOrder;
    order.splice(rowId, 1);
    if (order.length === 0) {
      newState.showOrderBox = false;
    }
    this.setState(newState);
  }

  handleUpdateClick (event) {
    var req = {order_id: this.state.searchBoxText, updated_items: this.state.searchedOrder};
    request.put('/products')
    .set("Content-Type", "application/json")
    .send(req)
    .end((err, res)=> {
      if (err) {
        alert("There was an error connecting to the server.")
      } else {
        var newState = Object.assign({}, this.state);        
        newState.showOrderBox = false;
        newState.downloads = newState.searchedOrder;
        newState.curOrder = [];
        newState.searchedOrder = [];
        newState.curOrderID = newState.searchBoxText;
        newState.searchBoxText = "";
        newState.responseText = "Order updated";
        newState.showThankYou = true;
        this.setState(newState);
      }
    }, this);
  }

  handleSubmitClick(event) {
    event.preventDefault();
    var req =  this.state.curOrderActive ? {ordered_items: this.state.curOrder} : {ordered_items: this.state.searchedOrder};
    request.post('/products')
    .send(req)
    .end((err, res)=> {
      if (err) {
        alert("There was an error connecting to the server.");
      } else {
        var response = JSON.parse(res.text);
        var newState = Object.assign({}, this.state);
        newState.downloads = newState.curOrderActive ? newState.curOrder : newState.searchedOrder;
        newState.curOrderID = response.insertId;
        newState.showThankYou = true;
        newState.showOrderBox = false;
        newState.curOrder = [];
        newState.searchedOrder = [];
        newState.searchBoxText = "";
        newState.responseText = "Thanks for your order";
        this.setState(newState);

      }
    }, this);
  }

  handleResetClick(event) {
    var newState = Object.assign({}, this.state);
    newState.showThankYou = false;
    newState.searchDisabled = false;
    newState.curOrderID = "";
    newState.responseText = "";
    this.setState(newState);
  } 

  handleDeleteClick(event) {
    var req = {order_id: this.state.searchBoxText};
    request.delete('/products')
    .send(req)
    .set("Content-Type", "application/json")    
    .end((err, res)=> {
      if (err) {
        alert("There was an error connecting to the server.");
      } else {
        if (res.body.affectedRows === 1) {
          var newState = Object.assign({}, this.state);
          newState.responseText = "Order deleted";
          newState.showThankYou = true;
          newState.showOrderBox = false;
          this.setState(newState);
        }
      }
    }, this);
  }

  handleDownloadPhotos() {
    zip = new JSZip();
    var images = zip.folder('images');
    var items = Object.assign({}, this.state)
    items.downloads.forEach((item) => {
      images.file(item.file_name+'.jpg', __dirname+'../public'+item.url);
    });
    zip.generateAsync({type:'blob'}).then((file)=>{
      FileSaver.saveAs(file, "images.zip");
    }, (err)=>{
      console.log(err);
    });

}

  render() {
    const productList = this.state.products.map((product, index)=>{
      return (<ProductBlock 
      key={index}
      img={process.env.PUBLIC_URL + product.url} 
      name={product.name} 
      price={product.price}
      description={product.description}
      alt={product.caption}
      product_id={product.product_id}
      handleClick={this.handleAddToOrder}

      />  )          
  })

  
    return (
      <div>
        <header>
          <h1>Order Photo Prints</h1>            
          <div className="order-search">
              <form id="search-bar" >
                  <input type="number" id="search-box" name="search-box" placeholder="Search for order" onChange={this.handleSearchChange} value={this.state.searchBoxText} />
                  <input type="submit" id="search-submit-btn" value="Search" onClick={this.handleSearchSubmit} />
              </form>
              <OrderList 
              showList={this.state.showOrderBox} 
              orders = {this.state.curOrderActive ? this.state.curOrder : this.state.searchedOrder} 
              handleRemoveItem={this.handleRemoveItem}
              handleUpdateClick={this.handleUpdateClick} 
              handleSubmitClick={this.handleSubmitClick}
              handleDeleteClick={this.handleDeleteClick}
              isNewOrder = {this.state.curOrderActive}
              />
              <ThankYou 
              show={this.state.showThankYou} 
              reset={this.handleResetClick} 
              response={this.state.responseText} 
              download={this.handleDownloadPhotos}
              id={this.state.curOrderID}
              /> 
          </div>
        </header>
        <div className="wrapper">
          <h2>Browse the photos below to order a print copy.</h2>
          {productList}
            
          <div id="place-order">
          </div>
        </div>
        <footer>
          <p>&copy; Courtney Price Davis 2017</p>
        </footer>      
      </div>
    );
  }
}

export default App;
