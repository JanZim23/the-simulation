import React from 'react';
import Axios from 'axios';

// Page shown when someone is signing in.
class JoinGameMenu extends React.Component {
    state = {
        name: null,
        game: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.temp
        };
    };

    // Posts a new player's name to the backend.
    postPlayer = (name, game) => {
        Axios.post('http://localhost:3001/getData', {
            name: this.state.name,
            game: this.state.game
        })
            .then((response) => {
                if (response.status === 200) {
                    this.props.success(name, game);
                } else {
                    this.props.failure();
                }
            });
    }

    render() {
        return (
            <div id='newPlayerForm'>
                <input id='name' placeholder='Name' />
                <input id='gameName' placeholder='Game to join' />
                <button onClick={() => this.postPlayer(document.getElementById('name').value,
                document.getElementById('gameName').value)}>
                    Join Game
                </button>
            </div>
        )
    }
}

export default JoinGameMenu;