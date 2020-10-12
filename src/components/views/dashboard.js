import React, { useState, useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";

import StatsCard from "../sub-components/stats.js";
import Jumbo from "../sub-components/Jumbo";
import Menutile from "../sub-components/menu-tile";
import NewQuizWindow from "../views/newQuiz";
import Loading from "../sub-components/Loading";
import { modeContext } from "../../context/mode";
import "../../css/dashboard.css";
import "../../css/quizCreationModal.css";
import { fetchData } from "../../utils/storage";
const Dashboard = (props) => {
  const school = fetchData("school");
  const schoolName = fetchData("school-name");
  const { setHeading } = useContext(modeContext);
  const [quizModalIsOpen, setQuizModalIsOpen] = useState(false);
  const [statistics, setStatistics] = useState({
    exams: 0,
    quizzes: 0,
    candidates: 0,
  });
  const [loading, setLoading] = useState(true);
  //const { search } = props.location;
  //const id = search.split("=")[1];
  const LinkTo = (route, id = "") => {
    props.history.push(route);
  };
  const fetchStatistics = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/statistics?sch=${school}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setStatistics(data.statistics);
      });
  };
  useEffect(() => {
    setHeading("Dashboard");
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="dashboard">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {quizModalIsOpen ? (
            <NewQuizWindow close={() => setQuizModalIsOpen(false)} />
          ) : (
            ""
          )}
          <div className="dashboard-contents">
            <div className="showcase">
              <Jumbo title={schoolName} />
            </div>
            <div className="stats-cont">
              <h3>Stats</h3>
              <hr />
              <div className="stats-grid">
                <StatsCard label={"Exams"} value={statistics.exams} />
                <StatsCard label={"Quizzes"} value={statistics.quizzes} />
                <StatsCard label={"Candidates"} value={statistics.candidates} />
              </div>
              <h3>options</h3>
            </div>
            <hr />
            <div className="dash-options">
              <Menutile
                title={"New Quiz"}
                icon="dashboard"
                action={() => LinkTo(`/dashboard/create/quiz`)}
              />
              <Menutile
                title={"Notifications"}
                icon={"notifications_active"}
                action={() => LinkTo(`/admin/notifications`)}
              />
              <Menutile
                title={"Quizzes"}
                icon={"list_alt"}
                action={() => LinkTo(`/dashboard/quizzes`)}
              />
              <Menutile
                title={"Candidates"}
                icon="how_to_reg"
                action={() => LinkTo("/dashboard/candidates")}
              />
              <Menutile
                title={"Scoreboard"}
                icon="format_list_numbered"
                action={() => LinkTo("/dashboard/scoreboard")}
              />
              <Menutile
                title={"set exam"}
                icon="history_edu"
                action={() => LinkTo("/dashboard/set/exam")}
              />
              <Menutile
                title={"Exam record"}
                icon={"assignment"}
                action={() => LinkTo("/dashboard/exam/records")}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default withRouter(Dashboard);
