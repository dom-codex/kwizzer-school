import React, { useReducer } from "react";
import Toast from "../../sub-components/toast";
import {
  textHandler,
  inputReducer,
  login,
} from "../../../utils/logincontrollers";
const error = {
  backgroundColor: "red",
  color: "#fff",
};
const AdminLoginForm = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    email: "",
    password: "",
    showToast: false,
    message: "invalid login details",
  });
  const url = `${process.env.REACT_APP_HEAD}/school/login`;
  return (
    <div className="login-content">
      <Toast
        isOpen={inputState.showToast}
        action={() => dispatch({ type: "toast" })}
        text={inputState.message}
        styles={error}
        animate={"showToast"}
        main={"toast"}
        top={{ bottom: "25px" }}
      />
      <div className="login-input">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={inputState.email}
          onChange={(e) => textHandler(e, "email", dispatch)}
          placeholder="email"
        />
      </div>
      <div className="login-input">
        <label htmlFor="password">password</label>
        <input
          id="password"
          type="password"
          value={inputState.password}
          onChange={(e) => textHandler(e, "password", dispatch)}
          minLength="5"
          placeholder="password"
        />
      </div>
      <div className="btn-cont">
        <button
          class="submit-btn"
          onClick={() =>
            login(url, inputState, props.redirect, dispatch, props.showLoader)
          }
        >
          login
        </button>
      </div>
    </div>
  );
};
export default AdminLoginForm;
