import React, { useState, useReducer, useEffect } from "react";
import { withRouter } from "react-router-dom";
import TextEditor from "../sub-components/editor";
import Toast from "../sub-components/toast";
import Loader from "../sub-components/indeterminate_indicator";
import Dialog from "../sub-components/dialog";
import "../../css/quiz-editor.css";
import { inputReducer, save, saveEdited } from "../../utils/editorFunctions";
import { validateQuestion } from "../../validators/question";
import { fetchData } from "../../utils/storage";
const school = fetchData("school");
const removeOrangeBorder = () => {
  const designs = document.querySelectorAll(".design-2");
  for (let i = 0; i < designs.length; i++) {
    designs[i].classList.remove("orangeBorder");
  }
};
const addOrangeBorder = (e) => {
  removeOrangeBorder();
  e.target.parentNode.classList.add("orangeBorder");
};
const generateOptions = (inputState, option, dispatch, setoption) => {
  const options = [];
  for (let i = 0; i < inputState.opts.length; i++) {
    options.push(
      <li key={i} className={`design-2 option${i + 1}`}>
        <div className="opt">
          <label>{`option ${i + 1}`}</label>
          <TextEditor
            focus={() => {
              document
                .querySelector(`.option${i + 1}`)
                .classList.add("orangeBorder");
            }}
            blur={() => {
              document
                .querySelector(`.option${i + 1}`)
                .classList.remove("orangeBorder");
            }}
            value={inputState.opts[i].value}
            handler={(e) => {
              dispatch({
                type: "opt",
                value: e,
                key: `option${i + 1}`,
                i: i,
                id: inputState.opts[i].id ? inputState.opts[i].id : 0,
              });
            }}
          />
          <button
            className="del-options"
            onClick={() => {
              dispatch({
                type: "delete",
                i: i,
                id: inputState.existing.length > i ? inputState.opts[i].id : 0,
              });
            }}
          >
            <i className="material-icons">clear</i>
          </button>
        </div>
      </li>
    );
  }
  return options;
};
const generateAnswer = (option, data, ans) => {
  const pattern = /(<[\/]{0,}p>)/gi;

  const answersOptions = [];
  for (let i = 0; i < data.length; i++) {
    answersOptions.push(
      <option
        key={i}
        value={data[i] ? data[i].value.replace(pattern, "") : null}
      >
        {`option${i + 1}`}
      </option>
    );
  }
  return answersOptions;
};

const QuizEditor = (props) => {
  const { match } = props;
  const { search } = props.location;
  //const isNew = search.split("new=")[1];
  const isNew = search.split("new=")[1].split("&")[0];
  const quid =
    isNew === "true"
      ? search.split("quid=")[1].split("&")[0]
      : search.split("qu=")[1].split("&")[0];
  const [option, setoptions] = useState(0);
  let [inputState, dispatch] = useReducer(inputReducer, {
    question: "",
    answer: "",
    message: "",
    showToast: false,
    isEdit: false,
    opts: [],
    existing: [],
    todelete: [],
    loading: false,
    dialog: true,
  });
  const addOptions = () => {
    if (inputState.opts.length > 4) {
      return dispatch({
        type: "toast",
        message: "no of input field exceeded!!!",
      });
    }
    dispatch({
      type: "newopt",
      data: {
        name: `option${inputState.opts.length + 1}`,
        value: "",
        id: 0,
      },
    });
  };
  const fetchQuestion = () => {
    const pattern = /(<[\/]{0,}p>)/gi;

    const url = `${process.env.REACT_APP_HEAD}/school/class/get/question?qu=${quid}&quiz=${match.params.quiz}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const { question } = data;
        const options = question.options;
        let answer = "";
        const opts = [];
        const existing = [];
        //format the options structure
        options.forEach((option, index) => {
          if (option.isAnswer) {
            answer = `option${index + 1}`;
            // answer = option.option;
          }
          opts.push({
            name: `option${index + 1}`,
            value: option.option,
            id: option.id,
            i: index,
          });
          existing.push(option.id);
        });
        setoptions(question.options.length);
        opts.forEach((o) => {
          o.value = o.value.replace(pattern, "");
        });
        dispatch({
          type: "edit",
          question: question.question,
          opts: opts,
          answer: "", //answer,
          existing: existing,
        });
      });
  };
  const canCreate = validateQuestion(
    inputState.opts,
    inputState.answer,
    inputState.question
  );
  useEffect(() => {
    if (isNew.toString() !== "true") {
      fetchQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="quiz-editor-cont">
      <div className="quiz-editor-body">
        {inputState.loading ? (
          <Loader
            style={{ backgroundColor: "rgba(255,255,255,.7)", zIndex: 1 }}
          />
        ) : (
          ""
        )}
        {inputState.dialog ? (
          <Dialog
            title={"NOTE"}
            text={`To have your equation rendered properly pls take note of the follow:
        `}
            action={() => dispatch({ type: "dialog" })}
            list={
              <ul className="note-ul">
                <li>
                  Build your equations only with the aid of the equation
                  builder, descriptive texts should be added via the main editor
                </li>
                <li>
                  Do not add spaces when building your equation around operators
                  or around the equation symbols{" "}
                </li>
                <li>
                  Ensure you add spaces between the equation in the main editor
                  and the descriptive texts
                </li>
              </ul>
            }
          />
        ) : (
          ""
        )}
        <Toast
          isOpen={inputState.showToast}
          action={() => dispatch({ type: "toast" })}
          text={inputState.message}
          styles={{}}
          animate={"showToast-top"}
          main={"toast-top"}
          top={{ top: "25px" }}
        />
        <div className="quiz-editor">
          <div className="quiz-editor-heading">Question editor</div>
          <div className="question-tile">
            <div className="question design-2">
              <label htmlFor="question">Question</label>
              <TextEditor
                value={inputState.question}
                focus={(e) => {
                  document
                    .querySelector(".question")
                    .classList.add("orangeBorder");
                }}
                blur={() => {
                  document
                    .querySelector(".question")
                    .classList.remove("orangeBorder");
                }}
                handler={(val) => {
                  dispatch({ type: "addQuestion", value: val });
                }}
              />
            </div>
            <div className="options">
              <p>options</p>
              {isNew === "true" ? (
                <div>
                  <ul className="options-list">
                    {generateOptions(inputState, option, dispatch, setoptions)}
                  </ul>
                  <button onClick={addOptions} className="add-option">
                    add option <i className="material-icons">control_point</i>
                  </button>
                </div>
              ) : (
                <div>
                  <ul>
                    {generateOptions(inputState, option, dispatch, setoptions)}
                  </ul>
                  <div>
                    <button onClick={addOptions} className="add-option">
                      add option
                    </button>
                  </div>
                </div>
              )}
              <ul className="options-list">
                <li className="ans design-2">
                  <label>Answer</label>&nbsp;
                  <select
                    onFocus={addOrangeBorder}
                    onBlur={removeOrangeBorder}
                    value={inputState.answer}
                    onChange={(e) => {
                      dispatch({ type: "ans", answer: e.target.value });
                    }}
                  >
                    <option value={""}>none</option>
                    {generateAnswer(option, inputState.opts, inputState.answer)}
                  </select>
                </li>
              </ul>
            </div>
            <hr />
            <div className="editor-controls">
              <button
                onClick={
                  !inputState.loading
                    ? () =>
                        props.history.replace(
                          `/dashboard/quizzes/list?sid=${school}&quid=${match.params.quiz}`
                        )
                    : null
                }
              >
                cancel
              </button>
              {canCreate ? (
                <button
                  onClick={
                    isNew === "true"
                      ? () => {
                          removeOrangeBorder();
                          save(
                            inputState,
                            quid,
                            props.history,
                            props.school,
                            dispatch,
                            setoptions
                          );
                        }
                      : () => {
                          removeOrangeBorder();
                          saveEdited(
                            inputState,
                            quid,
                            props.history,
                            match.params.quiz,
                            dispatch
                          );
                        }
                  }
                >
                  {isNew === "true" ? "Create" : "Save changes"}
                </button>
              ) : (
                <button style={{ backgroundColor: "grey" }}>
                  {" "}
                  {isNew === "true" ? "Create" : "Save changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withRouter(QuizEditor);
