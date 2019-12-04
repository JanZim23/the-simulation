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
            data: [],
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
        this.setState({
            data: this.state.data.append({
                x: this.props.gameState.tick,
                y: this.props.gameState.temp
            })
        });
    }
    render() {
        return (

            <div className='temperature'>
                <div className='row'>
                    <h1>Global Temperature</h1>
                </div>
                <div className='row'>
                    {!this.state.fetchingData ?
                        <InfoBox data={this.state.data} />
                        : null}
                </div>
                <div className='row'>
                    <div className='popup'>
                        {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint} /> : null}
                    </div>
                </div>
                <div className='row'>
                    <div className='chart'>
                        {!this.state.fetchingData ?
                            <LineChart data={this.state.data} onChartHover={(a, b) => this.handleChartHover(a, b)} />
                            : null}
                    </div>
                </div>
            </div>

        );
    }
}

export default TemperatureGraph;