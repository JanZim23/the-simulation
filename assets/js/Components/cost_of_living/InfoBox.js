import React, { Component } from "react";
import "../../css/InfoBox.css";

class InfoBox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var data = this.props.data;
    const temp = data[data.length - 1].y;
    const ptemp = data.length == 1 ? data[0].y : data[data.length - 2].y;
    const change = temp - data[0].y;
    const changeP = ((temp - ptemp) / temp) * 100;
    return (
      <div id="data-container">
        <div id="left" className="box">
          <div className="heading">{(temp + "").substring(0, 5)} $/Month</div>
          <div className="subtext">Average Cost of Living</div>
        </div>
        <div id="right" className="box">
          <div className="heading">{changeP.toFixed(2) + "%"}</div>
          <div className="subtext">Change (%)</div>
        </div>
      </div>
    );
  }
}

export default InfoBox;
