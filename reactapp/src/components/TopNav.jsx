import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./TopNav.css";

function TopNav(props) {
  const [activeTab, setActiveTab] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  function onClickTabItem(tab) {
    if (location.pathname.startsWith("/expenses")) {
      setActiveTab("expenses");
    } else if (location.pathname.startsWith("/categories")) {
      setActiveTab("categories");
    } else {
      console.log("invalid tab selection");
    }
  }

  return (
    <nav className="topnav">
      <a className="index">Categories</a>
      <a className="index active">Expenses</a>
      <div className="topnav-right">
        <button className="logoutBtn">Logout</button>
      </div>
    </nav>
  );
}

export default TopNav;
