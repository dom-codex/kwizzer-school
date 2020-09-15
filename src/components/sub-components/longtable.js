import React from "react";
const LongTable = (props) => {
  return (
    <div className="table">
      <table cellSpacing="5" cellPadding="5">
        <thead>
          <tr>
            <th scope="col">S/N</th>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          {props.details.map((candidate, i) => {
            return (
              <tr key={candidate.person.id}>
                <td>{i + 1}</td>
                <td>{candidate.person.name}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{props.details.length}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default LongTable;
