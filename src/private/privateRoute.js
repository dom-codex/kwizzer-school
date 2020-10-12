import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import svg from "../assets/kwi.svg";
import "../private/privateroute.css";
import { fetchData } from "../utils/storage";
const validatePerson = (sid, isAuthenticated, isLoading) => {
  const url = `${process.env.REACT_APP_HEAD}/validate/school?ref=${sid}`;
  fetch(url)
    .then((res) => res.json())
    .then((result) => {
      if (result.isAuthenticated) {
        isAuthenticated(true);
        isLoading(false);
      } else {
        isAuthenticated(false);
        isLoading(false);
      }
    });
};
export default (props) => {
  const school = fetchData("school");
  const [authenticated, isAuthenticated] = useState(false);
  const [loading, isLoading] = useState(true);
  const ComponentToRender = props.component;
  useEffect(() => {
    validatePerson(school, isAuthenticated, isLoading);
  }, []);
  const componentToShow = authenticated ? (
    <ComponentToRender />
  ) : loading ? (
    <section className="auth-load">
      <img src={svg} alt="app-logo" />
    </section>
  ) : (
    <Redirect to={{ pathname: "/school/login" }} />
  );
  return componentToShow;
};
