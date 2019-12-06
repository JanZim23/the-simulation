import React, { Component } from "react";
import "../../App.css";
import LineChart from "./LineChart";
import ToolTip from "./ToolTip";
import InfoBox from "./InfoBox";

const map_income = (key, players) => {
  var incomes = players.map(pl => pl[key]);
  incomes.sort(function(a, b) {
    return a - b;
  });

  if (incomes.length === 0) {
    return [{ x: 0, y: 0 }];
  }
  return incomes.map((income, inx) => ({ x: inx, y: income }));
};

class Graph extends Component {
  constructor(props) {
    super(props);
    var data = map_income(props.okey, props.players);
    console.log("data for", props.okey, data);
    this.state = {
      fetchingData: true,
      data: data,
      hoverLoc: null,
      activePoint: null
    };
  }
  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    });
  }
  render() {
    return (
      <div className="temperature">
        <div className="row">
          <h1>Average {this.props.okey}</h1>
        </div>
        <div className="row">
          <InfoBox data={this.state.data} />
        </div>
        <div className="row">
          <div className="popup">
            {this.state.hoverLoc ? (
              <ToolTip
                hoverLoc={this.state.hoverLoc}
                activePoint={this.state.activePoint}
              />
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="chart">
            <LineChart
              data={this.state.data}
              onChartHover={(a, b) => this.handleChartHover(a, b)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Graph;
