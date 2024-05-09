import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

function Contact() {
  return (
<div className="content">
<Row>
<Col md="6">
<Card style={{ height: '300px'}}>
<CardHeader>
<CardTitle tag="h4">Hlavní pořadatel soutěže</CardTitle>
<hr></hr>
</CardHeader>
<CardBody>
<h4 style={{ fontWeight: 'bold' }}>Ing. Tomáš Dulík, Ph.D.</h4>

<p>Univerzita Tomáše Bati ve Zlíně</p>
<p>Fakulta aplikované informatiky</p>
<p>Ústav informatiky a umělé inteligence</p>
<p>Nad Stráněmi 4511, 76005 Zlín</p>
<p>tel. +420 57 603 5187</p>
<p>mobil: +420 774 313 854</p>
</CardBody>
</Card>
</Col>
<Col md="6">
<Card style={{ height: '300px' }}>
<CardHeader>
<CardTitle tag="h4">Organizační záležitosti</CardTitle>
<hr></hr>
</CardHeader>
<CardBody>
<h4 style={{ fontWeight: 'bold' }}>doc. Ing. Jiří Vojtěšek, Ph.D.</h4>
<p>Děkan FAI UTB ve Zlíně</p>
<p>Fakulta aplikované informatiky</p>
<p>Univerzita Tomáše Bati ve Zlíně</p>
<p>Nad Stráněmi 4511, 76005 Zlín</p>
<p>mobil: +420 733 599 960</p>
</CardBody>
</Card>
</Col>
</Row>
</div>

  );
}

export default Contact;
