import { observer } from "mobx-react-lite";
import "./CardLayout.css";

function CardLayout({ children }) {
  return <section className="card-container">{children}</section>;
}

export default observer(CardLayout);
