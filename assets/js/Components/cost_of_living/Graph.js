import React, { Component } from "react";
import "../../App.css";
import LineChart from "./LineChart";
import ToolTip from "./ToolTip";
import InfoBox from "./InfoBox";

class TemperatureGraph extends Component {
  constructor(props) {
    super(props);
    this.onTick = this.onTick.bind(this);
    this.state = {
      fetchingData: true,
      data: [{ x: 0, y: 700 }],
      hoverLoc: null,
      activePoint: null,
      channel: props.channel
    };
  }
  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    });
  }
  componentDidMount() {
    this.state.channel.on("tick", this.onTick);
  }

  onTick(game_state) {
    var newData = this.state.data;

    newData.push({
      x: newData.length,
      y: game_state.metrics.cost_of_living
    });
    this.setState({
      data: newData,
      current_temp: game_state.metrics.cost_of_living
    });
    console.log("New Temp", this.data);
  }
  render() {
    return (
      <div className="temperature">
        <div className="row">
          <h1>Average Cost of Living</h1>
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

export default TemperatureGraph;
