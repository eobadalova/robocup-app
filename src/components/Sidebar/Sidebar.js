/**
* The Sidebar component is a React component that renders the sidebar navigation for the application.
* It uses the `PerfectScrollbar` library to provide a smooth scrolling experience on Windows platforms.
* The sidebar displays a logo and a list of navigation links, which are conditionally rendered based on the user's roles and login status.
* The component also handles the active state of the navigation links based on the current URL.
*
* @param {object} props - The component props.
* @param {boolean} props.rtlActive - A boolean indicating whether the sidebar should be rendered in right-to-left mode.
* @param {array} props.routes - An array of route objects, each with properties like `path`, `name`, `icon`, and `layout`.
* @param {object} props.logo - An object with properties `innerLink`, `outterLink`, `text`, and `imgSrc` to configure the sidebar logo.
* @returns {JSX.Element} - The rendered Sidebar component.
*/
import React, { useRef, useEffect, useContext } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";
import PerfectScrollbar from "perfect-scrollbar";
import { Nav } from "reactstrap";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";
import { useUser } from "contexts/UserContext"; // Make sure the import path for useUser is correct

// Sidebar component
function Sidebar(props) {
  const location = useLocation(); // Get the current location from react-router-dom
  const sidebarRef = useRef(null); // Create a ref to the sidebar element
  const { user } = useUser(); // Assuming useUser is the correct hook to access user context
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // State to track if the user is logged in

  // Effect to initialize PerfectScrollbar and check if the user is logged in
  useEffect(() => {
    let ps;
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    setIsLoggedIn(!!localStorage.getItem('token')); // Check if a token exists in localStorage to determine if the user is logged in
    return () => {
      if (ps && navigator.platform.indexOf("Win") > -1) {
        ps.destroy(); // Destroy PerfectScrollbar instance on component unmount
      }
    };
  }, [user]); // Add user as a dependency to re-run this effect when user changes

  const linkOnClick = () => {
    document.documentElement.classList.remove("nav-open"); // Remove the "nav-open" class from the document element when a link is clicked
  };

  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : ""; // Check if the current location matches the routeName and return "active" class if true
  };

  const { routes, rtlActive, logo } = props; // Destructure props
  let logoImg = null;
  let logoText = null;

  // Render the logo based on the provided logo prop
  if (logo !== undefined) {
    if (logo.outterLink !== undefined) {
      logoImg = (
        <a href={logo.outterLink} className="simple-text logo-mini" target="_blank" onClick={props.toggleSidebar}>
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </a>
      );
      logoText = (
        <a href={logo.outterLink} className="simple-text logo-normal" target="_blank" onClick={props.toggleSidebar}>
          {logo.text}
        </a>
      );
    } else {
      logoImg = (
        <Link to={logo.innerLink} className="simple-text logo-mini" onClick={props.toggleSidebar}>
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </Link>
      );
      logoText = (
        <Link to={logo.innerLink} className="simple-text logo-normal" onClick={props.toggleSidebar}>
          {logo.text}
        </Link>
      );
    }
  }

  const rolesString = localStorage.getItem('roles'); // Get the roles string from localStorage
  const rolesArray = rolesString ? rolesString.split(', ') : []; // Split the roles string into an array or use an empty array if no roles exist
  const isAdminOrLeaderOrAssistant = rolesArray.some(role => ['ADMIN', 'LEADER', 'ASSISTANT'].includes(role)); // Check if the user has any of the specified roles

  const isAdminOrLeaderOrAssistantOrReferee = rolesArray.some(role => ['ADMIN', 'LEADER', 'ASSISTANT', 'REFEREE'].includes(role)); // Check if the user has any of the specified roles

  console.log("is referee:" + isAdminOrLeaderOrAssistantOrReferee) // Log the value of isAdminOrLeaderOrAssistantOrReferee to the console


  // Render the sidebar
  return (
    <BackgroundColorContext.Consumer>
      {({ color }) => (
        <div className="sidebar" data={color}>
          <div className="sidebar-wrapper" ref={sidebarRef}>
            {logoImg !== null || logoText !== null ? <div className="logo">{logoImg}{logoText}</div> : null} {/* Render the logo if it exists */}
            <Nav>
              {routes.map((prop, key) => {
                if (prop.redirect || (prop.path === "/login" && isLoggedIn)) return null; // Hide login when logged in
                if (prop.path === "/register") return null; // Always hide register
                if (prop.path === "/user-management") return null; // Always hide user management
                if (prop.path === "/competition-management") return null; // Always hide competition management
                if (prop.path === "/competition-detail") return null; // Always hide competition detail
                if (prop.path === "/competition-registration") return null; // Always hide competition registration
                if (prop.path === "/robot-registration") return null; // Always hide robot registration
                if (prop.path === "/all-teams") return null; // Always hide all teams
                if (prop.path === "/playground-management") return null; // Always hide playground management
                if (prop.path === "/robot-confirmation") return null; // Always hide robot confirmation
                if (prop.path === "/playground-detail") return null; // Always hide playground detail
                if (prop.path === "/match-generation") return null; // Always hide match generation
                if (prop.path === "/match-management" && !isAdminOrLeaderOrAssistantOrReferee) return null; // Hide match management if the user doesn't have the required roles
                if (prop.path === "/admin-dashboard" && !isAdminOrLeaderOrAssistant) return null; // Hide admin dashboard if the user doesn't have the required roles
                if (prop.path === "/user-profile" && !isLoggedIn) return null; // Show user profile only when logged in
                if (prop.path === "/my-team" && !isLoggedIn) return null; // Show my team only when logged in
                return (
                  <li className={activeRoute(prop.layout + prop.path) + (prop.pro ? " active-pro" : "")} key={key}>
                    <NavLink to={prop.layout + prop.path} className="nav-link" onClick={linkOnClick}>
                      <i className={prop.icon} />
                      <p>{rtlActive ? prop.rtlName : prop.name}</p>
                    </NavLink>
                  </li>
                );
              })}
            </Nav>
          </div>
        </div>
      )}
    </BackgroundColorContext.Consumer>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    text: PropTypes.node,
    imgSrc: PropTypes.string,
  }),
};

export default Sidebar;
