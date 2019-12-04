import React, { Component } from 'react';
import moment from 'moment';
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
    this.getData = () => {
      const {data} = this.props;
          const temp = data[data.length - 1];
          const change = temp - data[0];
          const changeP = (temp - data[0]) / data[0] * 100;

          this.setState({
            currentTemp: temp,
            monthChangeD: change,
            monthChangeP: changeP.toFixed(2) + '%'
          })
        .catch((e) => {
          console.log(e);
        });
    }
    this.getData();
    this.refresh = setInterval(() => this.getData(), 90000);
  }
  componentWillUnmount(){
    clearInterval(this.refresh);
  }
  render(){
    return (
      <div id="data-container">
        { this.state.currentTemp ?
          <div id="left" className='box'>
            <div className="heading">{this.state.currentTemp}</div>
          </div>
        : null}
        { this.state.currentTemp ?
          <div id="middle" className='box'>
            <div className="heading">{this.state.monthChangeD}</div>
            <div className="subtext">Total Change (C)</div>
          </div>
        : null}
          <div id="right" className='box'>
            <div className="heading">{this.state.monthChangeP}</div>
            <div className="subtext">Total Change (%)</div>
          </div>

      </div>
    );
  }
}

export default InfoBox;
