import React, { useEffect, useState } from 'react';
import { Button, Form, Alert, Modal, Table } from 'react-bootstrap';
import axios from 'axios';

const BetSection = ({ userAddress }) => {
  const [betOutcome, setBetOutcome] = useState('1');
  const [betAmount, setBetAmount] = useState('');
  const [betResult, setBetResult] = useState('');
  const [bets, setBets] = useState([]);
  const [show, setShow] = useState(false); // Modal visibility state

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const outcomes = {
    1: "Outcome 1",
    2: "Outcome 2"
  };

  const placeBet = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/bets/place-bet', {
        walletAddress: userAddress,
        outcome: betOutcome,
        amount: betAmount
      });
      setBetResult(response.data.message);
      getBets();
      handleClose(); // Close modal after placing bet
    } catch (error) {
      setBetResult(error.response.data.message || 'Error placing bet');
    }
  };

  const getBets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/bets/${userAddress}`);
      setBets(response.data.data);
    } catch (error) {
      setBetResult('Error loading bets');
    }
  };

  useEffect(() => {
    getBets();
  }, []);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2>Place a Bet</h2>
        <Button variant="primary" onClick={handleShow}>
          Place Bet
        </Button>

        {/* Bootstrap Modal for Placing Bet */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Place Your Bet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {betResult && <Alert variant="info">{betResult}</Alert>}
            <Form>
              <Form.Group controlId="formBetAmount">
                <Form.Label>Bet Amount (ETH)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                />
              </Form.Group>
              <Form.Check
                type="radio"
                name="outcome"
                label="Outcome 1"
                value="1"
                checked={betOutcome === '1'}
                onChange={() => setBetOutcome('1')}
                className='mb-1'
              />
              <Form.Check
                type="radio"
                name="outcome"
                label="Outcome 2"
                value="2"
                checked={betOutcome === '2'}
                onChange={() => setBetOutcome('2')}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={placeBet}>
              Place Bet
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Display Bets */}
        {bets.length > 0 && (
          <div className="mt-4">
            <h2>My Bets</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Outcome</th>
                  <th>Amount (ETH)</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet) => (
                  <tr key={bet._id}>
                    <td>{outcomes[bet.outcome]}</td>
                    <td>{bet.amount}</td>
                    <td>{new Date(bet.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetSection;
