import React, { useReducer, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";

import { modeContext } from "../../context/mode";
import Timer from "../sub-components/timer";
import Dialog from "../sub-components/dialog";
import QuestionDisplayArea from "../sub-components/question-display";
import OptionLabel from "../sub-components/option-label";
import Toast from "../sub-components/toast";
import { examsReducer } from "../../utils/examstore";
import { checkForEquation } from "../../utils/transformQuestion";
import "../../css/question.css";
const myStyle = {
  backgroundColor: "green",
};

const generateJumpers = (n, dispatch, ci) => {
  const jumpers = [];
  for (let i = 0; i < n; i++) {
    jumpers.push(
      <button
        key={i}
        style={ci === i ? { backgroundColor: "#ccc" } : {}}
        onClick={() => dispatch({ type: "select", index: i })}
      >
        {1 + i}
      </button>
    );
  }
  return jumpers;
};
const Examination = (props) => {
  const { switchMode } = useContext(modeContext);
  const { state } = props.location;
  const [data, dispatch] = useReducer(examsReducer, {
    id: "",
    quizzes: [],
    questions: [],
    currentquiz: {},
    currentquestion: "",
    currentQuizIndex: 0,
    currentQuestionIndex: 0,
    showDialog: false,
    openSelector: false,
    openQuizSelector: false,
    showToast: false,
    text: "submitted",
    dialogTitle: "WellDone",
    dialogText:
      "This marks the end of the exam!!! Good luck on checking your result",
  });
  const LoadExam = () => {
    let url = `${process.env.REACT_APP_HEAD}/school/get/exampaper?pid=${state.user}&exam=${state.quiz}&sheet=${state.sheet}`;
    if (state.retry) {
      url = `${process.env.REACT_APP_HEAD}/school/exam/retry?sheet=${state.sheet}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((exam) => {
        if (exam.code === 403) {
          return props.history.replace(`/menu/myexams`, { denied: true });
        } else if (exam.code === 401) {
          dispatch({ type: "dialogTitle", title: "Opps!!!" });
          dispatch({ type: "dialogTxt", txt: exam.message });
          return dispatch({ type: "dialog" });
        }
        const {
          quizzes: { quizzes, _id },
        } = exam;
        dispatch({
          type: "init",
          quizzes: quizzes,
          sheet: _id,
        });
      });
  };
  const submit = (choice) => {
    const url = `${process.env.REACT_APP_HEAD}/school/submit/exam/question`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quid: data.currentQuizIndex,
        quest: data.currentQuestionIndex,
        id: data.id,
        answer: choice,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          return dispatch({
            type: "toast",
            txt: "Saved!!!",
          });
        }
      });
  };
  const submitExam = (timer) => {
    clearInterval(timer);
    const url = `${process.env.REACT_APP_HEAD}/school/submit/examination`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizzes: data.quizzes,
        sheet: data.id,
        student: state.user.pid,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          dispatch({ type: "dialog" });
        }
      });
  };
  const redirect = () => {
    props.history.replace(`/menu`);
  };
  const selectAnswer = (i, option) => {
    dispatch({
      type: "answer_a_question",
      answer: option,
      submit: submit,
    });
  };
  const switchQuestion = (direction) => {
    if (
      direction === "forward" &&
      data.currentQuestionIndex < data.questions.length - 1
    ) {
      dispatch({ type: "next" });
    } else if (direction === "backward" && data.currentQuestionIndex > 0) {
      dispatch({ type: "prev" });
    }
  };
  const selectQuiz = (index) => {
    dispatch({
      type: "change_quiz",
      index: index,
    });
  };
  const genQuizSelectors = (quizzes) => {
    const selectors = quizzes.map((quiz, i) => {
      return (
        <button
          key={i}
          onClick={() => {
            selectQuiz(i);
            dispatch({ type: "openQuizTray" });
          }}
        >
          {quiz.title}
        </button>
      );
    });
    return selectors;
  };
  useEffect(() => {
    switchMode(false);
    LoadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="question">
      <Toast
        isOpen={data.showToast}
        action={() => dispatch({ type: "hidetoast" })}
        text={data.text}
        styles={{}}
        animate={"showToast"}
        main={"toast"}
        top={{ bottom: "25px" }}
      />
      {data.showDialog && (
        <Dialog
          title={data.dialogTitle}
          text={data.dialogText}
          action={
            data.dialogTitle === "Opps!!!"
              ? () => {
                  dispatch({
                    type: "dialogTitle",
                    title: "WellDone",
                  });
                  dispatch({
                    type: "dialogTxt",
                    txt:
                      "This marks the end of the exam!!! Good luck on checking your result",
                  });
                  return dispatch({
                    type: "dialog",
                  });
                }
              : redirect
          }
        />
      )}
      <div className="header">
        {/**pass the quiz name from out side and the time too */}
        <h2>{state.title}</h2>
      </div>
      {
        /*question.questions.length*/ data.questions.length && (
          <Timer time={state.time} submit={submitExam} />
        )
      }
      <div className="question-selector">
        <div className="selectors">
          <button onClick={() => dispatch({ type: "openQuizTray" })}>
            select Quiz
          </button>
          <button
            className="jump-cont"
            onClick={() => dispatch({ type: "openSelector" })}
          >
            select Question
          </button>
        </div>
        <div className={`jumper ${data.openQuizSelector ? "slideup" : ""}`}>
          <div className="jumper-btn">{genQuizSelectors(data.quizzes)}</div>
        </div>
      </div>
      {data.questions.length && (
        <div style={{ position: "relative" }}>
          <p
            style={{
              position: "absolute",
              right: "12px",
            }}
          >{`${data.currentQuestionIndex + 1} / ${data.questions.length}`}</p>
          <QuestionDisplayArea
            index={data.currentQuestionIndex + 1}
            question={
              data.questions[data.currentQuestionIndex]
                .question /*question.questions[index].question*/
            }
          />

          <div className="question-options">
            <ul>
              {data.questions[data.currentQuestionIndex].options.map((q, i) => {
                return (
                  <li
                    key={i}
                    style={
                      data.questions[data.currentQuestionIndex].answer ===
                      q.option
                        ? myStyle
                        : null
                    }
                    onClick={() => selectAnswer(0, q.option)}
                  >
                    <OptionLabel i={i} />
                    <div>{checkForEquation(q.option)}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      <div className="question-controls">
        <button onClick={() => switchQuestion("backward")}>Prev</button>
        <button onClick={() => switchQuestion("forward")}>Next</button>
      </div>
      <div className="jump">
        <div className={`jumper ${data.openSelector ? "slideup" : ""}`}>
          <div className="jumper-btn">
            {generateJumpers(
              data.questions.length,
              dispatch,
              data.currentQuestionIndex
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default withRouter(Examination);
