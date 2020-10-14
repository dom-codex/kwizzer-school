import React from "react";
import Spinner from "./spinner";
const addToWhitelist = (props) => {
  return (
    <div className="w-add-dialog">
      <div className="w-add-body">
        <div className="k-logo">
          <img />
        </div>
        <div className="w-content">
          <div>
            <h2>Whitelist a Candidate</h2>
          </div>
          <div className="w-form">
            <input
              type={"url"}
              value={props.email}
              onChange={(e) => props.emailHandler(e.target.value)}
              placeholder="Enter candidate's email address"
            />
          </div>
          <div className="w-small">
            {!props.loading && <small>{props.text}</small>}
          </div>
          <div className="w-spinner">{props.loading && <Spinner />}</div>
          {!props.loading && (
            <div className="w-btn">
              <button onClick={props.add}>ADD</button>
              <button onClick={() => props.show(false)}>CANCEL</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default addToWhitelist;
