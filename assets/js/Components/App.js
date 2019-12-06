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

import IncomeGraph from "./income/Graph";

import socket from "../socket";
import Priorities from "./Priorities";
import Player from "./Player";
import PlayerList from "./PlayerList";

const textStyle = {
  fontSize: "16pt",
  width: 800,
  margin: "0 auto",
  textAlign: "left",
  backgroundColor: "rgba(0,0,0,0.02)",
  fontFamily: "Times New Roman, Times, serif",
  padding: "20px"
};

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

  var dayth = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  var dayOfWeek = date.getDay();

  return (
    weekDays[dayOfWeek] +
    " the " +
    day +
    dayth +
    " of " +
    monthNames[monthIndex] +
    " " +
    year
  );
};

export const spendingNameOf = key => {
  return key === "climate"
    ? "Climate Control"
    : key === "military"
    ? "National Security"
    : key === "welfare"
    ? "Social Security & Welfare"
    : key === "health"
    ? "Medicare & Health"
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
    this.startSim = this.startSim.bind(this);
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
  startSim() {
    axios.get("/sim/api/game/start/" + this.state.game);
  }

  setPriorities(priorities) {
    this.state.channel.push("update_priorities", { priorities });
  }

  getCurrentDate(tick) {
    return formatDate(new Date(Date.now() + tick * 1000 * 60 * 60 * 24));
  }

  render() {
    //console.log("new render", this.state);
    return (
      <div
        className="App"
        style={{
          backgroundColor:
            this.state.gameState && this.state.gameState.game_over
              ? "rgba(250,100,100,0.2)"
              : "white"
        }}
      >
        <header className="App-header">
          <h1>The Simulation</h1>
        </header>

        {this.state.gameState != null ? (
          <div className={this.state.loggedIn ? "game" : "pre-game"}>
            <span style={{ fontWeight: 600 }}>
              By Aleksander Piekarski, Davin Jimeno, Alexander Klementovich and
              Jan Zimmermann
            </span>{" "}
            <br />
            <br />
            <br />
            <span style={{ fontSize: 24 }}>Simulation: {this.state.game}</span>
            <br /> <br />
            <br />
            {this.state.gameState && this.state.gameState.game_over ? (
              <div style={{ fontSize: "100pt" }}>Simulation Ended!</div>
            ) : null}
            <div style={textStyle}>
              It is{" "}
              <span style={{ fontWeight: "600" }}>
                {this.getCurrentDate(
                  this.state.gameState ? this.state.gameState.time_tick : 0
                )}
              </span>{" "}
              and the government's discretionary spending totals BN $
              <span style={{ fontWeight: "600" }}>
                {(this.state.metrics.total_expenditures + "").substr(0, 6)}
              </span>
              . This simulation aims to demonstrate how complex the economy is
              while also displaying how important it is to increase spending on
              the environment. Though it is obviously simplified for the sake of
              the simulation, the five spending categories in consideration are
              climate, welfare, security, health, and education.
              <br />
            </div>
            <TreeMap
              height={500}
              width={1000}
              data={this.state.spending}
              valueUnit={"B $"}
            />
            <div style={textStyle}>
              <h3>Priorities</h3>
              It is important to not underfund any of these categories because
              other issues will arise. Everyone will have a say in determining
              how to allocate the budget because climate change is not an issue
              that just one person can tackle. As the simulation progresses, the
              rate at which the global temperature increases or decreases will
              change depending on how much of the budget is spent on climate.
              However, if the global temperature increases by 1.5°C, then the
              simulation will end. <br />
              <br />
              Use the buttons below to indicate your personal priorities for
              spending. These will be averaged along with all other
              participants. As you chose priorities, other areas of spending
              will automatically decrease. You can only have a maximum of 7
              priorities.
              <br /> <br />
              <span style={{ fontWeight: "700" }}> Note that if:</span>
              <br />- You have more that 5 priorities, the total government
              budget will increase.
              <br />- You have no priorities, the government will start spending
              less money in total.
              <br />
              <br />
              You can always remove priorities by clicking on them.
            </div>
            <Priorities
              enabled={
                this.state.gameState &&
                this.state.gameState.players[this.state.player_id] &&
                !this.state.gameState.players[this.state.player_id]["bankrupt?"]
              }
              setPriorities={this.setPriorities}
            ></Priorities>
            <div style={textStyle}>
              Though the environmental impacts of the global temperature rise
              should not be overlooked, one way to avoid the monetary losses is
              by being proactive with government spending. Currently, the United
              States Government spends 16.8% of its budget ($6.9 trillion) on
              Medicare, 15.8% on Social Security, 15.3% on national defense, and
              only 0.7% on natural resources and environment (USAspending,
              n.d.).
              <br />
              <br />
              The Paris Climate Agreement seeks to make “finance flows
              consistent with a pathway towards low greenhouse gas emissions and
              climate-resilient development (The Paris Agreement, n.d.).” By
              reallocating funds to ensure that spending to support the
              environment is prioritized, we can avoid reaching the 1.5°C limit.
              <br />
              <h3>Budget</h3>
              This leads to wonder why so much attention is attracted by global
              warming but so little action by governments and corperation. How
              can we as individualy hold them more accountable? The table below
              shows a table representing a random household income assigned to
              you individually, with the calculated expenses. The higher the
              budget of the goverment is raised the higher the taxes will
              become. The more you invest in Welfare, Education and Health,
              everyones cost of living will decrease.
            </div>
            <br />
            <br />
            <br />
            {this.state.gameState &&
              this.state.gameState.players[this.state.player_id] && (
                <Player
                  player={this.state.gameState.players[this.state.player_id]}
                ></Player>
              )}
            <br />
            <br />
            <br />
            <div style={textStyle}>
              Once your imaginary house hold can no longer sustain itself the
              priorities you set no longer impact the government spending. Once
              more than half the participants can no longer contribute, the
              simulation ends. <br />
              <br />
              <h3>Tax</h3>
              This becomes more difficult as the total government spending
              increases because taxes will rise accordingly.
            </div>
            {this.state.gameState == null || (
              <div>
                <span style={{ fontSize: 32 }}>
                  <pre>
                    Tax: {(this.state.gameState.metrics.tax + "").substr(0, 4)}{" "}
                    %
                  </pre>
                </span>
                <div style={textStyle}>
                  For many people, the impact of a 1.5°C change in global
                  temperature is difficult to understand or visualize. After
                  all, local temperature usually fluctuates more than this.{" "}
                  <br />
                  <br />
                  However, a drop of 1°C or 2°C is all it took to send the earth
                  into the Little Ice Age (World of Change, n.d.). On the flip
                  side, an increase of 1.5°C is estimated to cause the sea
                  levels to rise by 48cm by 2100, and this is expected to cost
                  the world $10.2 trillion in losses due to flood damage
                  (McSweeney and Pearce, n.d.).
                </div>
                <TemperatureGraph channel={this.state.channel} />
                <div style={textStyle}>
                  As the government (stops) focusing on education, welfare and
                  health the average cost of living will increase significantly
                  putting an extraordinary burden on the population.
                </div>
                <CostOfLivingGraph channel={this.state.channel} />
                <div style={textStyle}>
                  Safety, Education and Wellfare contribute greatly to the
                  wellbeing of the population. The looming doom of climate
                  change will ultimatly also impact the happyness of citizens.
                  Once the happyness and safety of the population falls below
                  50% the simulation ends. If this metric starts to rapidly drop
                  consider investing in Security, since departments such as
                  Veteran Affairs belong to it too.
                </div>
                <SafetyGraph channel={this.state.channel} />
                <div style={textStyle}>
                  At the start of the simulation everyone is assigned a random
                  income, the graph below shows the distribution of this income.
                </div>
                <IncomeGraph
                  okey="income"
                  players={Object.values(this.state.gameState.players)}
                />
                <div style={textStyle}>
                  The below graph shows the distribution of budgets amoungst the
                  simulated population. Once half of all budgets fall below 0,
                  the simulation ends.
                </div>
                <IncomeGraph
                  okey="budget"
                  players={Object.values(this.state.gameState.players)}
                />
              </div>
            )}
            <div style={textStyle}>
              To keep all participants accountable for their choices, below are
              the chosen priorities of all players.
            </div>
            {this.state.gameState && (
              <PlayerList
                players={Object.values(this.state.gameState.players)}
              ></PlayerList>
            )}
            <div style={textStyle}>
              <p class="c1">
                <span class="c5">Works Cited</span>
              </p>
              <p class="c1 c9">
                <span class="c5"></span>
              </p>
              <p class="c3">
                <span class="c0">
                  McSweeney, Robert, and Rosamund Pearce. &ldquo;The Impacts of
                  Climate Change at 1.5C, 2C and{" "}
                </span>
              </p>
              <p class="c3">
                <span class="c0">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beyond.&rdquo;
                  Interactive. Accessed December 6, 2019.
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </p>
              <p class="c3 c6">
                <span class="c7">
                  https://interactive.carbonbrief.org/impacts-climate-change-one-point-five-degrees-two
                </span>
              </p>
              <p class="c3">
                <span class="c0">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-degrees/?utm_source=web&amp;utm_campaign=Redirect.
                </span>
              </p>
              <p class="c2">
                <span class="c0"></span>
              </p>
              <p class="c3">
                <span class="c0">
                  Rinberg, Toly, Maya Anjur-Dietrich, Marcy Beck, Andrew
                  Bergman, Justin Derry, Lindsey{" "}
                </span>
              </p>
              <p class="c3">
                <span class="c0">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dillon,
                  Gretchen Gehrke, et al. &ldquo;Changing the Digital
                  Climate.&rdquo; The First 100 Days And{" "}
                </span>
              </p>
              <p class="c3">
                <span class="c0">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Counting:
                  Changing the Digital Climate | EDGI. Accessed December 6,
                  2019.
                </span>
              </p>
              <p class="c3">
                <span class="c7">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span class="c7">
                  https://100days.envirodatagov.org/changing-digital-climate/#kix.foou44beqfm
                </span>
                <span class="c0">.</span>
              </p>
              <p class="c2">
                <span class="c0"></span>
              </p>
              <p class="c3">
                <span class="c0">
                  &ldquo;The Paris Agreement.&rdquo; UNFCCC. Accessed December
                  6, 2019.{" "}
                </span>
              </p>
              <p class="c3">
                <span class="c0">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://unfccc.int/process-and-meetings/the-paris-agreement/the-paris-agreement.
                </span>
              </p>
              <p class="c2">
                <span class="c0"></span>
              </p>
              <p class="c3">
                <span class="c0">
                  &ldquo;USAspending.gov.&rdquo; USAspending.gov. Accessed
                  December 6, 2019.{" "}
                </span>
              </p>
              <p class="c3">
                <span class="c0">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://www.usaspending.gov/#/explorer/budget_function.
                </span>
              </p>
              <p class="c2">
                <span class="c0"></span>
              </p>
              <p class="c3">
                <span class="c0">
                  &ldquo;World of Change: Global Temperatures.&rdquo; NASA.
                  NASA. Accessed December 6, 2019.{" "}
                </span>
              </p>
              <p class="c3">
                <span class="c0">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://earthobservatory.nasa.gov/world-of-change/DecadalTemp.
                </span>
              </p>
              <p class="c2 c6">
                <span class="c8"></span>
              </p>
              <p class="c2 c6">
                <span class="c8"></span>
              </p>
              <p class="c2">
                <span class="c0"></span>
              </p>
              <p class="c2">
                <span class="c0"></span>
              </p>
            </div>
            <div style={textStyle}>
              Once you are ready, you can start the simulation by clicking{" "}
              <a
                onClick={this.startSim}
                style={{ cursor: "pointer", color: "blue" }}
              >
                here
              </a>
              .
            </div>
          </div>
        ) : (
          <div className="login">
            <div style={textStyle}>
              People across the world are dealing with the effects of climate
              change. It’s been three years since the Paris Climate Agreement
              was signed and two years since the United States withdrew from the
              agreement. Plenty of debate has arisen over the effectiveness of
              the Agreement and even over the validity of climate change, but
              with no real change in sight, activists around the world are
              taking matters into their own hands. <br />
              <br />
              Greta Thunberg, a 16-year-old environmental activist from Sweden,
              has made international news after sailing across the Atlantic
              Ocean and speaking at the United Nations Climate Action Summit.
              EDGI, a watchdog group, has noted that the White House website
              under President Trump has removed all references to climate
              change, showing that climate change is not even the slightest bit
              of a priority for the current administration (EDGI). <br />
              <br />
              Inspired by the work done so far, a group of four Northeastern
              University computer science students have come together to develop
              a simulation that demonstrates how government spending ties into
              climate change and how important it is to abide by the Paris
              Climate Agreement’s plan to limit the global temperature from
              increasing more than 1.5°C above pre-industrial levels.
              <br /> <br /> <br /> <br />
              <span style={{ fontWeight: 600 }}>
                By Aleksander Piekarski, Davin Jimeno, Alexander Klementovich
                and Jan Zimmermann
              </span>
            </div>
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
