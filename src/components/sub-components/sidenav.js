import React from "react";
import "../../css/sidemenu.css";
import Icon from "../../icon.svg";
const SideMenu = (props) => {
  return (
    <div className="side-nav-cont">
      <div className="side-nav">
        <div class="accountTile">
          <div className="app-name">
            <h1>Learned</h1>
          </div>
          <div className="accountTile">
            <div className="img-cont">
              <img src={Icon} alt="user" />
            </div>
            <div class="account-name">
              <p>Dominic ibolo</p>
            </div>
          </div>
        </div>
        <div className="side-content">
          <div className="side-content-1">
            <button>Notifications</button>
          </div>
          <div className="side-content-1">
            <button>Standard Quiz</button>
          </div>
          <div>
            <p>More</p>
          </div>
          <hr />
          <div className="side-content-1">
            <button>Create school</button>
          </div>
          <div className="side-content-1">
            <button>Go to class</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SideMenu;
