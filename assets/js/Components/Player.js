import React from "react";

/*
    :name,
    :income,
    budget: 0,
    bankrupt?: false,
    expenses: %{},
    priorities: [],
    approves: true,
    polution: 1.0
*/

class Player extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const player = this.props.player;
    console.log(player);
    return (
      <div>
        <div style={{ fontSize: "16pt" }}>{player.name || "Anonymous"}</div>
        <div className={"player-table"}>
          <table rules={"all"}>
            <tbody>
              <tr>
                <td colSpan={2}>Income/Month</td>
                <td className={"num"}>+ {player.income} $</td>
              </tr>
              <tr>
                <td rowSpan={Object.keys(player.expenses).length + 1}>
                  Expenses
                </td>
              </tr>
              {Object.keys(player.expenses).map(exp => {
                return (
                  <tr>
                    <td>{exp}</td>
                    <td className={"num"}> - {player.expenses[exp]} $</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={2}>Remaining Budget</td>
                <td className={"num"}>{player.budget} $</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>{player["bankrupt?"] ? "Bankrupt!" : null}</div>
      </div>
    );
  }
}

export default Player;
