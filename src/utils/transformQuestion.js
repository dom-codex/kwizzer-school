import React from "react";
const pattern = /(<[math]+[\s? class=""_a-z]{0,}>[<?a-z0-9"\S=/>\s_?]+<\/math>)/gi;
const pattern2 = /(xmlns="[a-zA-Z0-9/:.]+")/gi;
const pattern3 = /<mo>&#160;<\/mo>/g;
const pattern4 = /<math[ ]+>/g;
const pattern5 = /bevelled="true"/g;
export const checkForEquation = (question, size = 40) => {
  question = question.replace(pattern2, "");
  question = question.replace(pattern3, "");
  question = question.replace(/&nbsp;/, "");
  question = question.replace(pattern4, `<math>`);
  question = question.replace(pattern5, "");
  const equations = question.match(pattern);
  const questions = question.split(" ");
  let fullQuestion = [];
  if (equations) {
    fullQuestion = questions.map((q) => {
      const equation = equations.find((eq) => eq === q);
      if (equation) {
        return (
          <span className="q-span">
            {" "}
            <img
              height={size != 40 ? size : 40}
              src={`https://www.wiris.net/demo/editor/render?format=svg&mml=${equation}&backgroundColor=transparent`}
            />{" "}
          </span>
        );
      } else {
        return <span className="q-span">{q}</span>;
      }
    });
  } else {
    fullQuestion = questions.map((q, i) => (
      <span className="q-span" key={i}>
        {q}
      </span>
    ));
  }
  return fullQuestion;
};
