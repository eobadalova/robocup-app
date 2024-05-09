import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

function AllTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token není poskytnut");
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/team/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await response.json();
        if (response.ok && json.type === 'RESPONSE') {
          setTeams(json.data); 
        } else {
          console.error("Nepodařilo se načíst týmy nebo data nejsou ve správném formátu", json);
        }
      } catch (error) {
        console.error("Chyba při načítání týmů:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Všechny týmy</CardTitle>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>ID</th>
                    <th>Název</th>
                    <th>ID vedoucího</th>
                    <th>Členové</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td>{team.id}</td>
                      <td>{team.name}</td>
                      <td>{team.leaderID}</td>
                      <td>
                        {team.memberNames.map(member => `${member.name} ${member.surname}`).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AllTeams;
