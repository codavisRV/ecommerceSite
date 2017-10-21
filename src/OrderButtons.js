import React from 'react';

function OrderButtons(props) {
    if (props.isNewOrder) {
        return (<button id="submit-order-btn" onClick={props.handleSubmitClick}>Submit order</button>)
    } else {
        return (
            <div><button className="order-search-btn" id="edit-btn" onClick={props.handleUpdateClick}>Update Order</button> <button className="order-search-btn" id="delete-btn" onClick={props.handleDeleteClick}>Delete Order</button></div>
        )
    }
}

export default OrderButtons;

