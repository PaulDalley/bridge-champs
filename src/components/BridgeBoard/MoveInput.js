import React from "react";
import { Row, TextInput, Select, Range } from "react-materialize"; // Input component deprecated

const MoveInput = ({ i, moveChanges, editing, move, suit, score }) => {
  // console.log(move, score, suit, i);
  if (move === undefined) move = "";
  if (score === undefined) score = 0;
  if (suit === undefined) suit = "None";
  return (
    <Row>
      <TextInput s={1} defaultValue={i + 1} disabled />
      <Select
        s={2}
        //    type='select'
        label="Move"
        defaultValue={move}
        onChange={(e) => moveChanges(e, i, "move")}
      >
        <option value=""></option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
        <option value="J">J</option>
        <option value="Q">Q</option>
        <option value="K">K</option>
        <option value="A">A</option>
        <option value="Pass">Pass</option>
        <option value="X">X</option>
        <option value="XX">XX</option>
      </Select>
      <Select
        s={2}
        //    type='select'
        label="Suit"
        defaultValue={suit}
        onChange={(e) => moveChanges(e, i, "suit")}
      >
        <option value="None">None</option>
        <option value="♣">♣</option>
        <option value="♦">♦</option>
        <option value="♥">♥</option>
        <option value="♠">♠</option>
        <option value="NT">NT</option>
      </Select>
      {/*<p class="range-field">*/}
      {/* <Range
        label="Score out of 10"
        s={3}
        // type="range"
        min="0"
        max="10"
        step="1"
        id="test5"
        defaultValue={score}
        onChange={(e) => moveChanges(e, i, "score")}
      /> */}

      <Select
        s={2}
        //    type='select'
        label="Score"
        defaultValue={score}
        onChange={(e) => moveChanges(e, i, "score")}
      >
        <option value=""></option>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </Select>
      {/*</p>*/}
    </Row>
  );
};
export default MoveInput;
