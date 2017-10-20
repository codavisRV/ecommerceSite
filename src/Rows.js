import React from 'react';

function Rows(props) {
    if (props.order) {
        return (
            <tr id={"Row"+props.index}>
                <td>{props.order.name}</td>
                <td>{props.order.price}</td>
                <td><button onClick={props.handleRemoveItem}>X</button></td> 
            </tr>
            )
    } else {return null;}
    
}

export default Rows;
