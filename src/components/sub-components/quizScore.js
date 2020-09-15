import React from "react";
import QuizTile from "../sub-components/quiz-tile";

const QuizScore = (props) => {
  const { quizzes, setToast, viewResults } = props;

  return (
    <div>
      {" "}
      {quizzes.length ? (
        quizzes.map((quiz) => {
          return (
            <QuizTile
              key={quiz.id}
              quiz={quiz}
              showOverview={props.showOverView}
              score={true}
              openResult={() =>
                viewResults("/dashboard/mycandidates/result", quiz.id)
              }
              showToast={() => setToast(true)}
            />
          );
        })
      ) : (
        <h1>No quiz</h1>
      )}
    </div>
  );
};

export default QuizScore;
