import React from 'react';
import Rows from './Rows.js';

function OrderList(props) {
    if (props.showList) {
        var orders = props.orders.map((order, index)=>{
            return <Rows order={order} key={index} index={index} handleRemoveItem={props.handleRemoveItem} />
        });
        return(
        <div className="order-list">
            <h3>Your Order</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                    </tr>
                    {orders}
                </tbody>
            </table>
            <button className="order-search-btn" id="edit-btn" onClick={props.handleUpdateClick}>Update Order</button> <button className="order-search-btn" id="delete-btn" onClick={props.handleDeleteClick}>Delete Order</button> <button id="submit-order-btn" onClick={props.handleSubmitClick}>Submit order</button>
        </div>
        );
    } else { return null; }
};


export default OrderList;