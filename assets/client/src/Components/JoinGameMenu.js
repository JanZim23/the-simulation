import React from 'react';
import Axios from 'axios';

// Page shown when someone is signing in.
class JoinGameMenu extends React.Component {
    state = {
        id: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.temp
        };
    };

    // Posts a new player's name to the backend.
    postPlayer = (name) => {
        Axios.post('http://localhost:3001/getData', {
            name: this.state.name
        });
        this.props.success(name);
    }

    render() {
        return (
            <div id='newPlayerForm'>
                <input id='name' placeholder='Name' />
                <button onClick={() => this.postPlayer(document.getElementById('name').value)}>
                    Join Game
                </button>
            </div>
        )
    }
}

export default JoinGameMenu;