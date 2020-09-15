import React from "react";
import LongTable from "../sub-components/longtable";
const CandidateList = (props) => {
  //const [candidates, setCandidates] = useState([]);
  /* const fetchCandidates = () => {
    const url = `http://localhost:3500/school/exam/hallstudents?sch=${props.param.sch}&exam=${props.param.quiz}`;

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        //   setCandidates(data.hall);
      });
  };*/
  //  useEffect(fetchCandidates, []);
  return (
    <div className="candidates-list">
      <div className="list-body">
        <button onClick={props.closeList}>X</button>
        <div className="quiz-registered-title">
          <h2>{props.param.title}</h2>
          <p className="amt-reg">
            Total registered: {props.candidates.length || 0}
          </p>
        </div>
        <hr />
        <div className="candidates-table">
          <LongTable details={props.candidates} />
        </div>
      </div>
    </div>
  );
};
export default CandidateList;
