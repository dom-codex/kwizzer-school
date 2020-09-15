export const retrieveValue = (key, options) => {
  const option = options.find((opt) => opt.name.toString() === key.toString());
  if (!option) return "";
  return option.value;
};
export const inputReducer = (state, action) => {
  let alreadyExisting;
  let todelete = [];
  switch (action.type) {
    case "addQuestion":
      return {
        ...state,
        question: action.value,
      };
    case "newopt": {
      return { ...state, opts: [...state.opts, action.data] };
    }
    case "opt":
      const data = state.opts.map((o) => {
        if (o.name === action.key) {
          o.value = action.value;
          return o;
        } else {
          return o;
        }
      });

      /*data[action.i] = {
        name: action.key,
        value: action.value,
        i: action.i,
        id: action.id,
      };*/
      return {
        ...state,
        opts: [...data],
      };
    case "newOption":
      return {
        ...state,
        options: {
          ...state.options,
          [action.input]: action.value,
        },
      };
    case "ans": {
      return {
        ...state,
        answer: action.answer,
      };
    }
    case "answer":
      return {
        ...state,
        answer: action.answer,
      };
    case "edit":
      return {
        ...state,
        question: action.question,
        opts: action.opts,
        answer: action.answer,
        isEdit: true,
        existing: action.existing,
      };
    case "delete":
      if (state.isEdit) {
        alreadyExisting = state.existing.some((id) => id === action.id);
        if (alreadyExisting) {
          todelete.push(action.id);
        }
      }
      const latest = state.opts.filter(
        (_, i) => i.toString() !== action.i.toString()
      );
      return {
        ...state,
        opts: latest,
        answer: "",
        todelete: [...state.todelete, action.id],
      };
    case "none":
      return {
        ...state,
        answer: "",
      };
    case "toast":
      return {
        ...state,
        showToast: !state.showToast,
        message: action.message,
      };
    case "success":
      return {
        ...state,
        showToast: !state.showToast,
        question: "",
        options: {},
        answer: "",
        message: action.message,
        isEdit: false,
        opts: [],
      };
    case "loading":
      return {
        ...state,
        loading: !state.loading,
      };
    case "dialog":
      return {
        ...state,
        dialog: !state.dialog,
      };
    default:
      return state;
  }
};
export const textHandler = (e, input, name, dispatch, type) => {
  switch (name) {
    case "question":
      dispatch({ type: type, question: e.target.value });
      break;
    case "option":
      dispatch({ type: type, input: input, value: e.target.value });
      break;
    case "answer":
      if (!e.target.value.length) {
        return dispatch({ type: "none" });
      }
      dispatch({ type: type, answer: e.target.value });
      break;
    default:
      return;
  }
};
export const save = (data, quid, history, school, dispatch, setoptions) => {
  dispatch({ type: "loading" });
  const url = `${process.env.REACT_APP_HEAD}/school/class/create/question?quid=${quid}`;
  const body = { ...data };
  delete body["showToast"];
  delete body["isEdit"];
  delete body["message"];
  delete body["existing"];
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      dispatch({ type: "loading" });
      if (resp.code === 403) {
        return dispatch({ type: "toast", message: resp.message });
      } else if (resp.code === 201) {
        return dispatch({ type: "success", message: resp.message });

        //  history.push(`/dashboard/quizzes/list?quid=${quid}`, {});
      }
    });
};
export const saveEdited = (data, quid, history, quiz, dispatch) => {
  const pattern = /(<[\/]{0,}p>)/gi;

  dispatch({ type: "loading" });
  const url = `${process.env.REACT_APP_HEAD}/school/class/update/question?quid=${quid}&quiz=${quiz}`;
  const body = { ...data };
  delete body["showToast"];
  delete body["isEdit"];
  delete body["message"];
  body.opts.forEach((o) => {
    o.value = o.value.replace(pattern, "");
  });
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      dispatch({ type: "loading" });
      if (resp.code === 201) {
        history.push(`/dashboard/quizzes/list?quid=${quiz}`);
      }
    });
};
