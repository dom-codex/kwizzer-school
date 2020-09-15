const { storeData, clearData } = require("./storage");
const {
  Validatename,
  Validateemail,
  Validatepassword,
  comfirmpassword,
} = require("../validators/signUp");
export const inputReducer = (state, action) => {
  let result;
  switch (action.type) {
    case "Input":
      return {
        ...state,
        ...action.input,
      };
    case "name":
      result = Validatename(action.value);
      return {
        ...state,
        name: action.value,
        notName: !result.result,
        nameErrMsg: result.message,
      };
    case "email":
      result = Validateemail(action.value);
      return {
        ...state,
        email: action.value,
        notEmail: !result.result,
        emailErrMsg: result.message,
      };
    case "password":
      result = Validatepassword(action.value);
      return {
        ...state,
        password: action.value,
        notPassword: !result.result,
        passErrMsg: result.message,
      };
    case "cpassword":
      result = comfirmpassword(state.password, action.value);
      return {
        ...state,
        comfirm: action.value,
        isconfirm: !result.result,
        cErrMsg: result.message,
      };
    case "prefill":
      return {
        ...state,
        name: action.data.name.value,
        nameErrMsg: action.data.name.hasErr ? action.data.name.msg : "",
        email: action.data.email.value,
        emailErrMsg: action.data.email.hasErr ? action.data.email.msg : "",
        phone: action.data.phone.value,
        notName: action.data.name.hasErr ? true : false,
        notEmail: action.data.email.hasErr ? true : false,
        notPassword: action.data.password.hasErr ? true : false,
        passErrMsg: action.data.password.hasErr ? action.data.password.msg : "",
        password: "",
        comfirm: "",
      };
    default:
      return state;
  }
};
export const textHandler = (e, name, dispatch) => {
  switch (name) {
    case "name":
      dispatch({ type: "Input", input: { name: e.target.value } });
      break;
    case "email":
      dispatch({ type: "Input", input: { email: e.target.value } });
      break;
    case "phone":
      dispatch({ type: "Input", input: { phone: e.target.value } });
      break;
    case "password":
      dispatch({ type: "Input", input: { password: e.target.value } });
      break;
    case "comfirm":
      dispatch({ type: "Input", input: { comfirm: e.target.value } });
      break;
    default:
      return;
  }
};
export const submitValue = (url, details, redirect, dispatch, showLoader) => {
  clearData("person");
  showLoader(true);
  const data = { ...details };
  delete data["notName"];
  delete data["notEmail"];
  delete data["notPassword"];
  delete data["isconfirm"];
  delete data["nameErrMsg"];
  delete data["emailErrMsg"];
  delete data["passErrMsg"];
  delete data["cansubmit"];
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      showLoader(false);
      if (data.code === 403) {
        return dispatch({ type: "prefill", data: data.data });
      }
      if (data.code === 200) {
        storeData("school", data.school.ref);
        storeData("school-name", data.school.name);
        redirect(`/dashboard`);
      }
    });
};
