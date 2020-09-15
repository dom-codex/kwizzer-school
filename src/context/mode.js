import React, { useState, createContext } from "react";
export const modeContext = createContext();
const Mode = (props) => {
  const [mode, setMode] = useState({ isUser: true });
  const [heading, setHeader] = useState("");
  const switchMode = (choice) => {
    setMode({ isUser: choice });
  };
  const setHeading = (text) => {
    setHeader(text);
  };
  return (
    <modeContext.Provider value={{ mode, switchMode, heading, setHeading }}>
      {props.children}
    </modeContext.Provider>
  );
};

export default Mode;
