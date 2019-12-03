import React from "react";
import Axios from "axios";

import socket from "../socket";

const makeid = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

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
  }

  // Posts a new player's name to the backend.
  postPlayer = (player_name, game_id) => {
    let player_id = makeid(10);
    // Now that you are connected, you can join channels with a topic:
    let channel = socket.channel(`game:${game_id}`, {
      player_id: player_id,
      name: player_name
    });
    channel
      .join()
      .receive("ok", resp => {
        this.props.success(channel, game_id, player_id, player_name);
      })
      .receive("error", resp => {
        this.props.failure();
      });
  };

  render() {
    return (
      <div id="newPlayerForm">
        <input id="name" placeholder="Name" />
        <input id="gameName" placeholder="Game to join" />
        <button
          onClick={() =>
            this.postPlayer(
              document.getElementById("name").value,
              document.getElementById("gameName").value
            )
          }
        >
          Join Game
        </button>
      </div>
    );
  }
}

export default JoinGameMenu;
