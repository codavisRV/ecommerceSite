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
            <button className="order-search-btn" id="edit-btn">Update Order</button> <button className="order-search-btn" id="delete-btn">Delete Order</button> <button id="submit-order-btn">Submit order</button>
        </div>
        );
    } else { return null; }
};


export default OrderList;