import React from "react";

const Tiles = (props) => {
  const {
    action: { showToast, openResult, NumberOfSubmitted, noOfStudents },
  } = props;
  return (
    <li
      className={props.Styles.tileli || props.li}
      onClick={
        NumberOfSubmitted || noOfStudents || true ? openResult : showToast
      }
      style={props.color ? { backgroundColor: props.color } : {}}
    >
      <div className={props.Styles.tilename}>
        <h2>{props.title}</h2>
      </div>
      <div className={props.Styles.tilecontrols}>{props.children}</div>
    </li>
  );
};

export default Tiles;
