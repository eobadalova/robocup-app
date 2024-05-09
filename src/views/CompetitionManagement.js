import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

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
  Input
} from "reactstrap";

/**
* Renders the Competition Management component, which allows administrators and leaders to manage competitions.
* This component fetches the list of competitions, provides functionality to create, edit, start, and remove competitions,
* and displays the competition details in a card layout.
*/
function CompetitionManagement() {
  const [competitions, setCompetitions] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  const navigate = useNavigate();

  const viewParticipants = (year) => {
    navigate(`/admin/competition-detail/?year=${year}`);
  };


  const [formDataEdit, setFormDataEdit] = useState({
    id: '',
    year: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  const toggleModal = () => setModal(!modal);
  const toggleModalEdit = () => setModalEdit(!modalEdit);



  const handleEditSubmit = async () => {
    const token = localStorage.getItem('token');
    if (token && validateFormEdit()) {
      try {
        const parsedData = {
          year: parseInt(formDataEdit.year, 10),
          date: formDataEdit.date,
          startTime: formDataEdit.startTime + ":00",
          endTime: formDataEdit.endTime + ":00"
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}api/competition/edit?id=${formDataEdit.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parsedData)
        });

        if (response.ok) {
          const result = await response.json();
          setCompetitions(competitions.map(comp => comp.id === formDataEdit.id ? { ...comp, ...parsedData } : comp));
          toggleModalEdit();
          window.location.reload();
        } else {
          const error = await response.json();
          alert(`Error: ${error.error} - ${error.message || 'Something went wrong.'}`);
        }
      } catch (error) {
        alert(`Error updating competition: ${error.message}`);
      }
    } else {
      alert('Please fill all fields correctly.');
    }
  };




  useEffect(() => {
    const fetchCompetitions = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}api/competition/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await response.json();
          if (response.ok) {
            setCompetitions(result.data);
          } else {
            console.error('Failed to fetch competitions');
          }
        } catch (error) {
          console.error('Error fetching competitions:', error);
        }
      }
    };
    fetchCompetitions();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleInputChangeEdit = (e) => {
    setFormDataEdit({ ...formDataEdit, [e.target.name]: e.target.value });
  };

  const startCompetition = async (id) => {
    const token = localStorage.getItem('token');
    const confirmStart = window.confirm("Opravdu chcete zahájit tuto soutěž?");

    if (confirmStart && token) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/competition/start?id=${id}`, {
          method: 'PUT', // Check the API specification to confirm the HTTP method
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const updatedCompetitions = competitions.map(comp =>
            comp.id === id ? { ...comp, started: true } : comp
          );
          setCompetitions(updatedCompetitions);
          alert("Soutěž byla zahájena");
        } else {
          const error = await response.json();
          alert(`Chyba: ${error.error} - ${error.message || 'Došlo k chybě na serveru.'}`);
        }
      } catch (error) {
        console.error('Error starting competition:', error);
        alert(`Chyba při zahajování soutěže: ${error.message}`);
      }
    } else if (!token) {
      alert('Pro provedení této akce musíte být přihlášeni.');
    }
  };



  const handleSubmit = async () => {
    if (validateForm()) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const parsedData = {
            ...formData,
            year: parseInt(formData.year, 10),
            startTime: formData.startTime + ":00",
            endTime: formData.endTime + ":00"
          };

          const response = await fetch(`${process.env.REACT_APP_API_URL}api/competition/create`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(parsedData)
          });

          if (response.ok) {
            const result = await response.json();
            setCompetitions([...competitions, result.data]);
            toggleModal();
          } else {
            const error = await response.json();
            console.error('Failed to create competition:', error);
            alert(`Error: ${error.error} - ${error.message || 'Something went wrong.'}`);
          }
        } catch (error) {
          console.error('Error creating competition:', error);
          alert(`Error creating competition: ${error.message}`);
        }
      }
    } else {
      alert('Please fill all fields correctly.');
    }
  };

  const validateForm = () => {
    return formData.year.trim() && formData.date.trim() && formData.startTime.trim() && formData.endTime.trim();
  };
  const validateFormEdit = () => {
    return formDataEdit.year.trim() && formDataEdit.date.trim() && formDataEdit.startTime.trim() && formDataEdit.endTime.trim();
  };
  const handleRemoveCompetition = async (id) => {
    const token = localStorage.getItem('token');
    if (token) {

      const confirmDelete = window.confirm("Opravdu chcete odstranit tuto soutěž?");
      if (confirmDelete) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}api/competition/remove?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {

            setCompetitions(competitions.filter(comp => comp.id !== id));
          } else {
            console.error('Chyba při mazání soutěže');
            alert('Nepodařilo se odstranit soutěž');
          }
        } catch (error) {
          console.error('Chyba při mazání soutěže:', error);
          alert('Chyba při mazání soutěže: ' + error.message);
        }
      } else {

        console.log("Odstranění zrušeno uživatelem.");
      }
    } else {
      alert("Pro provedení této akce musíte být přihlášeni.");
    }
  };


  const rolesString = localStorage.getItem('roles');
  const rolesArray = rolesString ? rolesString.split(', ') : [];
  const isAdminOrLeader = rolesArray.some(role => ['ADMIN', 'LEADER'].includes(role));

  return (
    <div className="content">
      <Button color="success" style={{ marginBottom: '10px' }} onClick={() => toggleModal()}>Přidat soutěž</Button>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Přidat novou soutěž</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="year">Rok</Label>
            <Input style={{ color: 'black' }} type="number" name="year" id="year" value={formData.year} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="date">Datum</Label>
            <Input style={{ color: 'black' }} type="date" name="date" id="date" value={formData.date} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="startTime">Začátek</Label>
            <Input style={{ color: 'black' }} type="time" name="startTime" id="startTime" value={formData.startTime} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="endTime">Konec</Label>
            <Input style={{ color: 'black' }} type="time" name="endTime" id="endTime" value={formData.endTime} onChange={handleInputChange} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button style={{ margin: '10px' }} color="primary" onClick={handleSubmit}>Uložit</Button>
          <Button style={{ margin: '10px' }} color="secondary" onClick={() => toggleModal()}>Zrušit</Button>
        </ModalFooter>
      </Modal>

      {competitions.length > 0 ? (
        <Row>
          {competitions.map(competition => (
            <Col key={competition.id} lg="6" md="12">
              <Card>
                <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <CardTitle tag="h4">ROBOGAMES {competition.year}</CardTitle>
                  {isAdminOrLeader && !competition.started && (
                    <Button style={{ marginBottom: '15px' }} color="danger" size="sm" onClick={() => handleRemoveCompetition(competition.id)}>
                      <i className="tim-icons icon-simple-remove" />
                    </Button>
                  )}
                </CardHeader>
                <CardBody>
                  <dl className="row">
                    <dt className="col-sm-3">ID:</dt>
                    <dd className="col-sm-9">{competition.id}</dd>
                    <dt className="col-sm-3">Datum:</dt>
                    <dd className="col-sm-9">{competition.date ? competition.date.split('T')[0] : 'N/A'}</dd>
                    <dt className="col-sm-3">Začátek:</dt>
                    <dd className="col-sm-9">{competition.startTime}</dd>
                    <dt className="col-sm-3">Konec:</dt>
                    <dd className="col-sm-9">{competition.endTime}</dd>
                    <dt className="col-sm-3">Zahájeno:</dt>
                    <dd className="col-sm-9">{competition.started ? 'Ano' : 'Ne'}</dd>
                  </dl>

                  <hr />



                  <div className="text-left">
                    {isAdminOrLeader && !competition.started && (
                      <Button color="success" size="sm" onClick={() => startCompetition(competition.id)}>Zahájit</Button>
                    )}

                    {isAdminOrLeader && !competition.started && (
                      <Button color="info" size="sm" className="mr-2" onClick={() => toggleModalEdit()} >Upravit</Button>

                    )}
                    <Modal isOpen={modalEdit} toggle={toggleModalEdit}>
                      <ModalHeader toggle={toggleModalEdit}>Upravit soutěž</ModalHeader>
                      <ModalBody>
                        <FormGroup>
                          <Label for="id">ID</Label>
                          <Input style={{ color: 'black' }} type="number" name="id" id="id" value={formDataEdit.id} onChange={handleInputChangeEdit} />
                        </FormGroup>
                        <FormGroup>
                          <Label for="year">Rok</Label>
                          <Input style={{ color: 'black' }} type="number" name="year" id="year" value={formDataEdit.year} onChange={handleInputChangeEdit} />
                        </FormGroup>
                        <FormGroup>
                          <Label for="date">Datum</Label>
                          <Input style={{ color: 'black' }} type="date" name="date" id="date" value={formDataEdit.date} onChange={handleInputChangeEdit} />
                        </FormGroup>
                        <FormGroup>
                          <Label for="startTime">Začátek</Label>
                          <Input style={{ color: 'black' }} type="time" name="startTime" id="startTime" value={formDataEdit.startTime} onChange={handleInputChangeEdit} />
                        </FormGroup>
                        <FormGroup>
                          <Label for="endTime">Konec</Label>
                          <Input style={{ color: 'black' }} type="time" name="endTime" id="endTime" value={formDataEdit.endTime} onChange={handleInputChangeEdit} />
                        </FormGroup>
                      </ModalBody>
                      <ModalFooter>
                        <Button style={{ margin: '10px' }} color="primary" onClick={handleEditSubmit}>Potvrdit</Button>
                        <Button style={{ margin: '10px' }} color="secondary" onClick={toggleModalEdit}>Zavřít</Button>
                      </ModalFooter>
                    </Modal>

                    <Button color="secondary" size="sm" onClick={() => viewParticipants(competition.year)}>Zobrazit účastníky</Button>



                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col>
            <h4>Nejsou vytvořeny žádné soutěže.</h4>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default CompetitionManagement;
