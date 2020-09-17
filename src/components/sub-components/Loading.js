import React from "react";
import Spinner from "./spinner";

const Loading = (props) => {
  return (
    <div
      className="loadingScreen"
      style={{
        minWidth: "calc(100vw - 93px)",
        minHeight: "calc(90vh)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="loading"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Spinner />
        &nbsp; Loading...
      </div>
    </div>
  );
};

export default Loading;
