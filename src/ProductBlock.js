import React from 'react';

function ProductBlock(props) {
    return (
        <div className="product-block" id={props.product_id}>
            <h3>{props.name}</h3>
            <img src={props.img} alt={props.alt} />
            <a href={props.img} download><button>Download</button></a>
            <p>Description: {props.description}</p>
            <p>Print price: ${props.price}</p>
            <button className="product-button" id={"product-" + props.product_id + "-btn"} onClick={props.handleClick}>Add to order</button>
        </div>
    );
};

export default ProductBlock;