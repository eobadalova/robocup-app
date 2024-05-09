import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Alert,
  CardFooter,
  ListGroup,
  ListGroupItem
} from 'reactstrap';


function MyTeam() {
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [creationError, setCreationError] = useState('');
  const [searchModal, setSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const userID = localStorage.getItem('UserID');
  const [users, setUsers] = useState([]); // Full list of users
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchMyTeam = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Pro zobrazení týmu se prosím přihlaste.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/team/myTeam`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (response.ok && data.type !== 'ERROR') {
          setTeam(data.data);
        } else {
          setError('Nejste členem žádného týmu. Pro účast v soutěži vytvořte nový tým, nebo požádejte tvůrce jiného týmu o zaslání pozvánky.');
        }
      } catch (error) {
        setError('Nepodařilo se načíst data týmu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTeam();
  }, []);

  const handleCreateTeam = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCreationError('Pro vytvoření týmu se musíte přihlásit.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/team/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTeamName })
      });

      const data = await response.json();
      if (response.ok && data.type != 'ERROR') {
        setTeam(data.data);

        setCreateModal(false);
        setNewTeamName('');
        window.location.reload();
      } else {
        // Handle specific error for duplicate team name
        if (data.type == 'ERROR' && data.data == 'failure, team with this name already exists') {
          setCreationError('Tým s tímto názvem již existuje.');
          console.log(data);


        } else {
          setCreationError(data.data || 'Nepodařilo se vytvořit tým.');
        }
      }
    } catch (error) {
      setCreationError('Chyba při komunikaci se serverem.');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (searchModal) { // Load users when the modal is opened
      fetchUsers();
    }
  }, [searchModal]);

  useEffect(() => {
    // Check if the search term is less than 3 characters
    if (searchTerm.length < 3) {
      setFilteredUsers([]);  // Set filtered users to empty if not enough characters
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredData = users.filter(item => {
        // Prepare combined name variants
        const fullName = item.name.toLowerCase() + " " + item.surname.toLowerCase();
        const fullNameReverse = item.surname.toLowerCase() + " " + item.name.toLowerCase();

        return (
          item.name.toLowerCase().includes(lowercasedFilter) ||
          item.surname.toLowerCase().includes(lowercasedFilter) ||
          item.email.toLowerCase().includes(lowercasedFilter) ||
          fullName.includes(lowercasedFilter) ||
          fullNameReverse.includes(lowercasedFilter)
        ) && item.teamID === -1; // Ensure user is not in any team
      });
      setFilteredUsers(filteredData);  // Update state with filtered data
    }
  }, [searchTerm, users]);  // React to changes in searchTerm and users

  const removeMember = async (memberId) => {
    if (window.confirm('Opravdu chcete odstranit tohoto člena z týmu?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/team/removeMember?id=${memberId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          alert('Člen byl úspěšně odstraněn z týmu.');
          // Zde můžete přidat logiku pro aktualizaci stavu či přenačtení informací o týmu
        } else {
          alert('Nepodařilo se odstranit člena týmu.');
        }
      } catch (error) {
        console.error('Error removing the team member:', error);
        alert('Chyba při odstraňování člena týmu.');
      }
    }
  };


  // funkce pro opuštění týmu
  const leaveTeam = async () => {
    // Zobrazit potvrzovací dialog a uložit výsledek
    const confirmLeave = window.confirm("Opravdu chcete opustit tým?");
    if (confirmLeave) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/team/leave`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          console.log('Successfully left the team');
          navigate('/admin/my-team');
        } else {
          console.error('Failed to leave the team:', await response.text());
        }
      } catch (error) {
        console.error('Error leaving the team:', error);
      }
    } else {
      console.log('User decided not to leave the team');
    }
  };



  const handleRemoveTeam = async () => {
    if (window.confirm('Opravdu chcete odstranit tým?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token is missing');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/team/remove?name=${team.name}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Tým byl úspěšně odstraněn.');
          setTeam(null); // Reset team state
        } else {
          alert('Nepodařilo se odstranit tým.');
        }
      } catch (error) {
        console.error('Error removing the team:', error);
      }
    }
  };

  if (isLoading) {
    return <p>Načítání...</p>;
  }



  const handleAddUser = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    // Confirmation dialog using window.confirm
    if (!window.confirm('Opravdu chcete pozvat tohoto uživatele do týmu?')) {
      return; // If user cancels, exit the function
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/team/addMember?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Pozvánka byla úspěšně odeslána');
        // Optionally reload the team data or update the state here
      } else {
        alert('Error. Něco se pokazilo.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className="content">
      <Row>
        <Col xs="12">
          {error || !team ? (
            <div>
              <Alert color='danger' >{error}</Alert>
              <Button color="primary" onClick={() => setCreateModal(true)}>Vytvořit tým</Button>
              <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)}>
                <ModalHeader toggle={() => setCreateModal(false)}>Vytvořit nový tým</ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for="teamName">Název týmu</Label>
                    <Input style={{ color: 'black' }}
                      type="text"
                      name="teamName"
                      id="teamName"
                      placeholder="(př. SEMPA, Jan Novák,... ) "
                      value={newTeamName}
                      onChange={e => setNewTeamName(e.target.value)}
                    />
                  </FormGroup>
                  {creationError && <p className="text-danger">{creationError}</p>}
                </ModalBody>
                <ModalFooter>
                  <Button style={{ margin: '10px' }} color="primary" onClick={handleCreateTeam}>Vytvořit</Button>
                  <Button style={{ margin: '10px' }} color="secondary" onClick={() => setCreateModal(false)}>Zrušit</Button>
                </ModalFooter>
              </Modal>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle tag="h2">{team.name}</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Jméno</th>
                      <th>Příjmení</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.memberNames.map(member => (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>{member.name}</td>
                        <td>{member.surname}</td>

                        {team.leaderID === parseInt(userID, 10) && member.id !== team.leaderID && (
                          <td>
                            <Button color="link" size="sm" onClick={() => removeMember(member.id)}>
                              <i className="tim-icons icon-trash-simple" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <p><strong>Vedoucí týmu ID:</strong> {team.leaderID}</p>
                <p><strong>Roky registrace:</strong> {team.registrationYears.map(year => year.year).join(', ')}</p>
                {team.leaderID === parseInt(userID, 10) && (
                  <>
                    <Button className="text-right" color="success" size="sm" onClick={() => setSearchModal(true)}>Přidat uživatele do týmu</Button>
                    <Modal isOpen={searchModal} toggle={() => setSearchModal(false)}>
                      <ModalHeader toggle={() => setSearchModal(false)}>Hledat uživatele</ModalHeader>
                      <ModalBody>
                        <Input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Zadejte email nebo jméno"
                          style={{ color: 'black' }}
                        />
                        <ListGroup>

                          {filteredUsers.map((user) => (



                            <ListGroupItem key={user.id} tag="button" >
                              {user.name} {user.surname} - {user.email}

                              <Button color="link" onClick={() => handleAddUser(user.id)}> {/* Add onClick event */}
                                <i className="tim-icons icon-send" />
                              </Button>
                            </ListGroupItem>
                          ))}



                        </ListGroup>
                      </ModalBody>
                    </Modal>
                  </>
                )}
              </CardBody>
              <CardFooter>
                <Button size="sm" color="warning" onClick={leaveTeam}>
                  Opustit tým
                </Button>
                {team.leaderID === parseInt(userID, 10) && (
                  <Button className="text-right" color="danger" size="sm" onClick={handleRemoveTeam}>Odstranit tým</Button>
                )}


              </CardFooter>
            </Card>

          )}
        </Col>
      </Row>
      {team && (
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">ZDE SE MŮŽETE REGISTROVAT DO SOUTĚŽE.</CardTitle>
              </CardHeader>
              <CardBody>
                <Button
                  color="info"
                  size="lg"
                  onClick={() => navigate('/admin/competition-registration')}
                >
                  <i className="tim-icons icon-tap-02" /> Registrace do soutěže ROBOGAMES <i className="tim-icons icon-tap-02" />
                </Button>
              </CardBody>

            </Card>
          </Col>
        </Row>
      )}

    </div>
  );
}

export default MyTeam;