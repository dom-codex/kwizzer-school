import React from "react";
const pattern = /(<[math]+[\s? class=""_a-z]{0,}>[<?a-z0-9"\S=/>\s_?]+<\/math>)/gi;
const pattern2 = /(xmlns="[a-zA-Z0-9/:.]+")/gi;
const pattern3 = /<mo>&#160;<\/mo>/g;
const pattern4 = /<math[ ]+>/;
const checkForEquation = (question) => {
  question = question.replace(pattern2, "");
  question = question.replace(pattern3, "");
  question = question.replace(/&nbsp;/, "");
  question = question.replace(pattern4, `<math>`);
  const equations = question.match(pattern);
  const questions = question.split(" ");
  let fullQuestion = [];
  if (equations && equations.length) {
    fullQuestion = questions.map((q) => {
      const equation = equations.find((eq) => eq === q);
      if (equation) {
        return (
          <span className="q-span">
            {" "}
            <img
              height="56px"
              src={`https://www.wiris.net/demo/editor/render?format=svg&mml=${equation}&backgroundColor=white`}
            />{" "}
          </span>
        );
      } else {
        return <span className="q-span">{q}</span>;
      }
    });
  } else {
    fullQuestion = questions.map((q) => <span className="q-span">{q}</span>);
  }
  return fullQuestion;
};
const Questiondisplay = (props) => {
  return (
    <div className="question-area">
      <h4>Question {props.index}</h4>
      <p> {checkForEquation(props.question)}</p>
    </div>
  );
};

export default Questiondisplay;
