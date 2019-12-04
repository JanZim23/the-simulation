import React from "react";
import axios from "axios";
import "../App.css";
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
// import LineGraph from "./Components/LineGraph";
import JoinGameMenu from "./JoinGameMenu";

import socket from "../socket";

const map_spending_to_data = spending => {
  console.log(spending);
  let children = Object.keys(spending).map(key => {
    return {
      name: key,
      value: spending[key]
    };
  });
  return {
    children,
    name: "Spending"
  };
};

class App extends React.Component {
  constructor(props) {
    super(props);

    // Bind the this context to the handler function
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleFailure = this.handleFailure.bind(this);

    this.state = {
      spending: [],
      metrics: [],
      id: 0,
      intervalIsSet: false,
      loggedIn: false,
      name: null,
      game: null,
      channel: null
    };
  }

  // Sets an interval to retrieve data from the server every second.
  componentDidMount() {
    if (this.state.reqSignIn) {
    }
  }

  // Handles a successful login
  handleSuccess(channel, game_id, player_id, player_name) {
    channel.on("tick", resp => {
      this.setGameState(this, resp);
    });
    this.setState({
      loggedIn: true,
      name: player_name,
      game: game_id,
      player_id: player_id,
      channel: channel
    });
  }

  // Handles a failed or no login
  handleFailure() {
    this.setState({
      loggedIn: false
    });
  }

  setGameState(cmp, game_state) {
    console.log("Tick:", game_state);
    cmp.setState({
      spending: map_spending_to_data(game_state.spending),
      metrics: game_state.metrics,
      gameState: game_state
    });
  }

  // Puts the user's updated policy to the server.
  putData = () => {
    var userInfo = {
      game: this.state.game
    };
    var query = "http://localhost:3001/putData";
    axios.post(query, userInfo);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>The Simulation</h1>
        </header>
        {this.state.loggedIn ? (
          <div className={this.state.loggedIn ? "game" : "pre-game"}>
            <TreeMap
              height={300}
              width={300}
              data={this.state.spending}
              valueUnit={"B $"}
            />
            <div style={{ padding: "10px" }}>
              <h3>Budget</h3>
              <input
                type="text"
                placeholder="Climate"
                id="climate"
                style={{ width: "200px" }}
              />
              <input
                type="text"
                placeholder="Welfare"
                id="welfare"
                style={{ width: "200px" }}
              />
              <input
                type="text"
                placeholder="Military"
                id="military"
                style={{ width: "200px" }}
              />
              <input
                type="text"
                placeholder="Health"
                id="health"
                style={{ width: "200px" }}
              />
              <input
                type="text"
                placeholder="Education"
                id="education"
                style={{ width: "200px" }}
              />
              <button onClick={() => this.postNewBudget()}>
                Propose Budget
              </button>
            </div>
          </div>
        ) : (
          <div className="login">
            <JoinGameMenu
              success={this.handleSuccess}
              failure={this.handleFailure}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
