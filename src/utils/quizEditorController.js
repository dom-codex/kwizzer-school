export const inputReducer = (state, action) => {
  switch (action.type) {
    case "title":
      return {
        ...state,
        name: action.value,
      };
    case "mark":
      return {
        ...state,
        mark: action.value,
        total: state.nQuestions * action.value,
      };
    case "toanswer":
      return {
        ...state,
        nQuestions: action.value,
        total: state.mark * action.value,
      };
    case "total":
      return {
        ...state,
        total: action.value,
      };
    case "setQuestion":
      return {
        ...state,
        questions: action.questions,
      };
    case "setRef":
      return {
        ...state,
        Qref: action.Qref,
        dialog: !state.dialog,
      };
    case "prefill":
      return {
        ...state,
        ...action.values,
      };
    case "toast":
      return {
        ...state,
        showToast: !state.showToast,
        message: action.message,
        hasErr: action.hasErr,
      };
    case "dialog":
      return {
        ...state,
        dialog: !state.dialog,
      };
    case "loader":
      return { ...state, loader: !state.loader };
    case "delete":
      return {
        ...state,
        questions: state.questions.filter(
          (question) => question.ref !== action.ref
        ),
      };
    default:
      return state;
  }
};
export const textHandler = (e, name, dispatch, type) => {};
export const saveEditedQuiz = (data, quizid, schid, history, dispatch) => {
  dispatch({ type: "loader" });
  const url = `${process.env.REACT_APP_HEAD}/school/class/quiz/edit?quizid=${quizid}`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({ type: "loader" });
      if (data.code === 403) {
        dispatch({
          type: "toast",
          message: data.message,
          hasErr: true,
        });
      }
      if (data.code === 201) {
        dispatch({ type: "toast", message: data.message, hasErr: false });
        //history.push(`/dashboard/quizzes`);
      }
    });
};
export const DeleteQuestion = (ref, dispatch) => {
  dispatch({ type: "loader" });
  const url = `${process.env.REACT_APP_HEAD}/school/question/delete?question=${ref}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      dispatch({ type: "delete", ref: ref });
      dispatch({ type: "dialog" });
      dispatch({ type: "loader" });
      dispatch({ type: "toast", message: res.message, hasErr: false });
    });
};
