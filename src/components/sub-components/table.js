import React from "react";
const Table = (props) => {
  const { config } = props;

  return (
    <table cellSpacing="0" border="1">
      <tr>
        <th scope="col">{config ? config.head.first : "S/N"}</th>
        <th scope="col">{config ? config.head.second : "Candidate"}</th>
        <th scope="col">Score</th>
      </tr>
      <tr>
        <td>1</td>
        <td>dominic</td>
        <td>50</td>
      </tr>
    </table>
  );
};
export default Table;
