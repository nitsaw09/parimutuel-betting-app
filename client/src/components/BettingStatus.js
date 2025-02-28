import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import axios from "axios";

const BettingStatus = () => {
  const [data, setData] = useState({
    status: "N/A",
    totalBets: 0,
    poolA: 0,
    poolB: 0
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/rounds/status"); 
        setData(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchStatus();
  }, []);

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title className="text-primary">Betting Status</Card.Title>
          <Card.Text>
            <strong>Status:</strong> {data.status}
          </Card.Text>
          <Card.Text>
            <strong>Total Bets:</strong> {data.totalBets}
          </Card.Text>
          <Card.Text>
            <strong>Pool A:</strong> {data.poolA} ETH
          </Card.Text>
          <Card.Text>
            <strong>Pool B:</strong> {data.poolB} ETH
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BettingStatus;
