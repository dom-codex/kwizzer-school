import React, { useState } from "react";
import AdminLoginForm from "./component/adminloginform";
import Preloader from "../sub-components/indeterminate_indicator";
import "../../css/login.css";
function Login(props) {
  const [loader, showLoader] = useState(false);
  const redirect = (addr) => {
    props.history.replace(addr);
  };
  return (
    <section className="login">
      <div className="alternative">
        <span>Don't have an account yet?</span>
        <a href="/school/create">Sign Up</a>
      </div>
      <div className="login-body">
        {loader ? <Preloader /> : ""}
        <div className="login-header">
          <h1>Kwizzer</h1>
          <p>Promoting educational transparency</p>
          <p className="title">{"Examiner Login"}</p>
        </div>
        {<AdminLoginForm showLoader={showLoader} redirect={redirect} />}
      </div>
    </section>
  );
}
export default Login;
