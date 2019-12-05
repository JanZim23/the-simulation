import React from "react";

const pColor = p => {
  switch (p) {
    case "climate":
      return "green";
    case "military":
      return "red";
    case "welfare":
      return "blue";
    case "education":
      return "orange";
    case "health":
      return "purple";
    default:
      return "grey";
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
      priorities: state.priorities.splice(inx, 1);
    });
    this.props.setPriorities(this.state.priorities.splice(inx, 1));
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
          <button onClick={this.addClimate}>Climate</button>
          <button onClick={this.addEducation}>Education</button>
          <button onClick={this.addMilitary}>Military</button>
          <button onClick={this.addWelfare}>Welfare</button>
          <button onClick={this.addHealth}>Health</button>
        </div>
        <div>
          {this.state.priorities.map((p, inx) => (
            <div
              style={{
                backgroundColor: pColor(p),
                padding: "5px",
                margin: "5px"
              }}
              onClick={() => this.remove(inx)}
            >
              Priority {inx + 1}: {p}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Priorities;
