/**
* Renders the competition registration page, allowing users to view available competitions, register for them, and manage their robot registrations.
* 
* The component fetches the list of competitions and the user's registrations from the API, and displays them in a card-based layout.
* Users can register for a competition, unregister from a competition, and manage their robot registrations for a competition.
* 
* The component uses several helper functions to format the date and time of the competitions, and to handle the registration and unregistration processes.
*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
} from 'reactstrap';

function CompetitionRegistration() {
  const [competitions, setCompetitions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(date);
  };

  const formatTime = (timeString) => {
    return timeString.substr(0, 5);
  };

  const handleManageRobots = (year) => {
    // navigate to the robot registration page with the competition year as a query parameter
    navigate(`/admin/robot-registration?year=${year}`);
  };
  const unregisterTeam = async (year) => {
    const confirmUnregistration = window.confirm("Opravdu se chcete odregistrovat?");
    if (!confirmUnregistration) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/teamRegistration/unregister?year=${year}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        if (data.type === 'Error') {
          alert(`Error: ${data.data}`);
        } else {


          window.location.reload();

        }
      } else {
        console.error('Failed to unregister team:', data);
        alert(`Failed to unregister: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error unregistering team:', error);
      alert('An error occurred while trying to unregister the team.');
    }
  };

  const registerTeam = async (year) => {
    // ask user for confirmation before registering
    const confirmRegistration = window.confirm("Opravdu se chcete zaregistrovat?");
    if (!confirmRegistration) {
      return;
    }

    const token = localStorage.getItem('token');
    const requestBody = {
      year: year,
      open: false
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/teamRegistration/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      if (response.ok) {
        if (data.type === 'Error') {
          alert(`Error: ${data.data}`); // display error message from the server
        } else {
          alert('Tým byl úspěšně zaregistrován.');
          window.location.reload();

        }
      } else {
        console.error('Failed to register team:', data);
        alert(`Failed to register: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error registering team:', error);
      alert('An error occurred while trying to register the team.');
    }
  };


  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      try {
        const responses = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}api/competition/all`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${process.env.REACT_APP_API_URL}api/teamRegistration/all`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
        const [competitionsData, registrationsData] = await Promise.all(responses.map(res => res.json()));

        if (responses[0].ok && responses[1].ok) {
          setCompetitions(competitionsData.data);
          setRegistrations(registrationsData.data);
        } else {
          console.error('Failed to fetch data:', competitionsData, registrationsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h2">Dostupné soutěže</CardTitle>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                competitions.map((competition) => {
                  const isRegistered = registrations.some(reg => reg.compatitionYear === competition.year);
                  const competitionDate = new Date(competition.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  return (
                    <Card key={competition.id} style={{ border: '1px solid lightgray' }}>

                      <CardHeader>
                        <CardTitle tag="h3">{`ROBOGAMES ${competition.year}`}</CardTitle>
                        <hr></hr>
                      </CardHeader>
                      <CardBody>
                        <p>Datum soutěže: <span style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>{formatDate(competition.date)}</span></p>
                        <p>Začátek: <span style={{ color: 'green', fontWeight: 'bold' }}>{formatTime(competition.startTime)}</span></p>
                        <p>Předpokládaný konec: <span style={{ color: 'green', fontWeight: 'bold' }}>{formatTime(competition.endTime)}</span></p>
                        {competition.started ? (
                          <p style={{ color: 'red', fontWeight: 'bold' }}>Soutěž již začala. Není možná registrace ani úprava robotů.</p>
                        ) : isRegistered ? (
                          <>
                            <p style={{ color: 'green', fontWeight: 'bold' }}>V této soutěži jste zaregistrováni. Nyní můžete zaregistrovat a spravovat své roboty. </p>

                            <Button color="info" onClick={() => handleManageRobots(competition.year)}>

                              <i className="tim-icons icon-double-right" />

                              SPRAVOVAT ROBOTY

                              <i className="tim-icons icon-double-left" />

                            </Button>


                            <Button color="danger" onClick={() => unregisterTeam(competition.year)}>



                              Zrušit registraci



                            </Button>




                          </>
                        ) : (
                          <Button color="success" onClick={() => registerTeam(competition.year)}>
                            Registrovat
                          </Button>
                        )}
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CompetitionRegistration;
