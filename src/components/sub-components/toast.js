import React from "react";
import "../../css/toast.css";
const Toast = (props) => {
  if (props.isOpen) {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      props.action(false);
    }, 2800);
  }
  return (
    <div
      style={props.top}
      className={
        props.isOpen
          ? `${props.main} ${props.isOpen && props.animate}`
          : props.main
      }
    >
      <div className="toast-content" style={props.styles}>
        <p className="toast-text">{props.text}</p>
      </div>
    </div>
  );
};

export default Toast;
