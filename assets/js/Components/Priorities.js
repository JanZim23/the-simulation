import React from "react";

import { spendingNameOf } from "./App";

export const pColor = p => {
  switch (p) {
    case "climate":
      return "rgba(97, 250, 92, 1)";
    case "military":
      return "rgba(250, 97, 92, 1)";
    case "welfare":
      return "rgba(92, 247, 250, 1)";
    case "education":
      return "rgba(250, 166, 92, 1)";
    case "health":
      return "rgba(234, 92, 250, 1)";
    default:
      return "rgba(171, 171, 171, 1)";
  }
};

class Priorities extends React.Component {
  constructor(props) {
    super(props);

    this.remove = this.remove.bind(this);
    this.addClimate = this.addClimate.bind(this);
    this.addMilitary = this.addMilitary.bind(this);
    this.addEducation = this.addEducation.bind(this);
    this.addWelfare = this.addWelfare.bind(this);
    this.addHealth = this.addHealth.bind(this);
    this.add = this.add.bind(this);

    this.state = {
      priorities: []
    };
  }

  remove(inx) {
    this.setState(state => {
      var newP = [...state.priorities];
      newP.splice(inx, 1);
      return { priorities: newP };
    });
    var newP = [...this.state.priorities];
    newP.splice(inx, 1);
    priorities: newP;
    this.props.setPriorities(newP);
  }

  addClimate() {
    this.add("climate");
  }

  addMilitary() {
    this.add("military");
  }
  addEducation() {
    this.add("education");
  }
  addWelfare() {
    this.add("welfare");
  }
  addHealth() {
    this.add("health");
  }

  add(priority) {
    console.log("new P", priority);
    if (this.state.priorities.length != 7) {
      this.setState(state => ({
        priorities: [...state.priorities, priority]
      }));
      this.props.setPriorities([...this.state.priorities, priority]);
    }
  }

  render() {
    return (
      <div>
        <div>
          <button
            style={{
              backgroundColor: pColor("climate"),
              padding: "4px",
              margin: "4px",
              fontSize: "16pt"
            }}
            onClick={this.addClimate}
          >
            + Climate
          </button>
          <button
            style={{
              backgroundColor: pColor("education"),
              padding: "4px",
              margin: "4px",
              fontSize: "16pt"
            }}
            onClick={this.addEducation}
          >
            + Education
          </button>
          <button
            style={{
              backgroundColor: pColor("military"),
              padding: "4px",
              margin: "4px",
              fontSize: "16pt"
            }}
            onClick={this.addMilitary}
          >
            + Military
          </button>
          <button
            style={{
              backgroundColor: pColor("welfare"),
              padding: "4px",
              margin: "4px",
              fontSize: "16pt"
            }}
            onClick={this.addWelfare}
          >
            + Welfare
          </button>
          <button
            style={{
              backgroundColor: pColor("health"),
              padding: "4px",
              margin: "4px",
              fontSize: "16pt"
            }}
            onClick={this.addHealth}
          >
            + Health
          </button>
        </div>
        <div>
          {this.state.priorities.map((p, inx) => (
            <div
              style={{
                backgroundColor: pColor(p),
                padding: "5px",
                margin: "5px",
                fontSize: "12pt"
              }}
              onClick={() => this.remove(inx)}
            >
              Priority {inx + 1}: {spendingNameOf(p)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Priorities;
