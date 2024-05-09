import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";

// core components
import Footer from "components/Footer/Footer.js";

import routes from "routes.js";

import { BackgroundColorContext } from "contexts/BackgroundColorContext";

var ps;

function Login(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanelRef.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/robogames") {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else {
        return null;
      }
    });
  };

  // Assuming '/robogames/login' is your login path. Adjust according to your app's routing.
  const shouldNotRenderFooter = location.pathname === "/robogames/login";

  return (
    <BackgroundColorContext.Consumer>
      {({ color }) => (
        <React.Fragment>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanelRef} data={color}>
              {/* Removed AdminNavbar and FixedPlugin from here */}
              <Routes>{getRoutes(routes)}</Routes>
              { !shouldNotRenderFooter && <Footer fluid /> }
            </div>
          </div>
          {/* Removed FixedPlugin from here as well, assuming you don't need it for the login view */}
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  );
}

export default Login;
