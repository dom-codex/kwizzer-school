import React from "react";
import Tile from "../sub-components/tiles";
import Styles from "../../css/tile.module.css";
let prevColorIndex = -1;
const colors = ["orange", "orangered", "tomato", "torquoise"];
const genRandomColors = () => {
  const n = Math.floor(Math.random() * (colors.length - 1));
  if (n === prevColorIndex) {
    return this.getRandomColors();
  }
  prevColorIndex = n;
  return colors[n];
};
const ExamScore = (props) => {
  const { quizzes, setToast, viewResults } = props;

  return (
    <div>
      <ul className={Styles.ulGrid}>
        {quizzes.length ? (
          quizzes.map((quiz) => {
            return (
              <Tile
                key={quiz.ref}
                Styles={{}}
                color={genRandomColors()}
                li={Styles.li}
                action={{
                  showToast: setToast,
                  openResult: () =>
                    viewResults(
                      "/dashboard/mycandidates/result",
                      quiz.ref,
                      "exam"
                    ),
                  NumberOfSubmitted: quiz.NumberOfSubmitted,
                  noOfStudents: quiz.noOfStudents,
                }}
              >
                <div>{quiz.name}</div>
              </Tile>
            );
          })
        ) : (
          <h1>No quiz</h1>
        )}
      </ul>
    </div>
  );
};

export default ExamScore;
