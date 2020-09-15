import React from "react";
const QuizTile = (props) => {
  const quiz = props.quiz;
  const LinkTo = () => {
    props.history.push(
      `/dashboard/quizzes/list?sid=${props.school}&quid=${quiz.ref}`
    );
  };
  return (
    <tr>
      <td className="sn">{props.sn}</td>
      <td className="quiz-name">{quiz.title || quiz.name}</td>
      <td className="tq">{quiz.totalQuestions ? quiz.totalQuestions : 0}</td>
      <td>{quiz.published ? "true" : "false"}</td>
      <td className="showmore">
        ...
        <div className="show-more">
          {" "}
          <button onClick={LinkTo}>edit</button>
          <button onClick={props.publish}>publish</button>
          <button onClick={props.delete}>delete</button>
        </div>
      </td>
    </tr>
  );
};
export default QuizTile;
