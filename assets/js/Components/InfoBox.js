import React, { Component } from 'react';
import '../css/InfoBox.css';

class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTemp: null,
      monthChangeD: null,
      monthChangeP: null,
      updatedAt: null
    }
  }
  componentDidMount(){
    var data = this.props.data;
    console.log(data);
    const temp = data[data.length - 1].y;
    const change = temp - data[0].y;
    const changeP = (temp - data[0].y) / 0.000001 * 100;  
    this.setState({
        currentTemp: temp,
        monthChangeD: change.toString(),
        monthChangeP: changeP.toFixed(2) + '%'
      })
  }
  componentWillUnmount(){
    clearInterval(this.refresh);
  }
  render(){
    return (
      <div id="data-container">
          <div id="left" className='box'>
            <div className="heading">{this.state.currentTemp}</div>
          </div>
          <div id="middle" className='box'>
            <div className="heading">{this.state.monthChangeD}</div>
            <div className="subtext">Total Change (C)</div>
          </div>
          <div id="right" className='box'>
            <div className="heading">{this.state.monthChangeP}</div>
            <div className="subtext">Total Change (%)</div>
          </div>

      </div>
    );
  }
}

export default InfoBox;
