import React, { useState } from "react";
import "../../css/signUp.css";
import AdminSignup from "./component/adminsignupform";
import Preloader from "../sub-components/indeterminate_indicator";
const SignUp = (props) => {
  const [loader, showLoader] = useState(false);
  const redirect = (addr) => {
    props.history.replace(addr);
  };
  const adminSignUp = props.admin;
  return (
    <section className="signup">
      <div className="alternative">
        <span>Already have an account?</span>
        <a href="/school/login">Login</a>
      </div>
      <div className="signup-body">
        {loader ? <Preloader /> : ""}
        <div className="signup-header">
          <h1>Kwizzer</h1>
          <p>Promoting educational transparency</p>
          <p className="title">{"Examiner signUp"}</p>
        </div>
        <div className="signup-content">
          {
            <AdminSignup
              showLoader={showLoader}
              routes={props}
              redirect={redirect}
            />
          }
        </div>
      </div>
    </section>
  );
};
export default SignUp;
