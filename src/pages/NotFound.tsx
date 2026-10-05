import { Navigate } from "react-router-dom";

const NotFound = () => {
  return <Navigate to="/topics" replace />;
};

export default NotFound;

