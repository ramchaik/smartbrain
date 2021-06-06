import React from "react";

const Navigation = ({ onRouteChange, ROUTES }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      <p
        className="f3 link dime black underline pa3 pointer"
        onClick={onRouteChange(ROUTES.signin)}
      >
        Sign Out
      </p>
    </nav>
  );
};

export default Navigation;
