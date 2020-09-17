import React, { useEffect, useState, useContext } from "react";
import { modeContext } from "../../context/mode";
import "../../css/scoreboard.css";
import Toast from "../sub-components/toast";
import ExamScore from "../sub-components/examScore";
import Loading from "../sub-components/Loading";
import { fetchData } from "../../utils/storage";
const school = fetchData("school");
const ScoreBoard = (props) => {
  const { switchMode, setHeading } = useContext(modeContext);
  const [isToast, setToast] = useState(false);
  const [text, setText] = useState("No student has submitted!!!");
  const [Exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAllExams = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/get/exams?sch=${school}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 403) {
          setText(data.message);
          setToast(true);
        }
        setExams(data.exams);
        setLoading(false);
      });
  };
  const viewResults = (route, id, mode = "quiz") => {
    // props.history.push("/dashboard/mycandidates/result", { quizId: id });
    props.history.push(route, { quizId: id, mode: mode });
  };
  useEffect(() => {
    setHeading("ScoreBoard");
    switchMode(false);
    fetchAllExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="scoreboard">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {isToast && (
            <Toast
              isOpen={isToast}
              text={text}
              action={setToast}
              animate={"showToast-top"}
              main={"toast-top"}
              top={{ top: "25px" }}
            />
          )}
          {
            <ExamScore
              quizzes={Exams}
              setToast={setToast}
              viewResults={viewResults}
            />
          }
        </div>
      )}
    </section>
  );
};
export default ScoreBoard;
