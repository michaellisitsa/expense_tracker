import { NavLink } from "react-router-dom";
import "./TopNav.css";

function TopNav(props) {
  const tabs = [
    { label: "Categories", id: "categories" },
    { label: "Expenses", id: "expenses" },
  ];

  return (
    <nav className="topnav">
      {tabs.map((tab) => (
        <NavLink
          className={(navData) =>
            navData.isActive ? "nav-link active" : "nav-link"
          }
          key={tab.id}
          to={`/${tab.id}`}
        >
          {tab.label}
        </NavLink>
      ))}
      <div className="topnav-right">
        <button className="logoutBtn">Logout</button>
      </div>
    </nav>
  );
}

export default TopNav;
