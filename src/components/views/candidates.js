import React, { useState, useEffect, useContext } from "react";
import { modeContext } from "../../context/mode";
import Toast from "../sub-components/toast";
import ExamCandidatesWindow from "../sub-components/examCandidates";
import CandidateList from "../sub-components/appliedCandidatesList";
import Loading from "../sub-components/Loading";
import "../../css/candidate.css";
import { fetchData } from "../../utils/storage";
const school = fetchData("school");
const Published = (props) => {
  const { switchMode, setHeading } = useContext(modeContext);
  // const sref = props.location.state.sref;
  const [candidates, setCandidates] = useState([]);
  const [exams, setExams] = useState([]);
  const [showList, setShowList] = useState(false);
  const [param, setParam] = useState({ sch: school, quiz: "" });
  const [isToast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchExams = () => {
    let url = `${process.env.REACT_APP_HEAD}/school/get/examinations?sch=${school}`;

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setExams(data.exams);
        setLoading(false);
      });
  };
  const fetchRegCandidates = (id) => {
    const url = `${process.env.REACT_APP_HEAD}/school/get/exam/hallstudents?sch=${school}&exam=${id}`;

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setCandidates(data.students);
      });
  };
  const getParam = (data) => {
    setParam(data);

    fetchRegCandidates(data.quiz);
  };
  useEffect(() => {
    switchMode(false);
    setHeading("Candidates");
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="candidates">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {isToast && (
            <Toast
              isOpen={isToast}
              action={setToast}
              text={"No candidate has regisetered for the quiz"}
              animate={"showToast-top"}
              main={"toast-top"}
              top={{ top: "25px" }}
            />
          )}
          {showList && (
            <CandidateList
              candidates={candidates}
              param={param}
              closeList={() => setShowList(false)}
            />
          )}
          <div className="published-quiz-list">
            <ExamCandidatesWindow
              exams={exams}
              isExam={true}
              showList={setShowList}
              setToast={setToast}
              getParam={getParam}
            />
          </div>
        </div>
      )}
    </section>
  );
};
export default Published;
