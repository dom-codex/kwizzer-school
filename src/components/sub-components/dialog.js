import React from "react";
import "../../css/dialog.css";
const Dialog = (props) => {
  const { action, text, title, auxAction, showCancel, list } = props;
  return (
    <div className="dialog">
      <div className="dialog-content">
        <div className="dialog-title">
          <h2>{title}</h2>
        </div>
        <div className="dialog-body">
          <p className="dialog-text">{text}</p>
          {list ? list : ""}
        </div>
        <div className="dialog-controls">
          {showCancel ? (
            <button onClick={auxAction} className="dialog-cancel">
              Cancel
            </button>
          ) : null}
          <button onClick={action}>OK</button>
        </div>
      </div>
    </div>
  );
};
export default Dialog;
