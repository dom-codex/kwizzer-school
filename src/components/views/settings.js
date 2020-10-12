import React, { useContext, useState, useEffect } from "react";
import Loading from "../sub-components/Loading";
import { withRouter } from "react-router-dom";
import Dialog from "../sub-components/dialog";
import Loader from "../sub-components/indeterminate_indicator";
import { modeContext } from "../../context/mode";
import { clearData, fetchData } from "../../utils/storage";
import "../../css/settings.css";
const clearDecoration = () => {
  document.querySelector("input.old").classList.remove("errclass");
  document.querySelector(".old-err").textContent = "";
  document.querySelector("input.new").classList.remove("errclass");
  document.querySelector(".new-err").textContent = "";
};
const revealPwdForm = (e) => {
  e.target.style.display = "none";
  document.querySelector(".pwdform").classList.add("showform");
};
const closePwdForm = () => {
  document.querySelector(".pwdform").classList.remove("showform");
  const timer = setTimeout(() => {
    document.querySelector(".change-pass button").style.display = "block";
    clearDecoration();
    clearTimeout(timer);
  }, 505);
};
const fetchDetails = (ref, setSchool, setLoading, setName, setPhone) => {
  const url = `${process.env.REACT_APP_HEAD}/school/find?sch=${ref}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 201) {
        setSchool(data.sch);
        setName(data.sch.name);
        setPhone(data.sch.phone);
      }
      setLoading(false);
    });
};
const changePwd = (ref, body, setNew, setOld) => {
  clearDecoration();
  const url = `${process.env.REACT_APP_HEAD}/school/reset/password?sch=${ref}`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 403) {
        if (data.err.oldError) {
          document.querySelector("input.old").classList.add("errclass");
          document.querySelector(".old-err").textContent =
            data.err.oldError.msg;
        }
        if (data.err.newError) {
          document.querySelector("input.new").classList.add("errclass");
          document.querySelector(".new-err").textContent =
            data.err.newError.msg;
        }
        return;
      }
      setOld("");
      setNew("");
      closePwdForm();
    });
};
const editName = (setEditMode) => {
  setEditMode((state) => {
    return { editing: !state.editing, form: "name" };
  });
};
const saveName = (sid, schoolName) => {
  const url = `${process.env.REACT_APP_HEAD}/school/edit/name?sch=${sid}`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: schoolName }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 401) {
        return;
      } else {
        window.location.reload();
      }
    });
};
const savePhone = (sid, phone) => {
  const url = `${process.env.REACT_APP_HEAD}/school/edit/phone?sch=${sid}`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: phone }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 401) {
        return;
      } else {
        window.location.reload();
      }
    });
};
const editPhone = (setEditMode) => {
  setEditMode((state) => {
    return { editing: !state.editing, form: "phone" };
  });
};
const deleteAcount = (school, location) => {
  const url = `${process.env.REACT_APP_HEAD}/school/delete?sch=${school}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 201) {
        clearData("school");
        clearData("school-name");
        location.replace("/signup");
      }
    });
};
const Settings = (props) => {
  const school = fetchData("school");
  const { setHeading } = useContext(modeContext);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [user, setUser] = useState({});
  const [oldPwd, setOld] = useState("");
  const [newPwd, setNew] = useState("");
  const [edit, setEditMode] = useState({ editing: false, form: "name" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    setHeading("Settings");
    fetchDetails(school, setUser, setLoading, setName, setPhone);
  }, []);
  return (
    <section className="settings-page">
      {dialog && (
        <Dialog
          title="Confirmation"
          text="Are you sure you want to delete your account?"
          showCancel={true}
          action={() => deleteAcount(school, props.history)}
          auxAction={() => setDialog(false)}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="setting-body">
          <div className="schoolalInfo">
            <div className="setting-heading">
              <h1>schoolal info</h1>
            </div>
            <div className="school-name">
              <div>
                <span className="tag">Name: </span>&nbsp;
                {(!edit.editing || edit.form !== "name") && (
                  <span>{user.name}</span>
                )}
                {edit.editing && edit.form === "name" && (
                  <input
                    type="text"
                    className="name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </div>
              <div className="settings-ctrls">
                {(!edit.editing || !edit.form === "phone") && (
                  <button onClick={() => editName(setEditMode)}>edit</button>
                )}
                {edit.editing && edit.form === "name" && (
                  <div>
                    <button onClick={() => editName(setEditMode)}>close</button>
                    <button onClick={() => saveName(school, name)}>done</button>
                  </div>
                )}
              </div>
            </div>
            <div className="school-email">
              <div>
                <span className="tag">Email: </span>&nbsp;
                <span>{user.email}</span>
              </div>
            </div>
            <div className="school-phone">
              <div>
                <span className="tag">Phone: </span>&nbsp;
                {(!edit.editing || edit.form !== "phone") && (
                  <span>
                    {user.phone && user.phone.length > 0 ? user.phone : "N/A"}
                  </span>
                )}
                {edit.editing && edit.form === "phone" && (
                  <input
                    type="number"
                    step="1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                )}
              </div>
              <div className="settings-ctrls">
                {(!edit.editing || !edit.form === "name") && (
                  <button onClick={() => editPhone(setEditMode)}>edit</button>
                )}
                {edit.editing && edit.form === "phone" && (
                  <div>
                    <button onClick={() => editPhone(setEditMode)}>
                      close
                    </button>
                    <button onClick={() => savePhone(school, phone)}>
                      done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="security">
            <div className="setting-heading">
              <h1>Security</h1>
            </div>
            <div>
              <div className="change-pass">
                <button onClick={revealPwdForm}>Change password</button>
              </div>
              <div className="pwd-form">
                <div class="pwdform">
                  <div className="old-pwd">
                    <span>
                      <label>Old password</label>
                    </span>
                    <div>
                      <input
                        value={oldPwd}
                        className="old"
                        type="password"
                        onChange={(e) => setOld(e.target.value)}
                      />
                      <div>
                        <small className="old-err"></small>
                      </div>
                    </div>
                  </div>
                  <div className="new-pwd">
                    <span>
                      <label>New password</label>
                    </span>
                    <div>
                      <input
                        type="password"
                        class="new"
                        value={newPwd}
                        onChange={(e) => setNew(e.target.value)}
                      />
                    </div>
                    <div>
                      <small className="new-err"></small>
                    </div>
                  </div>
                  <div className="pass-btn">
                    <button
                      onClick={() =>
                        changePwd(
                          school,
                          { oldPwd: oldPwd, newPwd: newPwd },
                          setNew,
                          setOld
                        )
                      }
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        closePwdForm();
                        setOld("");
                        setNew();
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="delete">
            <div className="horiz-ruler"></div>
            <div className="delete-btn">
              <button onClick={() => setDialog(true)}>Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default withRouter(Settings);
