import React, { Component } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { Button, Icon } from "react-materialize";
import "./Scores.css";

const Scores = ({ scoresFor }) => {
  const userData = useSelector((state) => state.user);
  console.log(userData);

  return (
    <div>
      <div>{scoresFor}</div>
      <div className="Scores-header_container">
        {/* bgColor: color of completed
                    baseBgColor: color of incompleted */}
        <Button
          floating
          icon={<Icon>add</Icon>}
          large
          node="button"
          waves="light"
        />
        <ProgressBar
          completed={180}
          maxCompleted={200}
          customLabel="Not there yet"
        />
      </div>
    </div>
  );
};

export default Scores;
