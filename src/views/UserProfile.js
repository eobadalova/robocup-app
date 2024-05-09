import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function UserProfile() {
  const [userData, setUserData] = useState({
    id: '',
    uuid: '',
    name: '',
    surname: '',
    email: '',
    birthDate: '',
    roles: [],
    teamID: ''
  });
  const [initialUserData, setInitialUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/info`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          setUserData(jsonResponse.data);
          setInitialUserData(jsonResponse.data); // Store initial data for comparison
        } else {
          console.error("Failed to fetch user data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission reload

    // Check for actual changes and no empty required inputs
    if (userData.name && userData.surname && userData.birthDate &&
      (userData.name !== initialUserData.name ||
        userData.surname !== initialUserData.surname ||
        userData.birthDate !== initialUserData.birthDate)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/edit`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: userData.name,
            surname: userData.surname,
            birthDate: userData.birthDate
          })
        });

        if (!response.ok) throw new Error('Failed to update user data');

        const result = await response.json();
        console.log('Uložení se podařilo:', result);
        alert('Údaje byly úspěšně uloženy.');
      } catch (error) {
        console.error('Update selhal:', error);
        alert('Uložení infomací selhalo. Zkuste to prosím později.');
      }
    } else {
      alert('Žádné změny nebyly provedeny.');
    }
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Upravit informace</h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Jméno</label>
                        <Input
                          value={userData.name}
                          placeholder="Jméno"
                          type="text"
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Příjmení</label>
                        <Input
                          value={userData.surname}
                          placeholder="Příjmení"
                          type="text"
                          onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          value={userData.email}
                          placeholder="Email"
                          type="email"
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Datum narození</label>
                        <Input
                          value={userData.birthDate}
                          type="date"
                          onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
                          required
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <CardFooter>
                    <Button className="btn-fill" color="primary" type="submit">
                      Uložit
                    </Button>
                  </CardFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar"
                      src={require("assets/img/profile-picture.png")}
                    />
                    <h5 className="title">{userData.name + ' ' + userData.surname}</h5>
                  </a>
                  <p className="description">
                    {userData.roles.map(role => role.name).join(', ')}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;


