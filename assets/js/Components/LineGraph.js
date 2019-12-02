import React from "react";
import * as d3 from "d3";

// Line Chart to graph the global temperature
class LineGraph extends React.Component {
  state = {
    temp: {},
    intervalIsSet: null,
    tick: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.temp
    };
  }

  // Sets an interval to retrieve data from the server every second.
  componentDidMount() {
    this.getTemp();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getTemp, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getTemp = () => {
    fetch("/getTemp")
      .then(res => res.json())
      .then(res =>
        this.setState({
          temp: temp.push({ t: this.state.tick++, d: res.temp }),
          tick: tick++
        })
      );
  };

  render() {
    const width = 500;
    const height = 500;
    const margin = 20;
    const h = height - 2 * margin,
      w = width - 2 * margin;

    //number formatter
    const xFormat = d3.format(".2");

    //x scale
    const x = d3
      .scaleLinear()
      .domain(d3.extent(this.state.temp, data => data.t)) //domain: [min,max] of a
      .range([margin, w]);

    //y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.state.temp, data => data.d)]) // domain [0,max] of b (start from 0)
      .range([h, margin]);

    //line generator: each point is [x(d.a), y(d.b)] where d is a row in data
    // and x, y are scales (e.g. x(10) returns pixel value of 10 scaled by x)
    const line = d3
      .line()
      .x(data => x(data.t))
      .y(data => y(data.d))
      .curve(d3.curveCatmullRom.alpha(0.5)); //curve line

    const xTicks = x.ticks(6).map(d =>
      x(d) > margin && x(d) < w ? (
        <g transform={`translate(${x(d)},${h + margin})`}>
          <text>{xFormat(d)}</text>
          <line x1="0" x1="0" y1="0" y2="5" transform="translate(0,-20)" />
        </g>
      ) : null
    );

    const yTicks = y.ticks(5).map(d =>
      y(d) > 10 && y(d) < h ? (
        <g transform={`translate(${margin},${y(d)})`}>
          <text x="-12" y="5">
            {xFormat(d)}
          </text>
          <line x1="0" x1="5" y1="0" y2="0" transform="translate(-5,0)" />
          <line
            className="gridline"
            x1="0"
            x1={w - margin}
            y1="0"
            y2="0"
            transform="translate(-5,0)"
          />
        </g>
      ) : null
    );

    return (
      <svg width={width} height={height}>
        <line className="axis" x1={margin} x2={w} y1={h} y2={h} />
        <line className="axis" x1={margin} x2={margin} y1={margin} y2={h} />
        <path d={line(data)} />
        <g className="axis-labels">{xTicks}</g>
        <g className="axis-labels">{yTicks}</g>
      </svg>
    );
  }
}

export default LineGraph;
