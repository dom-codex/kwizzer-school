import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import WhitelistDialog from "../sub-components/whitelistdialog";
import AddToWhitelist from "../sub-components/addToWhitelist";
import Spinner from "../sub-components/spinner";
import Dialog from "../sub-components/dialog";
import { modeContext } from "../../context/mode";
import "../../css/whitelist.css";
const findExam = (exam, setexam, isloading) => {
  const url = `${
    process.env.REACT_APP_HEAD
  }/school/find/exam?eid=${exam}&whitelist=${true}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setexam(data.exam);
      isloading(false);
    });
};
const enableWhiteList = (exam, setexam, isloading) => {
  const url = `${process.env.REACT_APP_HEAD}/school/whitelist/exam?eid=${exam}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        setexam((prev) => {
          return {
            ...prev,
            Canwhitelist: !prev.Canwhitelist,
          };
        });
        isloading(false);
      }
    });
};
const addToWhitelist = (exam, email, Setwhitelist, isloading, setErrText) => {
  isloading(true);
  const url = `${process.env.REACT_APP_HEAD}/school/whitelist/add?eid=${exam}`;
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ email: email }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 201) {
        setErrText("Done!!!");
        Setwhitelist((prev) => [
          { candidateName: res.name, candidateEmail: res.email },
          ...prev,
        ]);
        const time = setTimeout(() => {
          setErrText("");
          clearTimeout(time);
        }, 2000);
      } else if (res.code === 404) {
        setErrText("Candidate does not exist");
        const time = setTimeout(() => {
          setErrText("");
          clearTimeout(time);
        }, 2000);
      } else {
        setErrText("Candidate already whitelisted");
        const time = setTimeout(() => {
          setErrText("");
          clearTimeout(time);
        }, 2000);
      }

      isloading(false);
    });
};
const removeFromWhitelist = (
  exam,
  email,
  Setwhitelist,
  isloading,
  setErrText
) => {
  isloading(true);
  const url = `${process.env.REACT_APP_HEAD}/school/whitelist/remove?eid=${exam}`;
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ email: email }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 201) {
        setErrText("Candidate removed");
        const time = setTimeout(() => {
          setErrText("");
          clearTimeout(time);
        }, 2000);
        Setwhitelist((prev) => {
          const newList = prev.filter(
            (candidate) => candidate.candidateEmail !== email
          );
          return newList;
        });
      }
      isloading(false);
    });
};
const getWhiteList = (exam, setWhitelist, setExam, isloading) => {
  const url = `${process.env.REACT_APP_HEAD}/school/get/whitelist?eid=${exam}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      setWhitelist(res.list);
      findExam(exam, setExam, isloading);
    });
};
const removeAllFromWhitelist = (exam, setWhitelist, setExam, isloading) => {
  isloading(true);
  const url = `${process.env.REACT_APP_HEAD}/school/whitelist/remove/all?eid=${exam}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      isloading(false);
      setExam((prev) => {
        return {
          ...prev,
          canWhitelist: false,
        };
      });
      setWhitelist([]);
      setExam((prev) => {
        return {
          ...prev,
          canWhitelist: false,
        };
      });
    });
};
const Whitelist = (props) => {
  const [exams, setExam] = useState({});
  const [loading, isloading] = useState(true);
  const [whitelist, setwhiteList] = useState([]);
  const [dialog, showDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [adding, isadding] = useState(false);
  const [errText, setErrText] = useState("");
  const [customDialog, setCustomDialog] = useState(false);
  const {
    location: { pathname },
  } = props;
  //extract exam id
  const exam = pathname.split("whitelist/")[1];
  const { setHeading } = useContext(modeContext);
  useEffect(() => {
    setHeading("Whitelist");
    getWhiteList(exam, setwhiteList, setExam, isloading);
  }, []);
  return (
    <section>
      {loading ? (
        <div className="w-main-s">
          <Spinner />
        </div>
      ) : exams.Canwhitelist ? (
        <div className="whitelisted">
          {customDialog && (
            <Dialog
              title={"Are you sure?"}
              text="you want to disable white listing for this exam? Doing this will erase all whiltelisted candidates."
              showCancel={true}
              auxAction={() => setCustomDialog(false)}
              action={() => {
                enableWhiteList(exam, setExam, isloading);
                removeAllFromWhitelist(exam, setwhiteList, setExam, isloading);
              }}
            />
          )}
          {dialog && (
            <AddToWhitelist
              emailHandler={setEmail}
              email={email}
              loading={adding}
              show={(n) => {
                setEmail("");
                showDialog(n);
              }}
              add={() =>
                addToWhitelist(exam, email, setwhiteList, isadding, setErrText)
              }
              text={errText}
            />
          )}
          <div className="whitelisted-h">
            <div>
              {" "}
              <h2>WhitelistedCandidates</h2>
            </div>
            <div>
              <button onClick={() => showDialog(true)}>
                <i className="material-icons">add</i>
              </button>
              <button onClick={() => setCustomDialog(true)}>
                <i className="material-icons">settings_power</i>
              </button>
            </div>
          </div>
          <hr />
          <div className="whitelisted-body">
            <ul>
              {whitelist.map((list) => {
                return (
                  <li key={list.candidateEmail}>
                    <p>{list.candidateName}</p>
                    <p>{list.candidateEmail}</p>
                    <div className="whitelisted-btn">
                      <button
                        onClick={() =>
                          removeFromWhitelist(
                            exam,
                            list.candidateEmail,
                            setwhiteList,
                            isloading,
                            setErrText
                          )
                        }
                      >
                        <i className="material-icons">highlight_off</i>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <WhitelistDialog
          exam={exams.name}
          action={() => enableWhiteList(exam, setExam, isloading)}
          goBack={props.history.goBack}
        />
      )}
    </section>
  );
};

export default withRouter(Whitelist);
