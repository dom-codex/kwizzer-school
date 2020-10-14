import React, { useEffect, useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import { modeContext } from "../../context/mode";
import Tile from "../sub-components/tiles";
import Toast from "../sub-components/toast";
import Dialog from "../sub-components/dialog";
import Loader from "../sub-components/indeterminate_indicator";
import Loading from "../sub-components/Loading";
import Styles from "../../css/tile.module.css";
import styles from "../../css/examrecords.css";
import { fetchData } from "../../utils/storage";
const school = fetchData("school");
const ExamRecords = (props) => {
  const { switchMode, setHeading } = useContext(modeContext);
  const [exams, setExams] = useState([]);
  const [showToast, setToast] = useState(false);
  const [showDialog, setDialog] = useState(false);
  const [loader, showLoader] = useState(false);
  const [examId, setExamId] = useState("");
  const [toastText, setToastText] = useState("");
  const [dialogTxt, setDialogTxt] = useState("you want to delete this exam");
  const [dialogTitle, setDialogTitle] = useState("Are your sure?");
  const [loading, setLoading] = useState(true);
  const hideMore = () => {
    const more = document.querySelectorAll(".records-more");
    for (let i = 0; i < more.length; i++) {
      more[i].classList.remove("showMore");
    }
  };
  const showMore = (e) => {
    hideMore();
    e.target.parentNode.parentNode.children[1].classList.add("showMore");
  };
  const hide = (e) => {
    if (!e.target.matches(".material-icons")) {
      hideMore();
    }
  };
  const fetchExams = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/get/records?sch=${school}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setExams(data.exams);
        setLoading(false);
      });
  };
  const LinkTo = (eid) => {
    props.history.push("/dashboard/edit/exam", { exam: eid });
  };
  const setRegStatus = (ref) => {
    showLoader(true);
    const url = `${process.env.REACT_APP_HEAD}/school/exam/set/regstatus?exam=${ref}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        showLoader(false);
        setToastText(res.message);
        exams.forEach((exam) => {
          if (exam.ref === ref) {
            if (exam.canReg) {
              exam.canReg = false;
            } else {
              exam.canReg = true;
            }
          }
        });
        setToast(true);
      });
  };
  const authorize = (ref) => {
    showLoader(true);
    const url = `${process.env.REACT_APP_HEAD}/school/exam/canstart?exam=${ref}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        showLoader(false);
        setToastText(res.message);
        exams.forEach((exam) => {
          if (exam.ref === ref) {
            if (exam.canStart) {
              exam.canStart = false;
            } else {
              exam.canStart = true;
            }
          }
        });
        setToast(true);
      });
  };
  const deleteExam = () => {
    showLoader(true);
    const url = `${process.env.REACT_APP_HEAD}/school/exam/delete?sch=${school}&exam=${examId}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((res) => {
        showLoader(false);
        setDialog(false);
        if (res.code === 200) {
          setToastText(res.message);
          setToast(true);
          setExams((oldExams) => {
            const newExams = oldExams.filter((exam) => exam.ref !== examId);
            return newExams;
          });
        } else {
          setDialogTitle("Opps!!!");
          setDialogTxt(res.message);
          setDialog(true);
        }
      });
  };

  const CopyLink = (e) => {
    const link = e.target.parentNode.children[1];
    link.focus();
    link.select();
    link.setSelectionRange(0, 99999);
    /* Copy the text inside the text field */
    document.execCommand("copy");
  };
  useEffect(() => {
    window.addEventListener("click", (e) => hide(e));
    setHeading("Records");
    switchMode(false);
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="exam-records">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {loader ? (
            <Loader
              style={{ backgroundColor: "rgba(255,255,255,.7)", zIndex: 2 }}
            />
          ) : (
            ""
          )}
          {showDialog && (
            <Dialog
              title={dialogTitle}
              text={dialogTxt}
              showCancel={dialogTitle === "Opps!!!" ? false : true}
              auxAction={() => setDialog(false)}
              action={
                dialogTitle === "Opps!!!"
                  ? () => {
                      setDialogTitle("Are you sure?");
                      setDialogTxt("you want to delete this exam?");
                      setDialog(false);
                    }
                  : deleteExam
              }
            />
          )}
          <Toast
            isOpen={showToast}
            action={setToast}
            text={toastText}
            styles={{}}
            animate={"showToast"}
            main={"toast"}
            top={{ bottom: "28px" }}
          />
          <hr />
          <div>
            <ul className="exams-list-ul">
              {exams.length ? (
                exams.map((exam) => {
                  return (
                    <Tile
                      key={exam.ref}
                      title={exam.name}
                      styles={styles}
                      Styles={Styles}
                      action={{}}
                    >
                      <div className="control-btns">
                        <div className="more-btn" onClick={showMore}>
                          <i className="material-icons">more_horiz</i>
                        </div>
                        <div className="records-more">
                          <button onClick={() => LinkTo(exam.ref)}>edit</button>
                          <button onClick={() => authorize(exam.ref)}>
                            {exam.canStart ? "revoke" : "authorize"}
                          </button>
                          <button onClick={() => setRegStatus(exam.ref)}>
                            {exam.canReg ? "deactivate" : "activate"}
                          </button>
                          <button
                            onClick={() =>
                              props.history.push(
                                `/dashboard/whitelist/${exam.ref}`
                              )
                            }
                          >
                            whitelist
                          </button>
                          <div className="reg-link">
                            <button onClick={(e) => CopyLink(e)}>
                              copy link
                            </button>

                            <input
                              onChange={() => {}}
                              className="link"
                              value={`${window.location.origin}/exam/register/${school}/${exam.ref}`}
                            />
                          </div>
                          <button
                            onClick={() => {
                              setExamId(exam.ref);
                              setDialog(true);
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                      <div className="exam-info">
                        <div>
                          time
                          <i className="material-icons">access_time</i>
                          <div>
                            {exam.hours > 0 ? `${exam.hours}h  ` : ""}
                            {exam.minutes > 0 ? ` ${exam.minutes}m` : ""}
                            {exam.seconds > 0 ? ` ${exam.seconds}` : ""}
                          </div>
                        </div>
                        <div>
                          Quiz
                          <i className="material-icons">list</i>
                          <div>{exam.nQuiz}</div>
                        </div>
                        <div>
                          marks
                          <i className="material-icons">assignment_turned_in</i>
                          <div>{exam.TotalMarks}</div>
                        </div>
                      </div>
                    </Tile>
                  );
                })
              ) : (
                <h1>you haven't created any exam</h1>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default withRouter(ExamRecords);
