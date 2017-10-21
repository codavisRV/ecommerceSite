import React from 'react';
import Rows from './Rows.js';
import OrderButtons from './OrderButtons.js'

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
            <OrderButtons isNewOrder={props.isNewOrder} handleSubmitClick={props.handleSubmitClick} handleUpdateClick={props.handleUpdateClick} handleDeleteClick={props.handleDeleteClick}/>
        </div>
        );
    } else { return null; }
};


export default OrderList;