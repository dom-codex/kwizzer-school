import React, { useReducer, useEffect, useState } from "react";
import NewExamForm from "../sub-components/examform";
import Loader from "../sub-components/indeterminate_indicator";
import Loading from "../sub-components/Loading";
import Dialog from "../sub-components/dialog";
import { fetchData } from "../../utils/storage";
import { validateExamForm } from "../../validators/exam";

const school = fetchData("school");
const NewExam = (props) => {
  let exam = props.location.state.exam;
  const [loading, setLoading] = useState(true);
  const inputReducer = (state, action) => {
    switch (action.type) {
      case "new":
        return {
          ...state,
          [action.input]: action.value,
        };
      case "quiz":
        const inList = state.todelete.some((id) => id === action.value);
        return {
          ...state,
          quiz: [...state.quiz, action.value],
          todelete: inList
            ? state.todelete.filter((id) => id !== action.value)
            : [...state.todelete],
        };
      case "rmv":
        const wasChosed = state.existing.some(
          (id) => id.toString() === action.value
        );
        return {
          ...state,
          quiz: state.quiz.filter((id) => id.toString() !== action.value),
          todelete: wasChosed
            ? [...state.todelete, action.value]
            : state.todelete,
          tocreate: state.tocreate.filter(
            (id) => id.toString() !== action.value
          ),
        };
      case "prefill":
        const {
          name,
          TotalMarks,
          hours,
          minutes,
          seconds,
          nQuiz,
          resultDelivery,
        } = action.exam;
        return {
          ...state,
          title: name,
          total: TotalMarks,
          hr: hours,
          min: minutes,
          sec: seconds,
          nquiz: nQuiz,
          choice: resultDelivery,
          quiz: action.quiz,
          existing: action.quiz,
          type: action.exam.type,
          setRetry: action.exam.canRetry,
          retries: action.exam.retries,
        };
      case "tocreate":
        const isinList = state.tocreate.some((id) => id === action.value);
        const Waschosed = state.existing.some(
          (id) => id.toString() === action.value
        );
        if (isinList || Waschosed) return state;
        return {
          ...state,
          tocreate: [...state.tocreate, action.value],
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
      case "showDialog":
        return {
          ...state,
          showDialog: !state.showDialog,
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
    quiz: [],
    quizzes: [],
    todelete: [],
    existing: [],
    tocreate: [],
    type: "",
    isLoading: true,
    loading: false,
    isOpen: false,
    setRetry: false,
    retries: 0,
    title: "",
    nquiz: "",
    total: 0,
    hr: "",
    min: "",
    sec: "",
    choice: "",
    err: {},
    showDialog: false,
  });
  const inputHandler = (e, name) => {
    dispatch({ type: "new", input: name, value: e.target.value });
  };
  const checkboxHandler = (e, name) => {
    const wasChosed = data.quiz.some((id) => id.toString() === e.target.value);
    if (!e.target.checked) {
      dispatch({ type: "rmv", input: name, value: e.target.value });
    } else if (!wasChosed) {
      dispatch({ type: "quiz", input: name, value: e.target.value });
      dispatch({ type: "tocreate", input: name, value: e.target.value });
    } else {
      dispatch({ type: "quiz", input: name, value: e.target.value });
    }
  };
  const getPublishedQuiz = (datas) => {
    const { quiz, exams } = datas;
    //pass the school refrence from outside
    const url = `${process.env.REACT_APP_HEAD}/school/get/all/publishedquiz?sch=${school}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: "prefill", exam: exams, quiz: quiz });
        dispatch({ type: "quizzes", quizzes: data.published });
        dispatch({ type: "isloading" });
        setLoading(false);
      });
  };
  const save = () => {
    dispatch({ type: "loading" });
    dispatch({ type: "clearerr" });
    const url = `${process.env.REACT_APP_HEAD}/school/exam/save?sch=${school}&exam=${exam}`;
    let body = { ...data };
    delete body["quizzes"];
    delete body["isOpen"];
    delete body["isLoading"];
    delete body["switch"];
    delete body["err"];
    delete body["showDialog"];
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
          return dispatch({ type: "err", errors: res.errors });
        }
        dispatch({ type: "showDialog" });
      });
  };
  const fetchSingleExam = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/get/exam?sch=${school}&exam=${exam}`;
    fetch(url)
      .then((res) => res.json())
      .then((resdata) => {
        getPublishedQuiz(resdata);
      });
  };
  useEffect(() => {
    fetchSingleExam();
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
          {data.showDialog && (
            <Dialog
              title={"Notice"}
              text={"Your changes were saved successfully!!!"}
              action={() => props.history.replace("/dashboard/exam/records")}
            />
          )}
          <NewExamForm
            title={"Edit Examination"}
            inputHandler={inputHandler}
            save={save}
            isedit={true}
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

export default NewExam;
