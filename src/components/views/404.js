import React from "react";
import "../../css/404.css";
import svg from "../../assets/kwi.svg";
const Error404 = (props) => {
  return (
    <section className="error">
      <div className="err-bg">
        <div className="err-content">
          <p>ERROR</p>
          <h1>404</h1>
          <p>Page not found!!!</p>
        </div>
      </div>
      <div className="err-extra">
        <div className="err-img">
          <img src={svg} alt="app-logo" />
        </div>
        <div className="go-home">
          <a href={`${process.env.REACT_APP_HOME}/`}>GO HOME</a>
        </div>
      </div>
    </section>
  );
};

export default Error404;
