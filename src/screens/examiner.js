import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../components/views/dashboard";
import AdminNotifications from "../components/views/adminNotifications";
import ScoreBoard from "../components/views/scoreboard";
import Quizzes from "../components/views/quizzes";
import QuizList from "../components/views/quizlist";
import Candidates from "../components/views/candidates";
import QuizSolution from "../components/views/solutions";
import CandidatesResults from "../components/views/candidatesResult";
import QuizCreationWindow from "../components/views/newQuiz";
import ExamRecords from "../components/views/examRecords";
import NewExam from "../components/views/newExam";
import EditExam from "../components/views/editExam";
import Settings from "../components/views/settings";
const Examiner = (props) => {
  return (
    <section style={{ width: "100%" }}>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route
        exact
        path="/dashboard/create/quiz"
        component={QuizCreationWindow}
      />
      <Route exact path="/admin/notifications" component={AdminNotifications} />
      <Route exact path="/dashboard/quizzes" component={Quizzes} />
      <Route exact path="/dashboard/quizzes/list" component={QuizList} />
      <Route exact path="/dashboard/candidates" component={Candidates} />
      <Route
        exact
        path="/dashboard/mycandidates/result"
        component={CandidatesResults}
      />
      <Route exact path="/dashboard/scoreboard" component={ScoreBoard} />
      <Route exact path="/dashboard/set/exam" component={NewExam} />
      <Route exact path="/dashboard/exam/records" component={ExamRecords} />
      <Route exact path="/dashboard/edit/exam" component={EditExam} />
      <Route exact path="/quiz/solutions" component={QuizSolution} />
      <Route exact path="/dashboard/settings" component={Settings} />
    </section>
  );
};

export default Examiner;
