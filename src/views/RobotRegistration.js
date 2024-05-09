import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardFooter
} from 'reactstrap';

function RobotRegistration() {
  const location = useLocation();
  const [robots, setRobots] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [modal, setModal] = useState(false);
  const [robotName, setRobotName] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const year = searchParams.get('year');

  useEffect(() => {
    fetchRobots();
    fetchDisciplines();
  }, [year]);  // Ensure year is captured from the URL to filter robots accordingly

  async function fetchRobots() {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/all?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRobots(data.data.map(robot => ({ ...robot, dropdownOpen: false })));
      } else {
        setErrorMessage(`Failed to fetch robots: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('Nastala chyba při komunikaci se serverem.');
    }
    setIsLoading(false);
  }

  async function fetchDisciplines() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/discipline/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDisciplines(data.data);
      } else {
        console.error('Failed to fetch disciplines');
      }
    } catch (error) {
      console.error('Error fetching disciplines:', error);
    }
  }

  function toggleDropdown(id) {
    setRobots(robots.map(robot => robot.id === id ? { ...robot, dropdownOpen: !robot.dropdownOpen } : robot));
  }

  async function handleSelectDiscipline(robotId, disciplineId, disciplineName) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/register?robotID=${robotId}&disciplineID=${disciplineId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    });

    const data = await response.json(); // Always parse the JSON to access the response data

    if (response.ok) {
        if (data.type === "RESPONSE" && data.data === "success") {
            setRobots(robots.map(robot => {
                if (robot.id === robotId) {
                    return { ...robot, disciplineName, disciplineId, dropdownOpen: false };
                }
                return robot;
            }));
            alert('Robot byl úspěsně zaregistrován do disciplíny.');
            window.location.reload();
        } else if (data.type === "ERROR") {
            if (data.data === "failure, you have exceeded the maximum limit of registered robots per discipline") {
                alert("Překročili jste limit počtu registrovaných robotů na disciplínu.");
            } else {
                alert(`Error: ${data.data}`); // Handle other error messages
            }
        }
    } else {
        alert(`Failed to register discipline: ${data.message || 'Unknown error occurred'}`);
    }
}

  async function handleRemoveRobot(year, robotId) {
    if (!robotId || !year) {
      alert("Missing robot ID or year for the competition.");
      return;
    }

    // Use window.confirm to prompt the user for confirmation
    if (window.confirm('Opravdu chcete smazat robota?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/remove?year=${year}&id=${robotId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();  // Parse the JSON response from the server

        if (response.ok) {
          alert("Robot successfully removed from the competition.");
          fetchRobots();  // Refresh the robot list after successful deletion
        } else {
          // Handle specific error messages from the server
          if (data.type === "ERROR") {
            alert(`Error removing robot: ${data.data}`);  // Show server error message
          } else {
            alert(`Failed to remove robot: ${response.statusText}`);  // Generic error if no specific error is provided
          }
        }
      } catch (error) {
        console.error('Error while removing robot:', error);
        alert(`Error while removing robot: ${error.message || 'Failed to communicate with server'}`);
      }
    }
  }



  async function handleUnregisterDiscipline(robotId) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/unregister?id=${robotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    if (response.ok) {
      setRobots(robots.map(robot => robot.id === robotId ? { ...robot, disciplineName: '', disciplineID: -1 } : robot));
    } else {
      alert('Failed to unregister discipline');
    }
  }

  function toggleModal() {
    setModal(!modal);
  }

  async function handleAddRobot() {
    if (!robotName) {
      alert("Please enter a robot name.");
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/create?year=${year}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: robotName })
      });
      const data = await response.json();  // Parse the JSON response from the server

      if (response.ok && data.type !== "ERROR") {
        toggleModal();
        setRobotName('');
        fetchRobots();  // Refresh the list
      } else {
        // Check for specific error message regarding robot name duplication
        if (data.type === "ERROR" && data.data.includes("already exists")) {
          alert(`Error: Robot s tímto jménem již existuje. Vyberte jiné jméno.}`);  // Show alert with the specific error message
        } else {
          alert(`Failed to add robot: ${data.data || response.statusText}`);  // Fallback error message
        }
      }
    } catch (error) {
      alert(`Error: ${error.message || 'Failed to communicate with server'}`);
    }
  }


  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h2">Přehled robotů pro rok {year}</CardTitle>
              <Button color="primary" onClick={toggleModal}>Přidat robota</Button>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <p>Načítání...</p>
              ) : errorMessage ? (
                <Alert color="warning">{errorMessage}</Alert>
              ) : robots.map((robot) => (
                <Card key={robot.id} className="mb-3" style={{ border: '1px solid lightgray' }}>

                  <CardBody>

                    <CardTitle tag="h3">{robot.name}



                    </CardTitle>


                    <CardText>
                      <hr></hr>
                      <p>Číslo robota: {robot.id}</p>

                      Zkontrolovaný: <span style={{ color: robot.confirmed ? 'green' : 'red' }}>
                        {robot.confirmed ? 'Ano' : 'Ne'}
                      </span><br />

                      Kategorie: {robot.category === "HIGH_AGE_CATEGORY" ? 'Studenti a dospělí' : 'Žáci základní školy '}<br />


                      Disciplína: {robot.disciplineID && robot.disciplineID > 0 ? (
                        <>


                          <span class='text-info'>{robot.diciplineName}</span>



                          {!robot.confirmed && (
                            <Alert color='warning' style={{ marginTop: '10px' }}>Robot zaregistrován. Čeká se na potvrzení organizátory. Potvrzení bude uděleno po osobní kontrole robota před začátkem soutěže.</Alert>




                          )}

                          {!robot.confirmed && (
                            <Button color="danger" onClick={() => handleUnregisterDiscipline(robot.id)}>Zrušit registraci</Button>
                          )}
                        </>
                      ) : (
                        <Dropdown isOpen={robot.dropdownOpen} toggle={() => toggleDropdown(robot.id)}>
                          <DropdownToggle caret>
                            {robot.disciplineName || "Registrace robota do disciplíny"}
                          </DropdownToggle>
                          <DropdownMenu>
                            {disciplines.map(d => (
                              <DropdownItem key={d.id} onClick={() => handleSelectDiscipline(robot.id, d.id, d.name)}>
                                {d.name}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </CardText>
                  </CardBody>
                  {!robot.confirmed && (
                    <CardFooter className="d-flex justify-content-end">
                      <Button color="danger" onClick={() => handleRemoveRobot(year, robot.id)} className="btn-icon btn-simple">
                        <i className="tim-icons icon-trash-simple"></i>
                      </Button>
                    </CardFooter>
                  )}

                </Card>

              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Přidat robota</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="robotName">Název robota</Label>
              <Input type="text" name="name" id="robotName" placeholder="Zadejte jméno robota" value={robotName} onChange={(e) => setRobotName(e.target.value)} style={{ color: 'black' }} />

            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddRobot} style={{ margin: '10px' }}>Odeslat</Button>
          <Button color="secondary" onClick={toggleModal} style={{ margin: '10px' }}>Zrušit</Button>

        </ModalFooter>
      </Modal>
    </div>
  );
}

export default RobotRegistration;

