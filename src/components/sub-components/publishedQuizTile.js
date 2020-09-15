import React from "react";
import QuizCandidate from "./quizCandidate";
const PubTile = (props) => {
  const { quiz } = props;
  console.log(quiz);
  return (
    <div className="pub-card">
      <div className="pub-card-body">
        <h3>{quiz.name}</h3>
        <div className="pub-card-item">
          <small>Time: </small>
          <span>
            {" "}
            {quiz.hours > 0 ? ` ${quiz.hours}hr(s) ` : ""}{" "}
            {quiz.minutes > 0 ? ` ${quiz.minutes}min ` : ""}
            {quiz.seconds} seconds
          </span>
        </div>
        <div className="pub-card-item">
          <small>{"No of Quiz"}: </small>
          <span> {quiz.nQuiz}</span>
        </div>
        <div className="pub-card-item">
          <small>No of registered candidates: </small>
          <span> {quiz.noOfStudents}</span>
        </div>
      </div>
      <div className="pub-card-item-btn">
        <span>
          <button
            onClick={() => {
              props.getParam({
                quiz: quiz.ref,
                title: QuizCandidate.name,
              });
              quiz.noOfStudents > 0 ? props.showList() : props.showToast();
            }}
          >
            candidates list
          </button>
        </span>
      </div>
    </div>
  );
};
export default PubTile;
