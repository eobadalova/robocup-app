/**
* Renders the PlaygroundManagement component, which provides functionality for managing playgrounds.
* 
* The component fetches a list of playgrounds and disciplines from the server, and allows the user to
* add new playgrounds. It also provides the ability to remove existing playgrounds.
* 
*/
import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
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
    Row,
    Col,
    Table,
    CardFooter
} from 'reactstrap';

function PlaygroundManagement() {
    const [playgrounds, setPlaygrounds] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [playground, setPlayground] = useState({
        name: '',
        number: '',
        disciplineID: ''
    });

    useEffect(() => {
        fetchPlaygrounds();
        fetchDisciplines();
    }, []);

    const toggleModal = () => setModal(!modal);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleInputChange = (e) => {
        setPlayground({ ...playground, [e.target.name]: e.target.value });
    };

    const handleRemovePlayground = async (playgroundId) => {
        if (!playgroundId) {
            alert("Playground ID is required for removal.");
            return;
        }

        if (!window.confirm("Jste si jisti, že chcete odstranit toto hřiště?")) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/playground/remove?id=${playgroundId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok && response.data.type !== 'ERROR') {
                alert("Hřiště bylo úspěšně odstraněno.");
                fetchPlaygrounds();
            } else {
                const data = await response.json();
                alert(`Failed to remove playground: ${data.message || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error('Error removing playground:', error);
            alert(`Error while removing playground: ${error.message || 'Failed to communicate with server'}`);
        }
    };

    const fetchPlaygrounds = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/playground/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = await response.json();
            if (response.ok && data.type === 'RESPONSE') {
                setPlaygrounds(data.data);
            } else {
                setError('Failed to fetch playgrounds: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            setError('Error fetching playgrounds: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDisciplines = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/discipline/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = await response.json();
            if (response.ok && data.type === 'RESPONSE') {
                setDisciplines(data.data);
            } else {
                console.error('Failed to fetch disciplines:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching disciplines:', error.message);
        }
    };


    const handleSubmit = async () => {
        if (!playground.name || !playground.number || !playground.disciplineID) {
            alert('All fields are required!');
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/playground/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(playground)
            });
            if (response.ok) {
                alert('Hriste bylo pridano!');
                toggleModal();
                fetchPlaygrounds();
            } else {
                const data = await response.json();
                alert(`Failed to add playground: ${data.message}`);
            }
        } catch (error) {
            alert(`Error adding playground: ${error.message}`);
        }
    };

    const roles = localStorage.getItem('roles');
    const canAddPlayground = roles && (roles.includes('ADMIN') || roles.includes('LEADER') || roles.includes('ASSISTANT'));

    return (
        <>
            <div className="content">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Přehled hřišť</CardTitle>
                                {canAddPlayground && (
                                    <Button color="primary" onClick={toggleModal}>Přidat hřiště</Button>
                                )}
                            </CardHeader>
                            <CardBody>
                                <Card>
                                    <CardHeader>
                                        <h3 className="mb-0">Hřiště</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            {playgrounds.map((playground) => (
                                                <Col md="4" key={playground.id}>
                                                    <Card className="card-playground" style={{ border: '1px solid lightgray' }}>
                                                        <CardBody>
                                                            <h4>{playground.name}</h4>
                                                            <p>Číslo: {playground.number}</p>
                                                            <p>Disciplína: {playground.disciplineName}</p>
                                                        </CardBody>
                                                        <CardFooter>
                                                            <Button color="danger" onClick={() => handleRemovePlayground(playground.id)} className="btn-icon btn-simple">
                                                                <i className="tim-icons icon-trash-simple"></i>
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </CardBody>

                                </Card>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Přidat nové hřiště</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>

                            <Label for="name">Název</Label>
                            <Input type="text" name="name" id="name" placeholder="Zadejte název hřiště" value={playground.name} onChange={handleInputChange} style={{ color: 'black' }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="number">Číslo</Label>
                            <Input type="number" name="number" id="number" placeholder="Zadejte unikátní číslo" value={playground.number} onChange={handleInputChange} style={{ color: 'black' }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="disciplineID">Disciplína</Label>
                            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                <DropdownToggle caret>
                                    {playground.disciplineID || 'Vyberte disciplínu'}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {disciplines.map((d) => (
                                        <DropdownItem key={d.id} onClick={() => setPlayground({ ...playground, disciplineID: d.id })}>
                                            {d.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit} style={{ margin: '10px' }}>Odeslat</Button>
                    <Button color="secondary" onClick={toggleModal} style={{ margin: '10px' }}>Zrušit</Button>

                </ModalFooter>
            </Modal>
        </>
    );
}

export default PlaygroundManagement;
