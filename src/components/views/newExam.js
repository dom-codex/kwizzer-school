// eslint-disable-next-line
import React, { useReducer, useEffect, useContext, useState } from "react";
import { withRouter } from "react-router-dom";

import NewExamForm from "../sub-components/examform";
import { modeContext } from "../../context/mode";
import Toast from "../sub-components/toast";
import Loader from "../sub-components/indeterminate_indicator";
import Loading from "../sub-components/Loading";
import { validateExamForm } from "../../validators/exam";
import { fetchData } from "../../utils/storage";
const school = fetchData("school");
const NewExam = (props) => {
  const { switchMode, setHeading } = useContext(modeContext);
  const [loading, setLoading] = useState(true);
  const inputReducer = (state, action) => {
    switch (action.type) {
      case "new":
        return {
          ...state,
          [action.input]: action.value,
        };
      case "quiz":
        return {
          ...state,
          quiz: [...state.quiz, action.value],
          total: parseInt(state.total) + parseInt(action.total),
        };
      case "rmv":
        return {
          ...state,
          quiz: state.quiz.filter((id) => id !== action.value),
          total: parseInt(state.total) - parseInt(action.total),
        };
      case "switch":
        const type = !state.switch;
        return {
          ...state,
          switch: type,
          type: type ? "custom" : "standard",
        };
      case "isloading":
        return {
          ...state,
          isLoading: !state.isLoading,
        };
      case "loading":
        return {
          ...state,
          loading: !state.loading,
        };
      case "isopen":
        return {
          ...state,
          isOpen: !state.isOpen,
        };
      case "quizzes":
        return {
          ...state,
          quizzes: action.quizzes,
        };
      case "setRetry":
        return {
          ...state,
          setRetry: !state.setRetry,
          retries: !state.setRetry === true ? state.retries : 0,
        };
      case "retries":
        return {
          ...state,
          retries: parseInt(action.value),
        };
      case "err":
        return {
          ...state,
          err: action.errors,
        };
      case "clearerr":
        return {
          ...state,
          err: {},
        };
      case "toast":
        return {
          ...state,
          showToast: !state.showToast,
          message: action.msg,
        };
      case "clear":
        return {
          ...state,
          title: "",
          nquiz: "",
          total: 0,
          hr: "",
          min: "",
          sec: "",
          choice: "",
          switch: false,
          type: "standard",
          isOpen: false,
          setRetry: false,
          retries: 0,
          err: {},
          showToast: true,
          message: action.msg,
        };
      default:
        return state;
    }
  };
  const [data, dispatch] = useReducer(inputReducer, {
    quiz: [],
    title: "",
    nquiz: "",
    total: 0,
    hr: "",
    min: "",
    sec: "",
    choice: "",
    switch: false,
    type: "standard",
    isLoading: true,
    loading: false,
    isOpen: false,
    quizzes: [],
    setRetry: false,
    retries: 0,
    err: {},
    showToast: false,
    message: "",
  });
  const inputHandler = (e, name) => {
    let value = e.target.value;
    if (name === "total") {
      value = parseInt(e.target.value || 0);
    }
    dispatch({
      type: "new",
      value: value,
      input: name,
    });
  };
  const checkboxHandler = (e, name, total) => {
    if (!e.target.checked) {
      return dispatch({
        type: "rmv",
        value: e.target.value,
        total: total,
      });
    }
    dispatch({
      type: "quiz",
      input: name,
      value: e.target.value,
      total: total,
    });
  };
  const toggle = () => {
    dispatch({ type: "switch" });
  };
  const getPublishedQuiz = () => {
    //pass the school refrence from outside
    const url = `${process.env.REACT_APP_HEAD}/school/get/all/publishedquiz?sch=${school}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: "isloading" });
        dispatch({
          type: "quizzes",
          quizzes: data.published,
        });
        setLoading(false);
      });
  };
  const save = () => {
    dispatch({ type: "loading" });
    dispatch({ type: "clearerr" });
    const url = `${process.env.REACT_APP_HEAD}/school/set/examination?sch=${school}`;
    let body = { ...data };
    delete body["quizzes"];
    delete body["isOpen"];
    delete body["isLoading"];
    delete body["switch"];
    delete body["err"];
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
          return dispatch({
            type: "err",
            errors: res.errors,
          });
        } else if (res.code === 401) {
          return dispatch({
            type: "toast",
            msg: res.message,
          });
        }
        dispatch({
          type: "clear",
          msg: "exam created!!!",
        });
      });
  };
  useEffect(() => {
    setHeading("Set Exam");
    switchMode(false);
    getPublishedQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="exam-form-cont">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {data.loading ? (
            <Loader
              style={{ backgroundColor: "rgba(255,255,255,.7)", zIndex: 1 }}
            />
          ) : (
            ""
          )}
          <Toast
            isOpen={data.showToast}
            action={() => dispatch({ type: "toast" })}
            text={data.message}
            styles={{}}
            animate={"showToast-top"}
            main={"toast-top"}
            top={{ top: "25px", left: "30px" }}
          />
          <NewExamForm
            inputHandler={inputHandler}
            save={save}
            toggle={toggle}
            dispatch={dispatch}
            checkboxHandler={checkboxHandler}
            data={{
              isOpen: data.isOpen,
              isLoading: data.isLoading,
              quizzes: data.quizzes,
              setList: () => dispatch({ type: "isopen" }),
              data: data,
            }}
            isValidated={validateExamForm(data)}
          />
        </div>
      )}
    </section>
  );
};

export default withRouter(NewExam);
