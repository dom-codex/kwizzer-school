import React, { useState, useEffect, useContext } from "react";
import { modeContext } from "../../context/mode";
import "../../css/candidate_result.css";
import { fetchData } from "../../utils/storage";
const school = fetchData("school");
const CandidatesResults = (props) => {
  const { switchMode, setHeading } = useContext(modeContext);
  const [result, setResult] = useState([]);
  const { quizId, mode } = props.location.state;
  const isExam = mode === "exam";
  const fetchResult = () => {
    //let url = `http://localhost:3500/school/get/students/result?quiz=${quizId}`;

    let url = `${process.env.REACT_APP_HEAD}/school/exam/results?exam=${quizId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResult(data.result);
      });
  };
  const linkTo = (paper) => {
    props.history.push(`/quiz/solutions`, { question: paper, isExam: isExam });
  };
  const ApproveResults = () => {
    //let url = `http://localhost:3500/school/approve/results?quiz=${quizId}`;
    let url = `${process.env.REACT_APP_HEAD}/school/exam/approve/result?exam=${quizId}&sch=${school}`;

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      });
  };
  const ApproveSingleResult = (id) => {
    // let url = `http://localhost:3500/school/approve/result?paper=${id}`;
    let url = `${process.env.REACT_APP_HEAD}/school/exam/approve/single?paper=${id}`;

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      });
  };
  useEffect(() => {
    setHeading("Results");
    switchMode(false);
    fetchResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="candidates-result">
      <div className="candidates-results-details">
        <div></div>
        <div>
          <small>total submitted: {result.length ? result.length : 0}</small>
          <br />
          {result.length ? (
            <button onClick={ApproveResults}>Approve all results</button>
          ) : (
            <button disabled={true}>approve results</button>
          )}
        </div>
      </div>
      <hr />
      <div className="result-content">
        <ul>
          {result.length ? (
            result.map((r, i) => {
              const correct = r.totalAnswered - r.fails;
              return (
                <li
                  key={i}
                  onClick={
                    r.isComplete
                      ? (e) => {
                          if (e.target.className === "approve-btn") return;
                          linkTo(r._id);
                        }
                      : null
                  }
                >
                  <div className="res-details">
                    <small>correct :{correct <= 0 ? 0 : correct}</small>
                    <small>fails: {r.fails}</small>
                    <small>total: {r.totalMarks}</small>
                    <small>
                      %:{" "}
                      {Math.round(
                        (r.score.$numberDecimal / r.totalMarks) * 100
                      )}
                    </small>
                  </div>
                  <div className="res-title">
                    <h2>Score</h2>
                  </div>
                  <div className="res-score">
                    <h2>{r.score.$numberDecimal}</h2>
                  </div>
                  <div className="res-owner">
                    <p>
                      <small>Name</small>:<span> {r.studentName}</span>
                    </p>
                    <div className="approve-btn-cont">
                      <button
                        className="approve-btn"
                        onClick={() => ApproveSingleResult(r._id)}
                      >
                        approve
                      </button>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <h1>no result yet</h1>
          )}
        </ul>
      </div>
    </section>
  );
};
export default CandidatesResults;
