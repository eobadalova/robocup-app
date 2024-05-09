import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, NavItem, NavLink } from "reactstrap";
import facebookLogo from "../../assets/img/Facebook_Logo_2023.png";

/**
* Renders the footer component for the application.
* The footer includes links to the university website, an "About the Competition" link, and a link to the Facebook page.
* It also displays the copyright information for the current year.
*/
function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <Container fluid>
        <Nav>
          <NavItem>
            <NavLink href="https://www.utb.cz">
              Univerzita Tomáše Bati ve Zlíně
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => navigate('/admin/dashboard')}>
              O soutěži
            </NavLink>
          </NavItem>
          <NavItem>

            <NavLink href="https://www.facebook.com/robogames.utb.cz">
              Facebook
            </NavLink>
          </NavItem>
          <img src={facebookLogo} alt="FB logo" style={{ maxWidth: '50%', height: '20px' }} />
        </Nav>
        <div className="copyright">
          © {new Date().getFullYear()} by Robogames Team
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
