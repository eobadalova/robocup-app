/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";

import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";

import UserProfile from "views/UserProfile.js";
import Login from "views/Login.js";
import Register from "views/Register.js";
import UserManagement from "views/UserManagement";
import AdminDashboard from "views/AdminDashboard";
import CompetitionManagement from "views/CompetitionManagement";
import CompetitionDetail from "views/CompetitionDetail";
import AllTeams from "views/AllTeams";
import MyTeam from "views/MyTeam";
import CompetitionRegistration from "views/CompetitionRegistration";
import RobotRegistration from "views/RobotRegistration";
import PlaygroundManagement from "views/PlaygroundManagement";
import RobotConfirmation from "views/RobotConfirmation";
import MatchGeneration from "views/MatchGeneration";
import MatchManagement from "views/MatchManagement";
import PlaygroundDetail from "views/PlaygroundDetail";
import CompetitionResults from "views/CompetitonResults";
import Contact from "views/Contact";
import Rules from "views/Rules";


var routes = [
  {
    path: "/match-management",
    name: "Vyhodnocování zápasů",
    rtlName: "",
    icon: "tim-icons icon-puzzle-10",
    component: <MatchManagement />,
    layout: "/admin", 
  },
  {
    path: "/admin-dashboard",
    name: "Admin menu",
    rtlName: "",
    icon: "tim-icons icon-settings-gear-63",
    component: <AdminDashboard />,
    layout: "/admin", 
  },
  {
    path: "/user-profile",
    name: "Můj profil",
    rtlName: "",
    icon: "tim-icons icon-single-02",
    component: <UserProfile />,
    layout: "/admin",
  },
  {
    path: "/my-team",
    name: "Můj tým",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <MyTeam />,
    layout: "/admin", 
  },

  {
    path: "/dashboard",
    name: "Domů",
    rtlName: "",
    icon: "tim-icons icon-app",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/disciplines",
    name: "Disciplíny",
    rtlName: "",
    icon: "tim-icons icon-components",
    component: <TableList />,
    layout: "/admin",
  },

  {
    path: "/competition-results",
    name: "Výsledky",
    rtlName: "",
    icon: "tim-icons icon-book-bookmark",
    component: <CompetitionResults />,
    layout: "/admin",
  },
  {
    path: "/rules",
    name: "Pravidla",
    rtlName: "",
    icon: "tim-icons icon-bulb-63",
    component: <Rules />,
    layout: "/admin",
  },


  {
    path: "/all-teams",
    name: "Všechny týmy",
    rtlName: "",
    icon: "tim-icons icon-single-02",
    component: <AllTeams />,
    layout: "/admin", 
  },

  {
    path: "/contact-us",
    name: "Kontakt",
    rtlName: "",
    icon: "tim-icons icon-chat-33",
    component: <Contact />,
    layout: "/admin",
  },

  {
    path: "/login",
    name: "Přihlášení",
    rtlName: "",
    icon: "tim-icons icon-single-02",
    component: <Login />,
    layout: "/robogames", // Set layout to an empty string or simply omit this line
  },

  {
    path: "/register",
    name: "Registrace",
    rtlName: "",
    icon: "tim-icons icon-single-02",
    component: <Register />,
    layout: "/robogames", // Set layout to an empty string or simply omit this line
  },
  {
    path: "/register",
    name: "Registrace",
    rtlName: "",
    icon: "tim-icons icon-single-02",
    component: <Register />,
    layout: "/robogames", // Set layout to an empty string or simply omit this line
  },
  
  {
    path: "/user-management",
    name: "Správa uživatelů",
    rtlName: "",
    icon: "tim-icons icon-single-02",
    component: <UserManagement />,
    layout: "/admin", 
  },
  {
    path: "/competition-management",
    name: "Správa soutěží",
    rtlName: "",
    icon: "tim-icons icon-single-02",
    component: <CompetitionManagement />,
    layout: "/admin", 
  },

  {
    path: "/competition-detail",
    name: "Účastníci soutěže",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <CompetitionDetail />,
    layout: "/admin", 
  },
  {
    path: "/competition-registration",
    name: "Registrace týmu do soutěže",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <CompetitionRegistration />,
    layout: "/admin", 
  },
  {
    path: "/robot-registration",
    name: "Registrace robotů",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <RobotRegistration />,
    layout: "/admin", 
  },
  {
    path: "/playground-management",
    name: "Správa hrišť",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <PlaygroundManagement />,
    layout: "/admin", 
  },
  {
    path: "/robot-confirmation",
    name: "Potvrzení robotů",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <RobotConfirmation />,
    layout: "/admin", 
  },
  {
    path: "/match-generation",
    name: "Potvrzení robotů",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <MatchGeneration />,
    layout: "/admin", 
  },
  {
    path: "/playground-detail",
    name: "Potvrzení robotů",
    rtlName: "",
    icon: "tim-icons icon-molecule-40",
    component: <PlaygroundDetail />,
    layout: "/admin", 
  },




];
export default routes;
