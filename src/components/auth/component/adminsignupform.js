import React, { useReducer } from "react";
import * as SignupControllers from "../../../utils/signupcontroller";
import { canSubmit } from "../../../validators/signUp";
import { clearData } from "../../../utils/storage";
const AdminSignup = (props) => {
  const [inputState, dispatch] = useReducer(SignupControllers.inputReducer, {
    name: "",
    notName: false,
    email: "",
    notEmail: false,
    phone: "",
    password: "",
    notPassword: false,
    comfirm: "",
    isconfirm: false,
    cansubmit: false,
  });
  const url = `${process.env.REACT_APP_HEAD}/school/create`;
  //const ref = search.split("user=")[1];
  const cansubmit = canSubmit(inputState);

  return (
    <div>
      <div className="signUp-input">
        <label htmlFor="name">Display Name</label>
        <input
          id="name"
          className={`${inputState.notName ? "inputerr" : ""}`}
          type="text"
          onChange={(e) => dispatch({ type: "name", value: e.target.value })}
          value={inputState.name}
          maxLength="30"
          placeholder="E.g Crystal academy"
        />
        {inputState.notName ? (
          <small className="input-error-indicator">
            {inputState.nameErrMsg}
          </small>
        ) : null}
      </div>
      <div className="signUp-input">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className={`${inputState.notEmail ? "inputerr" : ""}`}
          type="email"
          onChange={(e) => dispatch({ type: "email", value: e.target.value })}
          value={inputState.email}
          placeholder="email"
        />
        {inputState.notEmail ? (
          <small className="input-error-indicator">
            {inputState.emailErrMsg}
          </small>
        ) : null}
      </div>
      <div className="signUp-input">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="phone"
          onChange={(e) => SignupControllers.textHandler(e, "phone", dispatch)}
          value={inputState.phone}
          maxLength="20"
          placeholder="phone"
        />
      </div>
      <div className="signUp-input">
        <label htmlFor="password">password</label>
        <input
          id="password"
          className={`${inputState.notPassword ? "inputerr" : ""}`}
          type="password"
          onChange={(e) =>
            dispatch({ type: "password", value: e.target.value })
          }
          value={inputState.password}
          minLength="5"
          placeholder="password"
        />
        {inputState.notPassword ? (
          <small className="input-error-indicator">
            {inputState.passErrMsg}
          </small>
        ) : null}
      </div>
      <div className="signUp-input">
        <label htmlFor="comfirm-password">comfirm password</label>
        <input
          id="comfirm-password"
          type="password"
          onChange={(e) =>
            dispatch({ type: "cpassword", value: e.target.value })
          }
          value={inputState.comfirm}
          minLength="20"
          placeholder="comfirm password"
        />
        {inputState.isconfirm ? (
          <small className="input-error-indicator">{inputState.cErrMsg}</small>
        ) : null}
      </div>
      <div className="btn-cont">
        {cansubmit ? (
          <button
            onClick={() => {
              clearData("school");
              clearData("school-name");
              SignupControllers.submitValue(
                url,
                inputState,
                props.redirect,
                dispatch,
                props.showLoader
              );
            }}
            class="submit-btn"
          >
            submit
          </button>
        ) : (
          <button disabled={true} className="disable">
            submit
          </button>
        )}
      </div>
    </div>
  );
};
export default AdminSignup;
