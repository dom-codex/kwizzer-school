import React, { useEffect, useReducer, useState } from "react";
import Toast from "../sub-components/toast";
import Loader from "../sub-components/indeterminate_indicator";
import Loading from "../sub-components/Loading";
import Dialog from "../sub-components/dialog";
import "../../css/questionlist.css";
import {
  inputReducer,
  saveEditedQuiz,
  DeleteQuestion,
} from "../../utils/quizEditorController";
import { checkForEquation } from "../../utils/transformQuestion";
import { fetchData } from "../../utils/storage";
const error = {
  backgroundColor: "red",
  color: "#fff",
};
const school = fetchData("school");
const QuestionTile = (props) => {
  const { dispatch } = props;
  const goToEditor = (question, quiz) => {
    props.history.push(
      `/dashboard/question/${quiz}/?new=false&qu=${question}`,
      { quiz: quiz }
    );
  };
  return (
    <div className="questions-tile">
      <ul className="q-ul">
        <li>
          <div className="questions">
            <div className="quiz-nav">
              <button
                onClick={() => dispatch({ type: "setRef", Qref: props.hash })}
                className="question-delete-btn"
              >
                <i className="material-icons">cancel</i>
              </button>
              <button
                className="question-edit-btn"
                onClick={() => goToEditor(props.id, props.quiz)}
              >
                <i className="material-icons">create</i>
              </button>
            </div>
            <h4>Question</h4>
            <div className="q-div">{checkForEquation(props.question)}</div>
            <h4>options</h4>
            <ul className="options-li">
              {props.options.map((option) => {
                return (
                  <li key={option.option}>
                    {checkForEquation(option.option, 30)}{" "}
                    {option.isAnswer ? " (answer)" : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};
const removeOrangeBorder = () => {
  //get all divs with design class
  //add orange border to parent whose input is focused
  const designs = document.querySelectorAll(".design-1");
  //loop tru and remove the orange border class
  for (let i = 0; i < designs.length; i++) {
    designs[i].classList.remove("border-orange");
  }
};
const switchBorderColor = (e) => {
  removeOrangeBorder();
  e.target.parentNode.classList.add("border-orange");
};
const QuizList = (props) => {
  const [loading, setLoading] = useState(true);
  const [quiz, dispatch] = useReducer(inputReducer, {
    name: "",
    total: "",
    mark: "",
    nQuestions: "",
    questions: [],
    showToast: false,
    hasErr: false,
    message: "",
    loader: false,
    dialog: false,
    Qref: "",
  });
  //retrieve necessary params
  const { search } = props.location;
  const quid = search.split("quid=")[1];
  const getQuiz = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/class/questions/all?quid=${quid}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: "setQuestion", questions: data.questions });
        dispatch({
          type: "prefill",
          values: data.quiz,
        });
        setLoading(false);
      });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getQuiz, []);
  return (
    <section className="quiz-editor">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {quiz.loader ? (
            <Loader
              style={{ backgroundColor: "rgba(255,255,255,.8)", zIndex: 2 }}
            />
          ) : (
            ""
          )}
          {quiz.dialog ? (
            <Dialog
              title={"Are your sure?"}
              text={"you want to delete this question?"}
              action={() => DeleteQuestion(quiz.Qref, dispatch)}
              showCancel={true}
              auxAction={() => dispatch({ type: "dialog" })}
            />
          ) : (
            ""
          )}
          <Toast
            isOpen={quiz.showToast}
            action={() => dispatch({ type: "toast" })}
            text={quiz.message}
            styles={quiz.hasErr ? error : {}}
            animate={"showToast-top"}
            main={"toast-top"}
            top={{ top: "25px", zIndex: 2, left: "0%" }}
          />
          <button className="create-fab">
            <a href={`/dashboard/question/${quid}/?new=true&quid=${quid}`}>+</a>
          </button>
          <div className="quiz-name-edit">
            <div className="name-quiz design-1">
              <label htmlFor="quiz-name">Quiz name:</label>

              <input
                id="quiz-name"
                type="text"
                value={quiz.name}
                onFocus={switchBorderColor}
                onChange={(e) =>
                  dispatch({
                    type: "title",
                    value: e.target.value,
                  })
                }
                maxLength="30"
              />
            </div>
            <div className="num-to-ans design-1">
              <label htmlFor="nQuest">To answer</label>
              <input
                type="number"
                id="nQuest"
                value={quiz.nQuestions}
                onFocus={switchBorderColor}
                onChange={(e) =>
                  dispatch({
                    type: "toanswer",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="mark-per-question design-1">
              <label htmlFor="perMark">Mark(s) per question</label>
              <input
                type="number"
                id="perMark"
                step="0.01"
                value={quiz.mark}
                onFocus={switchBorderColor}
                onChange={(e) =>
                  dispatch({
                    type: "mark",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="total-marks design-1">
              <label htmlFor="total">total marks</label>
              <input
                type="number"
                id="total"
                value={quiz.total}
                onFocus={switchBorderColor}
                onChange={(e) =>
                  dispatch({
                    type: "total",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <button
              className="quiz-edit-save"
              onClick={() => {
                saveEditedQuiz(quiz, quid, school, props.history, dispatch);
                removeOrangeBorder();
              }}
            >
              save
            </button>
          </div>

          <div className="question-header">
            <h2>Questions</h2>
            <p>Total: {quiz.questions.length}</p>
          </div>
          <hr />

          <div className="questions-list">
            {quiz.questions.length ? (
              quiz.questions.map((question) => {
                return (
                  <QuestionTile
                    key={question.id}
                    id={question.id}
                    hash={question.ref}
                    history={props.history}
                    question={question.question}
                    options={question.options}
                    quiz={quid}
                    school={school}
                    dispatch={dispatch}
                    questions={quiz.questions}
                  />
                );
              })
            ) : (
              <h1>No Question</h1>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default QuizList;
