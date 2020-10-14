import React from "react";
import { Route, Switch } from "react-router-dom";
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
import Whitelist from "../components/views/whitelist";
import Page404 from "../components/views/404";
import QuestionEditor from "../components/views/quiz-editor";
import Registration from "../components/views/registration";
import Signup from "../components/auth/signUp";
import Login from "../components/auth/login";
import PrivateRoute from "../private/privateRoute";
const Examiner = (props) => {
  return (
    <section style={{ width: "100%" }}>
      <Switch>
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute
          exact
          path="/dashboard/create/quiz"
          component={QuizCreationWindow}
        />
        <PrivateRoute
          exact
          path="/admin/notifications"
          component={AdminNotifications}
        />
        <PrivateRoute exact path="/dashboard/quizzes" component={Quizzes} />
        <PrivateRoute
          exact
          path="/dashboard/quizzes/list"
          component={QuizList}
        />
        <PrivateRoute
          exact
          path="/dashboard/candidates"
          component={Candidates}
        />
        <PrivateRoute
          exact
          path="/dashboard/mycandidates/result"
          component={CandidatesResults}
        />
        <PrivateRoute
          exact
          path="/dashboard/scoreboard"
          component={ScoreBoard}
        />
        <PrivateRoute exact path="/dashboard/set/exam" component={NewExam} />
        <PrivateRoute
          exact
          path="/dashboard/exam/records"
          component={ExamRecords}
        />
        <PrivateRoute exact path="/dashboard/edit/exam" component={EditExam} />
        <PrivateRoute exact path="/quiz/solutions" component={QuizSolution} />
        <PrivateRoute exact path="/dashboard/settings" component={Settings} />
        <Route
          exact
          path="/exam/register/:sch/:quiz"
          component={Registration}
        />
        <Route
          exact
          path="/school/create"
          component={(props) => Signup({ ...props, admin: true })}
        />
        <Route
          exact
          path="/school/login"
          component={(props) => Login({ ...props, admin: true })}
        />
        <PrivateRoute
          exact
          path="/dashboard/question/:quiz"
          component={QuestionEditor}
        />
        <PrivateRoute
          exact
          path="/dashboard/whitelist/:exam"
          component={Whitelist}
        />
        <Route component={Page404} />
      </Switch>
    </section>
  );
};

export default Examiner;
