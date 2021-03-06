import React, { Component } from "react";
import "../../css/ToolTip.css";

class ToolTip extends Component {
  render() {
    const { hoverLoc, activePoint } = this.props;
    const svgLocation = document
      .getElementsByClassName("linechart")[0]
      .getBoundingClientRect();

    let placementStyles = {};
    let width = 100;
    placementStyles.width = width + "px";
    placementStyles.left = hoverLoc + svgLocation.left - width / 2;

    return (
      <div className="hover" style={placementStyles}>
        <div className="tick">{activePoint.x}</div>
        <div className="temp">{activePoint.y}</div>
      </div>
    );
  }
}

export default ToolTip;
