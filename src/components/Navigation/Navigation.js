import React from "react";

const Navigation = ({ isSignedIn, onRouteChange, ROUTES }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          className="f3 link dime black underline pa3 pointer"
          onClick={onRouteChange(ROUTES.signout)}
        >
          Sign Out
        </p>
      </nav>
    );
  }

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      <p
        className="f3 link dime black underline pa3 pointer"
        onClick={onRouteChange(ROUTES.signin)}
      >
        Sign In
      </p>
      <p
        className="f3 link dime black underline pa3 pointer"
        onClick={onRouteChange(ROUTES.register)}
      >
        Register
      </p>
    </nav>
  );
};

export default Navigation;
