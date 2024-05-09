/**
* The `RobotConfirmation` component is responsible for displaying a list of robots and allowing the user to confirm or reject their registration.
* 
* The component fetches the list of competition years and the robots for the selected year. It allows the user to filter the robots by team name and provides buttons to confirm or reject the registration of each robot.
* 
* When the user clicks the confirm or reject button, the component sends a PUT request to the server to update the robot's registration status. Upon successful update, the component refreshes the list of robots to show the updated statuses.

*/
import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardBody, CardTitle, Button,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Table, Row, Col, Input
} from 'reactstrap';

function RobotConfirmation() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [robots, setRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCompetitionYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchRobotsForYear(selectedYear);
    }
  }, [selectedYear]);

  const handleConfirmRegistration = async (robotId, confirmed) => {
    if (window.confirm(`Jste si jisti, že chcete ${confirmed ? 'potvrdit' : 'vyřadit'} tohoto robota?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/confirmRegistration?id=${robotId}&confirmed=${confirmed}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        if (response.ok) {
          fetchRobotsForYear(selectedYear); // Refresh the list of robots to show updated statuses
        } else if (data.type === 'ERROR') {
          alert(`Error: ${data.data}`);
        } else {
          alert(`Failed to update robot registration: ${data.message || 'Unknown error occurred'}`);
        }
      } catch (error) {
        console.error('Error confirming the robot registration:', error);
        alert(`An error occurred while confirming the robot: ${error.message || 'Failed to communicate with the server'}`);
      }
    }
  };

  const fetchCompetitionYears = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/competition/all`);
      const data = await response.json();
      if (response.ok && data.type === 'RESPONSE') {
        setYears(data.data.map(item => item.year));
      }
    } catch (error) {
      console.error('Failed to fetch competition years:', error);
    }
  };

  const fetchRobotsForYear = async (year) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/allForYear?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (response.ok && data.type === 'RESPONSE') {
        setRobots(data.data);
      } else if (data.type === 'ERROR') {
        alert(`Error: ${data.data}`);
      } else {
        alert(`Failed to fetch robots: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Failed to fetch robots for year:', error);
      alert(`An error occurred while fetching robots: ${error.message || 'Failed to communicate with server'}`);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const filteredRobots = robots.filter(robot => robot.teamName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Přehled robotů</CardTitle>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret>
                  {selectedYear || 'Zvolte ročník'}
                </DropdownToggle>
                <DropdownMenu>
                  {years.map(year => (
                    <DropdownItem key={year} onClick={() => setSelectedYear(year)}>
                      {year}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Input
                type="text"
                placeholder="Hledat podle týmu.."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '300px', marginTop: '15px' }}
              />
            </CardHeader>
            <CardBody>
              {robots.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Číslo robota</th>
                      <th>Název</th>
                      <th>Potvrzen</th>
                      <th>Kategorie</th>
                      <th>Tým</th>
                      <th>Disciplína</th>
                      <th>Potvrdit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRobots.map(robot => (
                      <tr key={robot.id}>
                        <td>{robot.id}</td>
                        <td>{robot.number}</td>
                        <td>{robot.name}</td>
                        <td>{robot.confirmed ? 'Ano' : 'Ne'}</td>
                        <td>{robot.category}</td>
                        <td>{robot.teamName}</td>
                        <td>{robot.diciplineName}</td>
                        <td>
                          <Button
                            color={robot.confirmed ? "warning" : "success"}
                            className="btn-icon btn-simple"
                            onClick={() => handleConfirmRegistration(robot.id, !robot.confirmed)}
                          >
                            <i className={robot.confirmed ? "tim-icons icon-simple-remove" : "tim-icons icon-check-2"} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div>Pro tento ročník nejsou přítomni žádní roboti.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default RobotConfirmation;
