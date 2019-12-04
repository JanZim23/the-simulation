import React from 'react';
import '../css/EventPopUp.css'

// PopUp that opens when an event from the server is detected.
class EventPopUp extends React.Component {
    render() {
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <h1>{this.props.text}</h1>
                    <button onClick={this.props.closePopup}>Close</button>
                </div>
            </div>
        );
    }
}

export default EventPopUp;