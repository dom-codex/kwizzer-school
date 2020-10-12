import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { modeContext } from "../../context/mode";
import QuizTile from "../sub-components/quiz-tile";
import Toast from "../sub-components/toast";
import Dialog from "../sub-components/dialog";
import Loader from "../sub-components/indeterminate_indicator";
import Loading from "../sub-components/Loading";
import "../../css/quizzes.css";
import { fetchData } from "../../utils/storage";
const QuizList = (props) => {
  const school = fetchData("school");

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [isToast, setToast] = useState(false);
  const [toastTEXT, setTEXT] = useState("");
  const [showDialog, setDialog] = useState(false);
  const [dialogTitle, setTitle] = useState("Are you sure?");
  const [dialogTxt, setTxt] = useState("you want to delete this quiz");
  const [quizRef, setQuizRef] = useState("");
  const [loader, showLoader] = useState(false);
  const { user } = props;
  const fetchAllQuiz = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/class/quiz/all?sid=${school}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const quizzes = res.quizzes;
        setQuizzes(quizzes);
        setLoading(false);
      });
  };
  const { switchMode, setHeading } = useContext(modeContext);
  useEffect(() => {
    setHeading("Quizzes");
    switchMode(false);
    fetchAllQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const publish = (ref) => {
    showLoader(true);
    const url = `${process.env.REACT_APP_HEAD}/school/quiz/publish`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: ref }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        showLoader(false);
        if (res.code === 400) {
          setTEXT(res.message);
          setToast(true);
          return;
        }
        setTEXT(res.message);
        quizzes.forEach((quiz) => {
          if (quiz.ref === ref) {
            quiz.published = true;
          }
        });
        setToast(true);
      });
  };
  const deleteQuiz = (quid) => {
    setDialog(false);
    showLoader(true);
    const url = `${process.env.REACT_APP_HEAD}/school/quiz/delete?quid=${quid}&sid=${school}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        showLoader(false);
        if (data.code === 403) {
          setTEXT(data.message);
          setToast(true);
          return;
        } else if (data.code === 401) {
          setTitle("Opps!!!");
          setTxt(data.message);
          return setDialog(true);
        }
        if (data.code === 201) {
          setTEXT(data.message);
          setToast(true);
          setDialog(false);
          setQuizzes((prev) => {
            const quizzes = prev.filter((quiz) => quiz.ref !== quid);
            return quizzes;
          });
        }
      });
  };
  return (
    <section className="quizzes">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {loader ? (
            <Loader
              style={{ backgroundColor: "rgba(255,255,255,.8)", zIndex: 2 }}
            />
          ) : (
            ""
          )}
          {showDialog && (
            <Dialog
              title={dialogTitle}
              text={dialogTxt}
              showCancel={dialogTitle === "Opps!!!" ? false : true}
              auxAction={() => setDialog(false)}
              action={
                dialogTitle === "Opps!!!"
                  ? () => {
                      setTitle("Are you sure?");
                      setTxt("you want to delete this quiz");
                      setDialog(false);
                    }
                  : () => deleteQuiz(quizRef)
              }
            />
          )}
          {isToast && (
            <Toast
              isOpen={isToast}
              text={toastTEXT}
              action={setToast}
              animate={"showToast"}
              main={"toast"}
              top={{ bottom: "25px" }}
            />
          )}
          <div className="quizzes-list">
            <table cellSpacing="0" cellPadding="0">
              <thead>
                <tr>
                  <th scope="col">s/n</th>
                  <th scope="col">name</th>
                  <th scope="col">questions</th>
                  <th scope="col">published</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              {!quizzes.length ? (
                <h1>NO quiz</h1>
              ) : (
                <tbody>
                  {quizzes.map((quiz, i) => {
                    return (
                      <QuizTile
                        key={quiz.ref}
                        sn={i + 1}
                        school={school}
                        history={props.history}
                        quiz={quiz}
                        user={user}
                        showOverview={props.showOverView}
                        publish={() => publish(quiz.ref)}
                        delete={() => {
                          setQuizRef(quiz.ref);
                          setDialog(true);
                        }}
                      />
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
export default withRouter(QuizList);
