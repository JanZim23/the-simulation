import React from "react";

import { pColor } from "./Priorities";
import { spendingNameOf } from "./App";

const shuffle = array => {
  array.sort(() => Math.random() - 0.5);
};

const playerMatrix = players => {
  var length = players.length;
  var width = Math.ceil(Math.sqrt(length));
  var matrix = [];
  for (var i = 0; i < length; i = i + width) {
    var row = players.splice(0, width);
    matrix = [...matrix, row];
  }
  return matrix;
};

const renderPlayer = player => {
  return (
    <div>
      <div>{player.name || "Anonymous"}</div>
      {player.priorities.map(p => (
        <div
          style={{
            backgroundColor: pColor(p),
            padding: "5px",
            margin: "5px",
            fontSize: "12pt"
          }}
        >
          {spendingNameOf(p)}
        </div>
      ))}
    </div>
  );
};

class PlayerList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <table style={{ width: "100%" }}>
          <tbody>
            {playerMatrix(this.props.players).map(row => {
              return (
                <tr>
                  {row.map(player => (
                    <td>{renderPlayer(player)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PlayerList;
