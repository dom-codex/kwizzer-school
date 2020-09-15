import React from "react";
import Switch from "../sub-components/switch";
import "../../css/exam.css";
import QuizOverlay from "../sub-components/QuizOverlay";
const removeOrangeBorder = () => {
  const forms1 = document.querySelectorAll(".exam-forms");
  const forms2 = document.querySelectorAll(".exam-forms-duration");
  for (let i = 0; i < forms1.length; i++) {
    forms1[i].classList.remove("orangeBorder");
  }
  for (let i = 0; i < forms2.length; i++) {
    forms2[i].classList.remove("orangeBorder");
  }
  document.querySelector(".max-retries").classList.remove("orangeBorder");
};
const addOrangeBorder = (e) => {
  removeOrangeBorder();
  e.target.parentNode.classList.add("orangeBorder");
};
const ExamForm = (props) => {
  const { state } = props;
  const { err } = state;
  return (
    <div className="examform">
      <div className="new-exam-switch">
        <span>Type:</span>
        {!props.isedit && (
          <div>
            <span>Standard</span> &nbsp;{" "}
            <Switch
              toggle={state.switch}
              isExam={true}
              setToggle={props.toggle}
            />{" "}
            &nbsp;
            <span>Custom</span>
          </div>
        )}
        {props.isedit && <div>{state.type}</div>}
      </div>

      <div className="exam-form">
        <div className="exam-forms">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            onFocus={addOrangeBorder}
            value={state.title}
            onChange={(e) => props.textHandler(e, "title")}
            placeholder="exam name"
            style={err.title ? { borderColor: "red", borderWidth: "2px" } : {}}
          />
          <br />
          <small>{err.title ? err.title.msg : ""}</small>
        </div>
        <div className="exam-forms">
          <label htmlFor="nquiz">No of Quiz</label>
          <input
            id="nquiz"
            type="number"
            onFocus={addOrangeBorder}
            value={state.nquiz}
            onChange={(e) => props.textHandler(e, "nquiz")}
            placeholder="no of quiz"
            style={err.nquiz ? { borderColor: "red", borderWidth: "2px" } : {}}
          />
          <small>{err.nquiz ? err.nquiz.msg : ""}</small>
        </div>
        <div className="exam-forms">
          <label htmlFor={"total-mark"}>Total Marks</label>
          <input
            id="total-mark"
            type="numbers"
            placeholder="total marks"
            onFocus={addOrangeBorder}
            value={state.total}
            onChange={(e) => props.textHandler(e, "total")}
            style={err.total ? { borderColor: "red", borderWidth: "2px" } : {}}
          />
          <small>{err.total ? err.total.msg : ""}</small>
        </div>
        <div className="exam-forms-duration">
          <span>Duration</span>
          <br />
          <input
            id="hours"
            type="number"
            onFocus={addOrangeBorder}
            placeholder="hrs"
            onChange={(e) => props.textHandler(e, "hr")}
            value={state.hr}
            style={err.hr ? { borderColor: "red" } : {}}
          />
          <label htmlFor={"hours"}>hrs</label>
          <input
            id="minutes"
            type="number"
            onFocus={addOrangeBorder}
            placeholder="min"
            onChange={(e) => props.textHandler(e, "min")}
            value={state.min}
            style={err.min ? { borderColor: "red" } : {}}
          />
          <label htmlFor="minutes">min</label>
          <input
            id="seconds"
            type="number"
            placeholder="sec"
            onFocus={addOrangeBorder}
            onChange={(e) => props.textHandler(e, "sec")}
            value={state.sec}
            style={err.sec ? { borderColor: "red" } : {}}
          />
          <label htmlFor="seconds">sec</label> <br />
        </div>
        {!props.edit && state.type !== "custom" && (
          <div className="exam-forms-result">
            <button
              onClick={() => props.selectQuiz(true)}
              className="select-btn"
            >
              select quiz
            </button>
          </div>
        )}
        {
          <div className="swi">
            <p>Retry</p>
            <Switch
              toggle={state.setRetry}
              isExam={true}
              forRetry={true}
              setToggle={() => props.dispatch({ type: "setRetry" })}
              handleInput={""}
            />
          </div>
        }
        {
          <div className={`max-retries ${state.setRetry ? "" : "zero"}`}>
            <label htmlFor="max-retries">Max retries</label>
            <input
              type="number"
              id="max-retries"
              step="1"
              onFocus={addOrangeBorder}
              onChange={(e) =>
                props.dispatch({ type: "retries", value: e.target.value })
              }
              value={state.retries}
              placeholder="maximum number of retries"
            />
          </div>
        }
        <div className="exam-forms-result">
          <span>Deliver Result on submition</span>
          <div style={{ height: "10px" }}></div>
          <label htmlFor="yes">yes</label>
          <input
            type="radio"
            id="yes"
            value="onsubmition"
            checked={state.choice === "onsubmition" ? true : false}
            onChange={() =>
              props.textHandler({ target: { value: "onsubmition" } }, "choice")
            }
          />

          <label htmlFor="no">no</label>
          <input
            type="radio"
            id="no"
            value="manual"
            checked={state.choice === "manual" ? true : false}
            onChange={() =>
              props.textHandler({ target: { value: "manual" } }, "choice")
            }
          />
        </div>
        <div className="exam-btn">
          {props.isValidated ? (
            <button
              onClick={() => {
                removeOrangeBorder();
                props.save();
              }}
            >
              SET
            </button>
          ) : (
            <button disabled={true}>set</button>
          )}
        </div>
      </div>
    </div>
  );
};
const Exam = (props) => {
  const { data } = props;
  return (
    <section>
      {!data.isLoading ? (
        <div>
          {
            <QuizOverlay
              action={data.setList}
              state={data.data.quiz}
              isOpen={data.isOpen}
              slideDown={{ transform: "translateY(100%)" }}
              textHandler={props.checkboxHandler}
              quizzes={data.quizzes}
            />
          }
          <div className="exam-content">
            <ExamForm
              toggle={props.toggle}
              isedit={props.isedit}
              dispatch={props.dispatch}
              selectQuiz={data.setList}
              textHandler={props.inputHandler}
              state={data.data}
              save={props.save}
              isValidated={props.isValidated}
            />
          </div>
        </div>
      ) : (
        <h1>loading...</h1>
      )}
    </section>
  );
};

export default Exam;
