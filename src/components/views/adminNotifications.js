import React, { useEffect, useState, useContext } from "react";
import Loading from "../sub-components/Loading";
import Opensocket from "socket.io-client";
import { modeContext } from "../../context/mode";
import "../../css/notification.css";
import { fetchData } from "../../utils/storage";
const school = fetchData("school");
const Notification = (props) => {
  const { switchMode, setHeading } = useContext(modeContext);
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  //const pref = props.location.state.pid;
  const fetchNotifcations = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/admin/notifications?sch=${school}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setNotification(data.notifications);
        setLoading(false);
      });
  };
  useEffect(() => {
    setHeading("Notifications");
    switchMode(false);
    fetchNotifcations();
    const socket = Opensocket(`${process.env.REACT_APP_HEAD}?ref=${school}`);
    socket.on("notify", (data) => {
      setNotification((prev) => {
        const details = {
          message: data.message,
          topic: data.topic,
          time: data.time,
        };
        return [details, ...prev];
      });
      socket.emit("adminreceived", data.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="notification">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {notification.length ? (
            notification.map((noti) => {
              return (
                <div key={noti.id} className="notification-card">
                  <div className="n-card-title">
                    <h3>{noti.topic}:</h3>
                    <p>{noti.time}</p>
                  </div>
                  <div className="n-card-body">
                    <p className="n-card-text">
                      {noti.message}
                      &nbsp; <a href="/menu">check it out</a>
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>you dont't have any notification(s)</h1>
          )}
        </div>
      )}
    </section>
  );
};
export default Notification;
