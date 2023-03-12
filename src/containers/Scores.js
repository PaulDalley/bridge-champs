import React, { Component, useState } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { Button, Icon, Collapsible, CollapsibleItem } from "react-materialize";
import "./Scores.css";

const Scores = ({ scoresFor }) => {
  const quizScores = useSelector((state) => state.user?.quizScores);
  const totalQuizScore = useSelector((state) => state.user?.totalQuizScore);
  const quizScoresFetched = useSelector(
    (state) => state.user?.quizScoresFetched
  );
  console.log(userData);

  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [_totalQuizScore, _setTotalQuizScore] = useState(0);
  const [overallPercent, setOverallPercent] = useState(0);
  const [categoriesPercents, setCategoriesPercents] = useState({});

  const setupQuizData = () => {
    const numQuizzesCompleted = quizScores?.length;
    const totalScore = quizScores.reduce((acc, next) => {
      console.log(next);
      return acc;
    }, 0);
  };

  useEffect(() => {
    if (!quizScoresFetched) {
      // do something to fetch quiz scores...
    } else {
      setupQuizData();
    }
  }, []);

  return (
    <div>
      <div>{scoresFor}</div>
      <div className="Scores-header_container">
        {/* bgColor: color of completed
                    baseBgColor: color of incompleted */}
        <Collapsible accordion popout>
          <CollapsibleItem
            expanded={false}
            header={
              <div>
                <ProgressBar
                  completed={180}
                  maxCompleted={200}
                  customLabel={`Overall Quiz Scores: ${180 / 200}`}
                />
              </div>
            }
            icon={<Icon>filter_drama</Icon>}
            node="div"
          >
            Better safe than sorry. That's my motto.
          </CollapsibleItem>
          <CollapsibleItem
            expanded={false}
            header="Yeah, you do seem to have a little 'shit creek' action going."
            icon={<Icon>place</Icon>}
            node="div"
          >
            Yeah, you do seem to have a little 'shit creek' action going.
          </CollapsibleItem>
          <CollapsibleItem
            expanded={false}
            header="You know, FYI, you can buy a paddle. Did you not plan for this contingency?"
            icon={<Icon>whatshot</Icon>}
            node="div"
          >
            You know, FYI, you can buy a paddle. Did you not plan for this
            contingency?
          </CollapsibleItem>
        </Collapsible>
      </div>
    </div>
  );
};

export default Scores;
