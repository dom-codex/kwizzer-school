import React, { useEffect, useState, useReducer } from "react";
import { withRouter } from "react-router-dom";

import Timer from "../sub-components/timer";
import Dialog from "../sub-components/dialog";
import QuestionDisplayArea from "../sub-components/question-display";
import OptionLabel from "../sub-components/option-label";
import "../../css/question.css";
const myStyle = {
  backgroundColor: "green",
};
let message =
  "This marks the end of the quiz!!! Good luck on checking your result";
let heading = "Congratulations";
const Question = (props) => {
  const stateData = props.location.state;
  const reducer = (state, action) => {
    switch (action.type) {
      case "init":
        return {
          ...state,
          id: action.id,
          questions: action.questions,
        };
      case "answer":
        state.questions[action.index]["answer"] = action.value;
        return {
          ...state,
        };
      default:
        return state;
    }
  };
  const [question, dispatch] = useReducer(reducer, {
    id: "",
    questions: [],
  });
  const [index, setIndex] = useState(0);
  const [showDialog, setDialog] = useState(false);
  const { state } = props.location;
  const fetchQuestions = () => {
    let url = `${process.env.REACT_APP_HEAD}/school/student/quiz?pid=${state.user.pid}&quiz=${state.quiz}&sch=${state.sch}&retry=${stateData.retry}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.code === 403) {
          heading = "ALERT";
          message = data.message;
          setDialog(true);
        } else {
          dispatch({ type: "init", id: data.id, questions: data.questions });
        }
      });
  };
  useEffect(fetchQuestions, []);
  const questions = question.questions;
  const submitAQuestion = (index, value) => {
    const url = `${process.env.REACT_APP_HEAD}/school/student/submitquestion`;
    const data = {
      index: index + 1,
      id: question.id,
      ans: value,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((res) => {
        alert("submitted successfully");
      });
  };
  const selectAnswer = (index, value) => {
    dispatch({ type: "answer", index: index, value: value });
    submitAQuestion(index, value);
  };
  const switchQuestion = (direction) => {
    if (direction === "forward") {
      if (index === question.questions.length - 1) {
        return setIndex(1);
      }
      return setIndex((prevIndex) => prevIndex + 1);
    }
    if (index === 0) return;
    setIndex((prevIndex) => prevIndex - 1);
  };
  const redirect = () => {
    props.history.push(`/menu?ref=${state.user.pref}`, {
      pid: state.user.pid,
      pref: state.user.pref,
    });
  };
  const submit = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/student/submit`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mquid: question.id,
        squid: stateData.quiz,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 201) {
          heading = "Congratulations";
          message =
            "This marks the end of the quiz!!! Good luck on checking your result";
          setDialog(true);
        }
      });
  };
  return (
    <section className="question">
      {showDialog && (
        <Dialog title={heading} text={message} action={redirect} />
      )}
      <div className="header">
        {/**pass the quiz name from out side and the time too */}
        <h2>{stateData.title}</h2>
        <button onClick={submit}>submit</button>
      </div>
      {question.questions.length && (
        <Timer time={stateData.time} submit={submit} />
      )}
      <div className="question-selector">
        <div className="question-list">
          <button>1</button>
          <button>2</button>
        </div>
        <p>{`${index + 1} / ${question.questions.length}`}</p>
      </div>
      {questions.length && (
        <div>
          <QuestionDisplayArea
            index={index + 1}
            question={question.questions[index].question}
          />
          <div className="question-options">
            <ul>
              {question.questions[index].options.map((q, i) => {
                return (
                  <li
                    style={
                      question.questions[index].answer === q.option
                        ? myStyle
                        : null
                    }
                    onClick={() => selectAnswer(index, q.option)}
                  >
                    <OptionLabel i={i} />
                    <div>{q.option}</div>
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
    </section>
  );
};
export default withRouter(Question);
