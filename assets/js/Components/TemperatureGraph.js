import React, { Component } from 'react';
import '../App.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import InfoBox from './InfoBox';

class TemperatureGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchingData: true,
            data: [{x: 0, y: 0}],
            hoverLoc: null,
            activePoint: null
        }
    }
    handleChartHover(hoverLoc, activePoint) {
        this.setState({
            hoverLoc: hoverLoc,
            activePoint: activePoint
        })
    }
    componentDidMount() {
        console.log(this.props);
        var newData = this.state.data;
        newData.push({
            x: this.props.data.tick,
            y: this.props.data.global_temp
        });
        this.setState({
            data: newData
        });
        console.log(this.data);
    }
    render() {
        return (
            <div className='temperature'>
                <div className='row'>
                    <h1>Global Temperature</h1>
                </div>
                <div className='row'>
                    <InfoBox data={this.state.data} />
                </div>
                <div className='row'>
                    <div className='popup'>
                        {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint} /> : null}
                    </div>
                </div>
                <div className='row'>
                    <div className='chart'>
                        <LineChart data={this.state.data} onChartHover={(a, b) => this.handleChartHover(a, b)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default TemperatureGraph;