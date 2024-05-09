import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
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
  DropdownItem
} from "reactstrap";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthDate: ''
  });
  const [isAdminOrLeader, setIsAdminOrLeader] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);

  const roles = ['ADMIN', 'COMPETITOR', 'REFEREE', 'ASSISTANT', 'LEADER'];

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch(`${process.env.REACT_APP_API_URL}api/user/info`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const userData = await userRes.json();
        if (userRes.ok && userData.data.roles.some(role => ['ADMIN', 'LEADER'].includes(role.name))) {
          setIsAdminOrLeader(true);
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}api/user/all`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        if (res.ok) {
          setUsers(result.data);
        } else {
          console.error('Failed to fetch users:', result.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setEditModal(true);
    setDropdownOpen(false);
    setNewRole('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAddUser = async () => {
    if (!Object.values(newUser).every(value => value)) {
      alert("Vyplňte prosím všechna pole.");
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        alert('Uživatel úspěšně přidán!');
        setAddModal(false);
        window.location.reload();
      } else {
        const result = await response.json();
        throw new Error(result.message || "Přidání uživatele se nezdařilo.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const submitRoleChange = async (action) => {
    if (newRole && currentUser) {
      const apiPath = action === 'add' ? 'addRole' : 'removeRole';
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/${apiPath}?role=${newRole}&id=${currentUser.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          alert(`Role ${action === 'add' ? 'přidána' : 'odebrána'} úspěšně!`);
          setEditModal(false);
          window.location.reload();
        } else {
          throw new Error(`Změna role se nezdařila.`);
        }
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert('Nejdříve vyberte roli.');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Opravdu chcete odstranit tohoto uživatele?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/remove?id=${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          alert('Uživatel byl úspěšně odstraněn.');
          //window.location.reload();
        } else {
          throw new Error('Odstranění uživatele se nezdařilo.');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleSearch = async () => {
    const endpoint = searchTerm.includes('@') ? `getByEmail?email=${searchTerm}` : `getByID?id=${searchTerm}`;
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/${endpoint}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const result = await response.json();
    if (response.ok) {
      setSearchedUser(result.data); // Assuming the first result is what we need
    } else {
      alert('No user found with the given ID or Email.');
      setSearchedUser(null);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h4 className="card-title">Správa uživatelů</h4>
              {isAdminOrLeader && (
                <Button color="success" onClick={() => setAddModal(true)}>Přidat uživatele</Button>
              )}
              {isAdminOrLeader && (
                <div className="search-section">
                  <Input
                    type="text"
                    placeholder="Hledat dle ID/Emailu"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 'auto', display: 'inline-block', marginRight: '10px' }}
                  />
                  <Button color="info" onClick={handleSearch}>Search</Button>
                </div>
              )}
{searchedUser && (
  <Table responsive>
    <thead className="text-primary">
      <tr>
        <th>ID</th>
        <th>UUID</th>
        <th>Name</th>
        <th>Surname</th>
        <th>Email</th>
        <th>Birth Date</th>
        <th>Team ID</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{searchedUser.id}</td>
        <td>{searchedUser.uuid}</td>
        <td>{searchedUser.name}</td>
        <td>{searchedUser.surname}</td>
        <td>{searchedUser.email}</td>
        <td>{searchedUser.birthDate}</td>
        <td>{searchedUser.teamID}</td>
      </tr>
    </tbody>
  </Table>
)}

            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>ID</th>
                    <th>UUID</th>
                    <th>Jméno</th>
                    <th>Příjmení</th>
                    <th>Email</th>
                    <th>Datum narození</th>
                    <th>Role</th>
                    <th>Týmové ID</th>
                    <th>Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.id}</td>
                      <td>{user.uuid}</td>
                      <td>{user.name}</td>
                      <td>{user.surname}</td>
                      <td>{user.email}</td>
                      <td>{user.birthDate}</td>
                      <td>
                        {user.roles.map(role => role.name).join(', ')}
                        {isAdminOrLeader && !user.roles.some(role => role.name === 'ADMIN') && (
                          <Button color="primary" size="sm" onClick={() => handleEdit(user)} style={{ marginLeft: '10px' }}>
                            Upravit roli
                          </Button>
                        )}
                      </td>
                      <td>{user.teamID}</td>
                      <td>
                        {isAdminOrLeader && (
                          <Button color="danger" size="sm" onClick={() => handleRemoveUser(user.id)} style={{ marginLeft: '10px' }}>
                            <i className="tim-icons icon-trash-simple"></i>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal for adding a new user */}
      <Modal isOpen={addModal} toggle={() => setAddModal(false)}>
        <ModalHeader toggle={() => setAddModal(false)}>Přidat nového uživatele</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Jméno</Label>
              <Input style={{ color: 'black' }} type="text" name="name" id="name" placeholder="Zadejte jméno" value={newUser.name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="surname">Příjmení</Label>
              <Input style={{ color: 'black' }} type="text" name="surname" id="surname" placeholder="Zadejte příjmení" value={newUser.surname} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input  style={{ color: 'black' }} type="email" name="email" id="email" placeholder="Zadejte email" value={newUser.email} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="password">Heslo</Label>
              <Input style={{ color: 'black' }} type="password" name="password" id="password" placeholder="Zadejte heslo" value={newUser.password} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="birthDate">Datum narození</Label>
              <Input  style={{ color: 'black' }} type="date" name="birthDate" id="birthDate" value={newUser.birthDate} onChange={handleInputChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button style={{ margin: '10px' }} color="primary" onClick={handleAddUser}>Přidat</Button>
          <Button  style={{ margin: '10px' }} color="secondary" onClick={() => setAddModal(false)}>Zrušit</Button>
        </ModalFooter>
      </Modal>

      {/* Modal for editing roles */}
      <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
        <ModalHeader toggle={() => setEditModal(false)}>Upravit roli</ModalHeader>
        <ModalBody>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {newRole || 'Vyberte roli'}
            </DropdownToggle>
            <DropdownMenu>
              {roles.map(role => (
                <DropdownItem key={role} onClick={() => setNewRole(role)}>
                  {role}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => submitRoleChange('add')} style={{ margin: '10px' }}>Přidat roli</Button>
          <Button color="danger" onClick={() => submitRoleChange('remove')} style={{ margin: '10px' }}>Odebrat roli</Button>
          <Button color="secondary" onClick={() => setEditModal(false)} style={{ margin: '10px' }}>Zrušit</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default UserManagement;
