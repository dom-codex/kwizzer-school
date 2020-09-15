const { storeData } = require("./storage");
export const inputReducer = (state, action) => {
  switch (action.type) {
    case "Input":
      return {
        ...state,
        ...action.input,
      };
    case "prefill":
      return {
        ...state,
        email: action.email,
        showToast: !state.showToast,
        password: "",
        message: action.message,
      };
    case "toast":
      return {
        ...state,
        showToast: !state.showToast,
      };
    default:
      return state;
  }
};
export const textHandler = (e, name, dispatch) => {
  switch (name) {
    case "email":
      dispatch({ type: "Input", input: { email: e.target.value } });
      break;
    case "password":
      dispatch({ type: "Input", input: { password: e.target.value } });
      break;
    default:
      console.log("default");
  }
};
export const login = (url, body, redirect, dispatch, showLoader) => {
  showLoader(true);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((resp) => {
      showLoader(false);
      if (resp.code === 403) {
        return dispatch({
          type: "prefill",
          email: resp.email,
          message: resp.message,
        });
      }
      if (resp.code === 200) {
        storeData("school", resp.school);
        return redirect(`/dashboard`);
      }
    });
};
