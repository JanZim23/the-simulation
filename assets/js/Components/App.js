import React from "react";
import axios from "axios";
import "../App.css";
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
// import LineGraph from "./Components/LineGraph";
import JoinGameMenu from "./JoinGameMenu";
import TemperatureGraph from "./temperature/TemperatureGraph";
import SafetyGraph from "./safety/Graph";

import CostOfLivingGraph from "./cost_of_living/Graph";

import socket from "../socket";
import Priorities from "./Priorities";
import Player from "./Player";
import PlayerList from "./PlayerList";

const formatDate = date => {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  var dayOfWeek = date.getDay();

  return (
    weekDays[dayOfWeek] + " " + day + " " + monthNames[monthIndex] + " " + year
  );
};

export const spendingNameOf = key => {
  return key === "climate"
    ? "Climate Control"
    : key === "military"
    ? "Military Budget"
    : key === "welfare"
    ? "Social Security & Welfare"
    : key === "health"
    ? "Medicare & Medicade & Health"
    : key === "education"
    ? "Education"
    : key === "treasury"
    ? "Dept. Treasury"
    : key === "veteran"
    ? "Veteran Affairs"
    : key === "agriculture"
    ? "Dept. Agriculture"
    : key === "transportation"
    ? "Dept. Transportation"
    : key === "hud"
    ? "Housing and Urban Dev."
    : key === "labor"
    ? "Department of Labour"
    : key === "doj"
    ? "Dept. Justice"
    : "Misc.";
};

const map_spending_to_data = spending => {
  //console.log(spending);
  let children = Object.keys(spending).map(key => {
    var spending_name = spendingNameOf(key);

    return {
      name: spending_name,
      value: spending[key]
    };
  });
  return {
    name: "Spending",
    children: [
      ...children,
      //{ name: spendingNameOf("treasury"), value: 1000 },
      //{ name: spendingNameOf("veteran"), value: 216 },
      { name: spendingNameOf("agriculture"), value: 204 },
      { name: spendingNameOf("transportation"), value: 98 },
      { name: spendingNameOf("hud"), value: 62 },
      { name: spendingNameOf("labor"), value: 49 },
      { name: spendingNameOf("doj"), value: 42 }
    ]
  };
};

class App extends React.Component {
  constructor(props) {
    super(props);

    // Bind the this context to the handler function
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleFailure = this.handleFailure.bind(this);

    this.setPriorities = this.setPriorities.bind(this);

    this.state = {
      spending: [],
      metrics: [],
      id: 0,
      intervalIsSet: false,
      loggedIn: false,
      name: null,
      game: null,
      channel: null,
      errorMsg: null,
      gameState: null,
      player_id: null
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
      loggedIn: false,
      errorMsg: "Could Not Join Game!"
    });
  }

  setGameState(cmp, game_state) {
    //console.log("Tick:", game_state);
    cmp.setState({
      spending: map_spending_to_data(game_state.spending),
      metrics: game_state.metrics,
      gameState: game_state
    });
  }

  showMetricValue(state, metric) {
    state.metrics[metric];
  }

  showMetricDelta(state, metric) {
    state.delta_change[metric];
  }

  // Puts the user's updated policy to the server.
  putData = () => {
    var userInfo = {
      game: this.state.game
    };
    var query = "http://localhost:3001/putData";
    axios.post(query, userInfo);
  };

  setPriorities(priorities) {
    this.state.channel.push("update_priorities", { priorities });
  }

  getCurrentDate(tick) {
    return formatDate(new Date(Date.now() + tick * 1000 * 60 * 60 * 24));
  }

  render() {
    //console.log("new render", this.state);
    return (
      <div className="App">
        <header className="App-header">
          <h1>The Simulation</h1>
        </header>

        {this.state.gameState != null ? (
          <div className={this.state.loggedIn ? "game" : "pre-game"}>
            <div style={{ fontSize: "16pt" }}>
              It is the date of{" "}
              <span style={{ fontWeight: "600" }}>
                {this.getCurrentDate(
                  this.state.gameState ? this.state.gameState.time_tick : 0
                )}
              </span>{" "}
              The government's discretionary spending totals at{" "}
              <span style={{ fontWeight: "600" }}>
                {this.state.metrics.total_expenditures} B$
              </span>
            </div>
            <TreeMap
              height={500}
              width={1000}
              data={this.state.spending}
              valueUnit={"B $"}
            />
            <Priorities setPriorities={this.setPriorities}></Priorities>
            {this.state.gameState && (
              <Player
                player={this.state.gameState.players[this.state.player_id]}
              ></Player>
            )}
            {this.state.gameState == null || (
              <div style={{ textAlign: "left", alignSelf: "center" }}>
                <table width={500}>
                  <tbody>
                    <tr>
                      <td>Metric</td>
                      <td>Value</td>
                      <td>Delta</td>
                    </tr>
                    <tr>
                      <td>Global Temperature</td>
                      <td>{this.state.gameState.metrics.global_temp}</td>
                      <td>{this.state.gameState.delta_change.global_temp}</td>
                    </tr>
                    <tr>
                      <td>Safety</td>
                      <td>{this.state.gameState.metrics.safety}</td>
                      <td>{this.state.gameState.delta_change.safety}</td>
                    </tr>
                    <tr>
                      <td>Cost of Living</td>
                      <td>{this.state.gameState.metrics.cost_of_living}</td>
                      <td>
                        {this.state.gameState.delta_change.cost_of_living}
                      </td>
                    </tr>
                    <tr>
                      <td>Tax</td>
                      <td>{this.state.gameState.metrics.tax}</td>
                      <td>{this.state.gameState.delta_change.tax}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {this.state.gameState && this.state.gameState.game_over ? (
              <div style={{ fontSize: "100pt" }}>Simulation Ended!</div>
            ) : null}
            {this.state.gameState == null || (
              <div>
                <TemperatureGraph channel={this.state.channel} />
                <CostOfLivingGraph channel={this.state.channel} />
                <SafetyGraph channel={this.state.channel} />
              </div>
            )}
            {this.state.gameState && (
              <PlayerList
                players={Object.values(this.state.gameState.players)}
              ></PlayerList>
            )}
          </div>
        ) : (
          <div className="login">
            <JoinGameMenu
              success={this.handleSuccess}
              failure={this.handleFailure}
            />
            <span style={{ color: "red" }}>{this.state.errorMsg}</span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
