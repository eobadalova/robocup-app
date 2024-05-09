import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  CardFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

function Tables() {
  const [disciplines, setDisciplines] = useState([]);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    scoreAggregation: '',
    time: '',
    maxRounds: ''
  });
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const rolesString = localStorage.getItem('roles');
  const rolesArray = rolesString ? rolesString.split(', ') : [];
  const isAdminOrLeader = rolesArray.some(role => ['ADMIN', 'LEADER'].includes(role));

  const toggleDropdown = (id) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    setEditMode(false);
    setFormData({
      id: '',
      name: '',
      description: '',
      scoreAggregation: '',
      time: '',
      maxRounds: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (discipline) => {
    setEditMode(true);
    setFormData({
      id: discipline.id,
      name: discipline.name,
      description: discipline.description,
      scoreAggregation: discipline.scoreAggregation.name,
      time: discipline.time,
      maxRounds: discipline.maxRounds
    });
    setModal(true);
  };

  const handleRemove = async (id) => {
    if (window.confirm('Opravdu chcete odstranit tuto disciplínu?')) {
      const apiUrl = `${process.env.REACT_APP_API_URL}api/discipline/remove?id=${id}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (response.ok) {
          setDisciplines(disciplines.filter(d => d.id !== id));
        } else {
          throw new Error('Failed to remove discipline');
        }
      } catch (error) {
        console.error('Error removing discipline: ', error);
      }
    }
  };

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_URL}api/discipline/all`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDisciplines(data.data);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleSubmit = async () => {
    const apiUrl = editMode ? `${process.env.REACT_APP_API_URL}api/discipline/edit?id=${formData.id}` : `${process.env.REACT_APP_API_URL}api/discipline/create`;
    try {
      const response = await fetch(apiUrl, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedDiscipline = await response.json();
        setDisciplines(editMode ? disciplines.map(d => d.id === formData.id ? {...d, ...formData} : d) : [...disciplines, updatedDiscipline.data]);
        toggleModal();
      } else {
        throw new Error('Failed to process discipline');
      }
    } catch (error) {
      console.error('Error processing discipline: ', error);
    }
  };

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_URL}api/discipline/all`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDisciplines(data.data);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);


  return (
    <>
      <div className="content">
      {isAdminOrLeader && (
        <Button style={{marginBottom:'10px'}} color="primary" onClick={toggleModal}>Přidat disciplínu</Button>
      )}
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>{editMode ? 'Upravit disciplínu' : 'Přidat novou disciplínu'}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Název disciplíny</Label>
              <Input style={{color:'black'}} type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Popis</Label>
              <Input  style={{color:'black'}}  type="textarea" name="description" id="description" value={formData.description} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="scoreAggregation">Skórovací Agregace</Label>
              <Input  style={{color:'black'}} type="select" name="scoreAggregation" id="scoreAggregation" value={formData.scoreAggregation} onChange={handleInputChange}>
                <option>MIN</option>
                <option>MAX</option>
                <option>SUM</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="time">Časový limit</Label>
              <Input  style={{color:'black'}}  type="text" name="time" id="time" value={formData.time} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="maxRounds">Maximální počet kol  (-1 = neomezeno)</Label>
              <Input  style={{color:'black'}} type="number" name="maxRounds" id="maxRounds" value={formData.maxRounds} onChange={handleInputChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button style={{margin:'10px'}} color="primary" onClick={() => {
              if (window.confirm('Opravdu chcete upravit/vytvořit tuto disciplínu?')) {
                handleSubmit();
                window.location.reload();
              }
            }}>{editMode ? 'Upravit' : 'Odeslat'}</Button>
            <Button style={{margin:'10px'}} color="secondary" onClick={toggleModal}>Zrušit</Button>
          </ModalFooter>
        </Modal>
        <Row>
          <div className="d-flex flex-wrap">
            {disciplines.map((discipline) => (
              <Col md="4" key={discipline.id} className="d-flex align-items-stretch">
                <Card className="flex-fill">
                  <CardHeader>
                    <CardTitle tag="h2">{discipline.name}</CardTitle>
                  </CardHeader>
                  <CardBody>

                  {isAdminOrLeader && (
                    <p><strong>Způsob hodnocení:</strong> {discipline.scoreAggregation.name}</p>)}
                    <p><strong>Čas:</strong> {discipline.time} sekund</p>
                    <p><strong>Maximální počet kol:</strong> {discipline.maxRounds === -1 ? "Neomezeno" : discipline.maxRounds}</p>
                    <p>{discipline.description}</p>

                  </CardBody>
                  <CardFooter>
                  {isAdminOrLeader && (
                  <Dropdown isOpen={openDropdownId === discipline.id} toggle={() => toggleDropdown(discipline.id)}>
                    <DropdownToggle caret >
                      <i className="tim-icons icon-settings" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => handleEdit(discipline)}>Upravit</DropdownItem>
                      <DropdownItem onClick={() => handleRemove(discipline.id)}>Odstranit</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  )}
                </CardFooter>
                </Card>
              </Col>
            ))}
          </div>
        </Row>
      </div>
    </>
  );
}

export default Tables;
