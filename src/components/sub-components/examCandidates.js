import React from "react";
import PubTile from "../sub-components/publishedQuizTile";
const ExamCandidates = (props) => {
  return (
    <div>
      {props.exams.length > 0 ? (
        props.exams.map((exam, i) => {
          return (
            <PubTile
              key={exam.ref}
              quiz={exam}
              isExam={props.isExam}
              showList={() => props.showList(true)}
              getParam={props.getParam}
              showToast={() => props.setToast(true)}
            />
          );
        })
      ) : (
        <h1>you haven't created any exam</h1>
      )}
    </div>
  );
};

export default ExamCandidates;
