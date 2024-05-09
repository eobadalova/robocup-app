/**
* The `MatchCreationPage` component is responsible for managing the creation and display of matches for a specific playground.
* It fetches the playground details, robots, and matches, and provides functionality to create new matches, remove matches, and submit scores.
*/
import React, { useState, useEffect } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Card, CardHeader, CardBody, Row, Col, CardTitle, CardText, Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Table
} from 'reactstrap';
import { useSearchParams } from 'react-router-dom';

function MatchCreationPage() {
    const [searchParams] = useSearchParams();
    const playgroundId = searchParams.get('id');
    const year = searchParams.get('year');
    const [isSum, setIsSum] = useState(false);
    const [robots, setRobots] = useState([]);
    const [selectedRobots, setSelectedRobots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [playground, setPlayground] = useState({});
    const [matches, setMatches] = useState([]);
    const [selectedMatchId, setSelectedMatchId] = useState(null);
    const [score, setScore] = useState('');
    const [scoreModal, setScoreModal] = useState(false);




    useEffect(() => {
        fetchMatchesForPlayground(playgroundId);
    }, [playgroundId]);

    useEffect(() => {
        fetchPlaygroundDetails();
        fetchRobots();
    }, [year, playgroundId]);

    const fetchPlaygroundDetails = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/playground/all`);
        const data = await response.json();
        if (response.ok && data.type === 'RESPONSE') {
            const foundPlayground = data.data.find(p => p.id.toString() === playgroundId);
            if (foundPlayground) {
                setPlayground(foundPlayground);
                checkIfSumDiscipline(foundPlayground.disciplineID);
            }
        }
    };

    const checkIfSumDiscipline = async (disciplineId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/discipline/all`);
        const data = await response.json();
        if (response.ok && data.type === 'RESPONSE') {
            const discipline = data.data.find(d => d.id === disciplineId);
            setIsSum(discipline.scoreAggregation.name === 'SUM');
        }
    };


    const handleScoreSubmit = async () => {
        const scoreValue = parseFloat(score);
        const apiUrl = `${process.env.REACT_APP_API_URL}api/match/writeScore?id=${selectedMatchId}&score=${scoreValue}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok && data.type === 'RESPONSE') {
                alert('Score successfully recorded.');
                setScoreModal(false); // Close the modal

                window.location.reload();
            } else {
                throw new Error(data.data || 'Unknown error occurred');
            }
        } catch (error) {
            alert(`Error submitting score: ${error.message || 'Failed to communicate with the server'}`);
        }
    };


    const fetchRobots = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/robot/allConfirmed?year=${year}`);
        const data = await response.json();
        if (response.ok && data.type === 'RESPONSE') {
            setRobots(data.data);
        }
    };

    const toggleModal = () => setShowModal(!showModal);


    const handleRemoveAllGroupMatches = async (groupId) => {
        const apiUrl = `${process.env.REACT_APP_API_URL}api/match/removeAll?groupID=${groupId}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok && data.type === 'RESPONSE') {
                alert('All matches successfully removed.');

            } else {
                throw new Error(data.data || 'Failed to remove matches');
            }
        } catch (error) {
            alert(`Error removing matches: ${error.message || 'Failed to communicate with the server'}`);
        }
    };

    const handleRemoveMatch = async (matchId) => {
        
        if (window.confirm("Are you sure you want to remove this match?")) {
            const apiUrl = `${process.env.REACT_APP_API_URL}api/match/remove?id=${matchId}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'DELETE', 
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (response.ok && data.type === 'RESPONSE') {
                    alert('Match successfully removed.');
                    window.location.reload();

                } else {
                    throw new Error(data.data || 'Failed to remove match');
                }
            } catch (error) {
                alert(`Error removing match: ${error.message || 'Failed to communicate with the server'}`);
            }
        }
    };




    const fetchMatchesForPlayground = async (playgroundId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}api/playground/getMatches?id=${playgroundId}`);
            const data = await response.json();
            if (response.ok && data.type === 'RESPONSE') {
                setMatches(data.data);
            } else {
                console.error('Failed to fetch matches:', data);
                alert('Failed to fetch matches: ' + (data.data || 'Unknown error occurred'));
            }
        } catch (error) {
            console.error('Error fetching matches:', error);
            alert('An error occurred while fetching matches: ' + (error.message || 'Failed to communicate with the server'));
        }
    };

    const handleMatchCreation = async () => {
        const apiUrl = isSum ? `${process.env.REACT_APP_API_URL}module/orderManagement/generateMatches` : `${process.env.REACT_APP_API_URL}api/match/create`;
        const method = isSum ? 'POST' : 'POST';
        const body = isSum ? { playgroundID: playgroundId, robots: selectedRobots, year } : { robotID: selectedRobots[0], playgroundID: playgroundId, groupID: -1 };

        try {
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (response.ok && data.type === 'RESPONSE') {
                alert('Matches successfully created.');
                window.location.reload();
            } else {
                alert(`Error: ${data.data}`);
            }
        } catch (error) {
            alert(`Error creating matches: ${error.message}`);
        }
        toggleModal();
    };

    const filteredRobots = robots.filter(robot => robot.disciplineID === playground.disciplineID);


    const groupedMatches = matches.reduce((acc, match) => {
        acc[match.groupID] = acc[match.groupID] || [];
        acc[match.groupID].push(match);
        return acc;
    }, {});
    return (
        <div className="content">
            <Card>
                <CardHeader>
                    <Button style={{ marginBottom: '15px' }} color="primary" onClick={toggleModal}>
                        {isSum ? 'Vygenerovat zápasy (každý s každým)' : 'Nový pokus'}
                    </Button>
                </CardHeader>
                <Modal isOpen={showModal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>{isSum ? 'Vygenerovat zápasy (každý s každým)' : 'Nový pokus'}</ModalHeader>
                    <ModalBody>
                        <h4 style={{ color: 'black' }}>Studenti a dospělí (HIGH_AGE_CATEGORY)</h4>

                        {filteredRobots.filter(robot => robot.category === 'HIGH_AGE_CATEGORY').map(robot => (
                            <FormGroup check key={robot.id}>
                                <Label check>
                                    <Input
                                        type="checkbox"
                                        value={robot.id}
                                        onChange={(e) => {
                                            const newSelection = parseInt(e.target.value);
                                            if (selectedRobots.includes(newSelection)) {
                                                setSelectedRobots(selectedRobots.filter(id => id !== newSelection));
                                            } else {
                                                setSelectedRobots([...selectedRobots, newSelection]);
                                            }
                                        }}
                                        checked={selectedRobots.includes(robot.id)}
                                    />
                                    <span className="form-check-sign">
                                        <span className="check" />
                                    </span>
                                    {robot.name} - {robot.teamName}
                                </Label>
                            </FormGroup>
                        ))}
                        <hr></hr>

                        <h4 style={{ color: 'black' }}>Žáci základní školy (LOW_AGE_CATEGORY)</h4>

                        {filteredRobots.filter(robot => robot.category === 'LOW_AGE_CATEGORY').map(robot => (
                            <FormGroup check key={robot.id}>
                                <Label check>
                                    <Input
                                        type="checkbox"
                                        value={robot.id}
                                        onChange={(e) => {
                                            const newSelection = parseInt(e.target.value);
                                            if (selectedRobots.includes(newSelection)) {
                                                setSelectedRobots(selectedRobots.filter(id => id !== newSelection));
                                            } else {
                                                setSelectedRobots([...selectedRobots, newSelection]);
                                            }
                                        }}
                                        checked={selectedRobots.includes(robot.id)}
                                    />
                                    <span className="form-check-sign">
                                        <span className="check" />
                                    </span>
                                    {robot.name} - {robot.teamName}
                                </Label>
                            </FormGroup>
                        ))}
                    </ModalBody>


                    <ModalFooter>
                        <Button color="primary" onClick={handleMatchCreation} style={{ margin: '10px' }}>Vytvořit</Button>
                        <Button color="secondary" onClick={toggleModal} style={{ margin: '10px' }}>Zrušit</Button>

                    </ModalFooter>
                </Modal>
            </Card>




            <Row>
                <Col xs="12">
                    {isSum ? (
                        Object.entries(matches.reduce((acc, match) => {
                            acc[match.groupID] = acc[match.groupID] || [];
                            acc[match.groupID].push(match);
                            return acc;
                        }, {})).map(([group, groupMatches], index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle tag="h4">Zápas - Skupina {index + 1}


                                    </CardTitle>

                                </CardHeader>
                                <CardBody>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>State</th>
                                                <th>Score</th>
                                                <th>Robot Name</th>
                                                <th>Robot Number</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupMatches.map(match => (

                                                <tr key={match.id}>
                                                    <td >{match.id}</td>

                                                    <td>
                                                        <span style={{ fontWeight: 'bold', color: match.state.name === 'DONE' ? 'green' : (match.state.name === 'WAITING' ? 'gold' : 'black') }}>
                                                            {match.state.name === 'DONE' ? 'Dokončeno' : (match.state.name === 'WAITING' ? 'Čeká na vyhodnocení' : match.state.name)}
                                                        </span>
                                                    </td>


                                                    <td>{match.score}</td>
                                                    <td>{match.robotName}</td>
                                                    <td>{match.robotNumber}</td>
                                                    <Button color="info" onClick={() => { setSelectedMatchId(match.id); setScoreModal(true); }}>Vyhodnotit</Button>
                                                    <Button style={{ margin: '20px' }} color="danger" onClick={() => handleRemoveAllGroupMatches(match.groupID)} className="btn-icon btn-simple p-2">
                                                        <i className="tim-icons icon-trash-simple"></i>
                                                    </Button>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </CardBody>
                                <CardFooter className="d-flex justify-content-end">

                                </CardFooter>
                            </Card>

                        ))
                    ) : (
                        matches.map((match, index) => (
                            <Card key={match.id}>
                                <CardHeader>
                                    <CardTitle tag="h4">Zápas č. {index + 1}</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>State</th>
                                                <th>Score</th>
                                                <th>Robot Name</th>
                                                <th>Robot Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{match.id}</td>
                                                <td>
                                                    <span style={{ fontWeight: 'bold', color: match.state.name === 'DONE' ? 'green' : (match.state.name === 'WAITING' ? 'yellow' : 'black') }}>
                                                        {match.state.name === 'DONE' ? 'Dokončeno' : (match.state.name === 'WAITING' ? 'Čeká na vyhodnocení' : match.state.name)}
                                                    </span>
                                                </td>
                                                <td>{match.score}</td>
                                                <td>{match.robotName}</td>
                                                <td>{match.robotNumber}</td>
                                                <Button color="info" onClick={() => { setSelectedMatchId(match.id); setScoreModal(true); }}>Vyhodnotit</Button>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                                <CardFooter className="d-flex justify-content-end">
                                    <Button color="danger" onClick={() => handleRemoveMatch(match.id)} className="btn-icon btn-simple">
                                        <i className="tim-icons icon-trash-simple"></i>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>

            <Modal isOpen={scoreModal} toggle={() => setScoreModal(false)}>
                <ModalHeader toggle={() => setScoreModal(false)}>Zadejte skóre</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="scoreInput">Skóre</Label>
                        <Input style={{ color: 'black' }} type="number" id="scoreInput" value={score} onChange={(e) => setScore(e.target.value)} placeholder="U robosumo = 1 vyhrál, 0 = prohrál, sledovač čáry: 8:14" />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleScoreSubmit} style={{ margin: '10px' }}>Potvrdit</Button>
                    <Button color="secondary" onClick={() => setScoreModal(false)} style={{ margin: '10px' }}>Zavřít</Button>

                </ModalFooter>
            </Modal>






        </div>
    );
}

export default MatchCreationPage;
