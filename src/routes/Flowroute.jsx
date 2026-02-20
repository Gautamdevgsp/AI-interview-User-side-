import { Navigate } from "react-router-dom";

const FLOW_PATHS = {
  1: "/selectinterview",
  2: "/inter",
  3: "/interview1",
  4: "/interviewresult",
};

const FlowRoute = ({ step, children }) => {
  const flowStep = Number(localStorage.getItem("flowStep")) || 1;

  // If user tries to skip flow
  if (flowStep < step) {
    return <Navigate to={FLOW_PATHS[flowStep]} replace />;
  }

  return children;
};

export default FlowRoute;
