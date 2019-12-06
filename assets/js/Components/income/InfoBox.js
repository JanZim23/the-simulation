import React, { Component } from "react";
import "../../css/InfoBox.css";

class InfoBox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var data = this.props.data;
    return (
      <div id="data-container">
        <div id="left" className="box">
          <div className="heading">{data[0].y} $/Month</div>
          <div className="subtext">Minimum</div>
        </div>
        <div id="right" className="box">
          <div className="heading">{data[data.length - 1].y} $/Month</div>
          <div className="subtext">Maximum</div>
        </div>
      </div>
    );
  }
}

export default InfoBox;
