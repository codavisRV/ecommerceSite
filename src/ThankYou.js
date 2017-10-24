import React from 'react';

function ThankYou(props) {
    if (props.show) {
        return(
            <div id="thank-you">
                <h2>{props.response}</h2>
                <p>For future reference, your order number is {props.id}.</p>
                <button id="reset-page" onClick={props.reset}>Place a new order</button> <button id="download-photos" onClick={props.download}>Download</button>
            </div>
            
        )
    } else {return null;}
}

export default ThankYou;