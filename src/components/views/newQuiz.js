import React, { useReducer, useContext, useEffect } from "react";
import { modeContext } from "../../context/mode";
import Toast from "../sub-components/toast";
import Dialog from "../sub-components/dialog";
import Loader from "../sub-components/indeterminate_indicator";
import "../../css/quizCreationModal.css";
import { fetchData } from "../../utils/storage";
const stylesheet = {
  backgroundColor: "red",
  color: "#fff",
};
const NewQuizWindow = (props) => {
  const school = fetchData("school");
  const inputReducer = (state, action) => {
    let value;
    switch (action.type) {
      case "title":
        return {
          ...state,
          title: action.value,
        };
      case "mark":
        value = parseFloat(action.value);
        return {
          ...state,
          markPerQuestion: value,
          totalMarks: value * state.noOfQuestionforStud,
        };
      case "toanswer":
        value = parseInt(action.value);
        return {
          ...state,
          noOfQuestionforStud: value,
          totalMarks: state.markPerQuestion * value,
        };
      case "total":
        value = parseInt(action.value);
        return {
          ...state,
          totalMarks: value,
        };
      case "dialog":
        return {
          ...state,
          showDialog: !state.showDialog,
          message: action.message,
        };
      case "toast":
        return {
          ...state,
          showToast: !state.showToast,
          message: action.message,
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
  const [inputState, dispatch] = useReducer(inputReducer, {
    title: "",
    markPerQuestion: "",
    noOfQuestionforStud: "",
    totalMarks: "",
    school: school,
    showDialog: false,
    message: "",
    showToast: false,
    loading: false,
  });
  const createQuiz = () => {
    dispatch({ type: "loading" });
    const body = inputState;
    const url = `${process.env.REACT_APP_HEAD}/school/class/create/quiz`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .then((res) => {
        dispatch({ type: "loading" });
        if (res.code === 200) {
          dispatch({ type: "dialog", message: "Quiz created succesfully!!!" });
          //props.history.push(`/dashboard`);
          return;
        }
        if (res.code === 403) {
          dispatch({ type: "toast", message: res.message });
          // setText(res.message);
          //  setToast(true);
        }
      });
  };
  const { setHeading } = useContext(modeContext);
  useEffect(() => {
    setHeading("Kwizzer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="new-quiz-window">
      {inputState.loading ? (
        <Loader
          style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 2 }}
        />
      ) : (
        ""
      )}
      {inputState.showDialog && (
        <Dialog
          title={"Success"}
          text={"Quiz created sucessfully!!!"}
          action={() => props.history.push(`/dashboard`)}
        />
      )}
      {inputState.showToast && (
        <Toast
          text={inputState.message}
          isOpen={inputState.showToast}
          action={() => dispatch({ type: "toast", message: "" })}
          styles={stylesheet}
          animate={"showToast-top"}
          main={"toast-top"}
        />
      )}
      <div className="new-quiz">
        <div className="new-quiz-header">
          <h1 className="app-title">Quizzer</h1>
          <h1 className="form-title">New Quiz </h1>
        </div>
        <div className="quiz-form">
          <div className="quiz-input">
            <label htmlFor={"subject"}>Title</label>
            <input
              id="subject"
              type="text"
              value={inputState.title}
              onChange={(e) =>
                dispatch({ type: "title", value: e.target.value })
              }
              placeholder="course"
            />
          </div>
          <div className="quiz-input">
            <label htmlFor="mark">Mark per Question</label>
            <input
              id="mark"
              step="0.01"
              type="number"
              value={inputState.markPerQuestion}
              onChange={(e) =>
                dispatch({ type: "mark", value: e.target.value })
              }
              placeholder="Mark(s) per question"
            />
          </div>
          <div className="quiz-input">
            <label htmlFor="mark">No of question to be answered</label>
            <input
              id="mark"
              type="number"
              value={inputState.noOfQuestionforStud}
              onChange={(e) =>
                dispatch({ type: "toanswer", value: e.target.value })
              }
              placeholder="No of questions to be answered"
            />
          </div>
          <div className="quiz-input">
            <label htmlFor="total">Total Marks</label>
            <input
              id="total"
              type="number"
              value={inputState.totalMarks}
              onChange={(e) =>
                dispatch({ type: "total", value: e.target.value })
              }
              placeholder="total quiz mark"
            />
          </div>
        </div>
        <div className="create-btn">
          <button onClick={createQuiz}>create quiz</button>
        </div>
      </div>
    </section>
  );
};

export default NewQuizWindow;
