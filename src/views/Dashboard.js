import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, CardFooter } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import abbLogo from '../assets/img/abb-logo.png';
import zfLogo from '../assets/img/ZF-logo.png';
import nxpLogo from '../assets/img/nxp-logo.png';
import blogicLogo from '../assets/img/blogic-logo.png';
import continentalLogo from '../assets/img/continental-logo.jpeg';
import kyndrylLogo from '../assets/img/kyndryl-logo.png';
import ruzovkaLogo from '../assets/img/ruzovka-logo.jpeg';
import nestleLogo from '../assets/img/nestle-logo.png';
import itcLogo from '../assets/img/itc-logo.jpeg';
import totLogo from '../assets/img/tot-logo.png';

function Dashboard() {
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}api/competition/all`)
            .then(response => response.json())
            .then(data => {
                if (data.type === 'RESPONSE') {
                    const futureCompetitions = data.data
                        .filter(comp => comp.year >= currentYear);
                    setCompetitions(futureCompetitions);
                }
            })
            .catch(error => console.error('Error fetching competition data:', error));
    }, []);

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <div className="content">
            <Row>
                <Col md="12">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h1">Vítejte na stránce Robogames!</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p>Robogames je soutěžní akce, kterou pořádá Fakulta aplikované informatiky Univerzity Tomáše Bati ve Zlíně od roku 2017.</p>
                            <p>Soutěž probíhá na půdě Fakulty aplikované informatiky.</p>
                            <p>Soutěž je určena pro studenty středních a vysokých škol, žáky základních škol, členy robotických kroužků i jinak neorganizovaným nadšencům z řad široké veřejnosti.</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                {competitions.map((comp, index) => (
                    <Col md="6" key={index} style={{ marginBottom: '20px' }}>
                        <Card>
                            <CardHeader className="bg-primary">
                                <CardTitle tag="h4">Nadcházející Soutěž - ROBOGAMES {comp.year}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <h4 style={{ color: 'red', fontSize: '25px' }}>Datum: {formatDate(comp.date)}</h4>

                                <p>Začátek: {comp.startTime}</p>
                                <p>Konec: {comp.endTime}</p>
                            </CardBody>
                            {!comp.started && (
                                <CardFooter>
                                    <Button color="success" onClick={() => navigate('/admin/my-team')}>
                                        Registrovat
                                    </Button>
                                </CardFooter>
                            )}
                            {comp.started && (
                                <CardFooter>
                                    <Button color="primary" onClick={() => navigate('/admin/competition-results')}>
                                        Výsledky
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row>
                <Col md="12">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Naši sponzoři</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="6" className="text-center"><img src={abbLogo} alt="ABB" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={zfLogo} alt="ZF" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={nxpLogo} alt="NXP" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={blogicLogo} alt="BLogic" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={continentalLogo} alt="Continental" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={kyndrylLogo} alt="Kyndryl" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={ruzovkaLogo} alt="Ruzovka" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={nestleLogo} alt="Nestle" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={itcLogo} alt="ITC" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>
                                <Col md="6" className="text-center"><img src={totLogo} alt="TOT" style={{ maxWidth: '250px', marginBottom: '20px' }} /></Col>

                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
