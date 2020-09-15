import React, { useReducer, useEffect } from "react";
import QuizOverlay from "../sub-components/QuizOverlay";
import Loader from "../sub-components/indeterminate_indicator";
import "../../css/registration.css";
import { validateRegistrationInput } from "../../utils/validateRegistration";
import Toast from "../sub-components/toast";
const Registration = (props) => {
  //get url params
  const { match } = props;
  const { sch, quiz } = match.params;
  const inputReducer = (state, action) => {
    switch (action.type) {
      case "email":
        return {
          ...state,
          email: action.email,
        };
      case "quiz":
        return {
          ...state,
          quiz: action.quiz,
        };
      case "published":
        return {
          ...state,
          published: action.published,
        };
      case "overlay":
        return {
          ...state,
          overlay: !state.overlay,
        };
      case "subjects":
        return {
          ...state,
          subjects: [...state.subjects, action.value],
        };
      case "rmv":
        return {
          ...state,
          subjects: state.subjects.filter((id) => id !== action.value),
        };
      case "err":
        return {
          ...state,
          showToast: !state.showToast,
          msg: action.msg,
        };
      case "loading":
        return {
          ...state,
          loading: !state.loading,
        };
      default:
        return state;
    }
  };
  const [data, dispatch] = useReducer(inputReducer, {
    email: "",
    quiz: {},
    published: [],
    subjects: [],
    overlay: false,
    showToast: false,
    loading: false,
    msg: "",
  });
  const register = (email) => {
    dispatch({ type: "loading" });
    let url = `${process.env.REACT_APP_HEAD}/school/exam/register?sch=${sch}&exam=${quiz}`;

    let body = {
      subjects: data.subjects,
      email: email,
      type: data.quiz.type,
      quiz: quiz,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch({ type: "loading" });
        if (res.code === 403) {
          dispatch({
            type: "err",
            msg: res.message,
          });
          return;
        }
        if (res.code === 200) {
          dispatch({
            type: "err",
            msg: res.message,
          });
        }
      });
  };
  const getPublishedQuiz = () => {
    //pass the school refrence from outside
    const url = `${process.env.REACT_APP_HEAD}/school/get/all/publishedquiz?sch=${sch}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({
          type: "published",
          published: data.published,
        });
        console.log(data);
      });
  };

  const findTest = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/find/exam?eid=${quiz}&sch=${sch}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "quiz",
          quiz: data.quiz,
        });
        if (data.quiz.type === "custom") {
          getPublishedQuiz();
        }
      });
  };
  const checkboxHandler = (e) => {
    if (!e.target.checked) {
      return dispatch({
        type: "rmv",
        value: e.target.value,
      });
    }
    dispatch({
      type: "subjects",
      value: e.target.value,
    });
  };
  const toggleOverlay = () => {
    dispatch({ type: "overlay" });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(findTest, []);
  return (
    <section className="reg-page">
      {data.loading ? (
        <Loader
          style={{ backgroundColor: "rgba(255,255,255,.7)", zIndex: 1 }}
        />
      ) : (
        ""
      )}
      <div className="reg-heading">
        <h2>Exam Registration</h2>
      </div>
      <Toast
        isOpen={data.showToast}
        action={() => dispatch({ type: "err", msg: "" })}
        text={data.msg}
        styles={{}}
        animate={"showToast-top"}
        main={"toast-top"}
        top={{ top: "25px", left: "10px" }}
      />
      {data.overlay && (
        <QuizOverlay
          quizzes={data.published}
          isExam={true}
          textHandler={checkboxHandler}
          state={data.subjects}
          action={toggleOverlay}
          overlay={{ width: "100%" }}
        />
      )}
      <div className="reg-content">
        <div>
          <div className="reg-header">
            <h1>Exam</h1>
            <h2>Application</h2>
          </div>
          <div className="reg-body">
            <div className="exam-details">
              <h4>Name:</h4>
              <span>{data.quiz.name}</span>
            </div>
            <div className="exam-details">
              <h4>Total Quiz</h4>
              <span>{data.quiz.nQuiz}</span>
            </div>
            <div className="exam-details">
              <h4>Total Marks</h4>
              <span>{data.quiz.TotalMarks}</span>
            </div>
            <div className="exam-details">
              <h4>Time</h4>
              <span>
                {data.quiz.hours > 0 ? data.quiz.hours + " hrs " : ""}
                {data.quiz.minutes > 0 ? data.quiz.minutes + " min " : ""}
                {data.quiz.seconds > 0 ? data.quiz.seconds + " secs " : ""}
              </span>
            </div>
          </div>
          <hr />
          <div className="candidate-email">
            {data.quiz.type === "custom" && (
              <div className="quiz-selector">
                <p>select quiz(s):</p>
                <button onClick={toggleOverlay}>select</button>
              </div>
            )}
            <label>Email</label>

            <input
              type="email"
              value={data.email}
              onInput={(e) =>
                dispatch({
                  type: "email",
                  email: e.target.value,
                })
              }
              placeholder="enter your email address"
            />
          </div>
          <div className="reg-btn">
            {validateRegistrationInput(data) ? (
              <button onClick={() => register(data.email)}>Register</button>
            ) : (
              <button disabled={true}>register</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Registration;
