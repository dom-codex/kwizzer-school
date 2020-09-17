import React, { useEffect } from "react";
const hideMore = () => {
  const more = document.querySelectorAll(".show-more");
  for (let i = 0; i < more.length; i++) {
    more[i].classList.remove("showmore");
  }
};
const showMore = (e) => {
  hideMore();
  e.target.parentNode.children[1].classList.add("showmore");
};
const hide = (e) => {
  if (!e.target.matches(".material-icons")) {
    hideMore();
  }
};
const QuizTile = (props) => {
  const quiz = props.quiz;
  const LinkTo = () => {
    props.history.push(
      `/dashboard/quizzes/list?sid=${props.school}&quid=${quiz.ref}`
    );
  };
  useEffect(() => {
    window.addEventListener("click", (e) => hide(e));
  }, []);
  return (
    <tr>
      <td className="sn">{props.sn}</td>
      <td className="quiz-name">{quiz.title || quiz.name}</td>
      <td className="tq">{quiz.totalQuestions ? quiz.totalQuestions : 0}</td>
      <td>{quiz.published ? "true" : "false"}</td>
      <td className="more">
        <i className="material-icons" onClick={showMore}>
          more_horiz
        </i>
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
