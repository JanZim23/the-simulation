import React, { Component } from 'react';

class TemperatureBar extends Component {
    state = {
        key: 0
    };

    // Calculates the length of the temperature bar 
    calcWidth() {
        var data = this.props.data.metrics.global_temp;
        if (data == 0) {
            return '5'
        }
        else {
            return ((490 * (data / 1.5)).toString());
        }
    }
    render() {
        return (
            <svg key={this.state.tick++} width={`${this.props.width}`} height="150">
                <g>
                    <rect width={`${this.props.width}`} height="150"
                        style={{ fill: 'green' }} />
                    <rect x="5" y="5" width={this.calcWidth()} height={140}
                        style={{ fill: 'red' }} />
                    <text x="5" y="15">{this.props.data.metrics.global_temp}</text>
                    <text x="5" y="80">0</text>
                    <text x="470" y="80">1.5</text>
                </g>
            </svg>
        )
    }
}

export default TemperatureBar;