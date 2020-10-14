import React from "react";

const whitelistdialog = (props) => {
  return (
    <div>
      <div className="whitelist-dialog">
        <div className="whitelist-body">
          <div className="whitelist-h">
            <h2>Enable whitelist</h2>
            <hr />
          </div>
          <div className="whitelist-content">
            <p>
              Only Candidates whose email address will be whitelisted will be
              allowed to register and take this examination.
            </p>
            <p>
              Are you sure you want to enable whitlist for this examination?
            </p>
          </div>
          <div className="whitelist-btns">
            <button onClick={props.action}>Enable</button>
            <button onClick={props.goBack}>Go back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default whitelistdialog;
