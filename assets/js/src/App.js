import React from 'react';
import axios from 'axios';
import './App.css';
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
// import LineGraph from "./Components/LineGraph";
import JoinGameMenu from './Components/JoinGameMenu';
import EventPopUp from './Components/EventPopUp';
import LineChart from './Components/LineChart';

class App extends React.Component {
  constructor(props) {
    super(props)

    // Bind the this context to the handler function
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleFailure = this.handleFailure.bind(this);
    //Bind the event handler to the app
    this.handleEvent = this.handleEvent.bind(this);

    this.state = {
      spending: [],
      metrics: [],
      event: [],
      toggleEvent: true,
      id: 0,
      intervalIsSet: false,
      loggedIn: false,
      name: null,
      game: null
    };
  }

  // Sets an interval to retrieve data from the server every second.
  // Check for new events every second as well
  componentDidMount() {
    this.getData();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getData, 1000);
      let eventInterval = setInterval(this.checkForEvents, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // Kill component.
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // Handles a successful login
  handleSuccess(newName, gameName) {
    this.setState({
      loggedIn: true,
      name: newName,
      game: gameName
    });
  }

  // Handles a failed or no login
  handleFailure() {
    this.setState({
      loggedIn: false
    });
  }

  // Updates the state after a user determines how they want to react to an event.
  handleEvent(newSpending) {
    this.setState({ spending: newSpending });
  }

  // Gets data from the server and sets the state to that.
  getData = () => {
    fetch(`http://localhost:3001/getData?game=${this.state.game}`)
      .then((res) => res.json())
      .then(res => this.setState({
        spending: res.spending,
        metrics: res.metrics
      }));
  };

  // Checks for events activated by the server.
  checkForEvents = () => {
    fetch(`http://localhost:3001/events?game=${this.state.game}`)
      .then((res) => res.json())
      .then(res => this.setState({
        event: res.event,
        toggleEvent: res.toggleEvent
      }));
  }

  // Puts the user's updated policy to the server.
  putData = () => {
    var userInfo = {
      game: this.state.game
    };
    var query = 'http://localhost:3001/putData';
    axios.post(query, userInfo);
  };

  // Todo: conditional rendering of EventPopUp if an event is detected. Example: https://codepen.io/bastianalbers/pen/PWBYvz
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>The Simulation</h1>
        </header>
        <div className="login">
          <JoinGameMenu success={this.handleSuccess} failure={this.handleFailure} />
          {this.state.showPopup ?
            <EventPopUp
              text='Close Me'
              closePopup={this.togglePopup.bind(this)}
            />
            : null
          }
        </div>
        <div className={this.state.loggedIn ? "game" : "pre-game"}>
          <TreeMap
            height={300}
            width={300}
            data={{
              name: 'Spending', children: [{ name: 'Climate', value: 200 },
              { name: 'Welfare', value: 100 },
              { name: 'Military', value: 400 },
              { name: 'Health', value: 200 },
              { name: 'Education', value: 150 }]
            }}
            valueUnit={"B$"}
          />
          <LineChart/>
          <div style={{ padding: '10px' }}>
            <h3>Budget</h3>
            <input
              type="text"
              placeholder="Climate"
              id="climate"
              style={{ width: '200px' }}
            />
            <input
              type="text"
              placeholder="Welfare"
              id="welfare"
              style={{ width: '200px' }}
            />
            <input
              type="text"
              placeholder="Military"
              id="military"
              style={{ width: '200px' }}
            />
            <input
              type="text"
              placeholder="Health"
              id="health"
              style={{ width: '200px' }}
            />
            <input
              type="text"
              placeholder="Education"
              id="education"
              style={{ width: '200px' }}
            />
            <button onClick={() => this.postNewBudget()}>
              Propose Budget
          </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;