import React from 'react';

function ThankYou(props) {
    if (props.show) {
        return(
            <div id="thank-you">
                <h2>{props.response}</h2>
                <p>For future reference, your order number is 1.</p>
                <button id="reset-page" onClick={props.reset}>Place a new order</button>
            </div>
            
        )
    } else {return null;}
}

export default ThankYou;