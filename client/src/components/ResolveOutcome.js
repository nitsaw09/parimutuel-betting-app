import React, { useState } from 'react';
import { Button, Form, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

const ResolveOutcome = ({ isAdmin }) => {
  const [winningOutcome, setWinningOutCome] = useState(0);
  const [result, setResult] = useState('');
  const [show, setShow] = useState(false); 

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resolveOutcome = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/rounds/resolve-outcome', {
        winningOutcome
      });
      setResult(response.data.message);
      handleClose(); // Close modal after placing bet
    } catch (error) {
      setResult(error.response.data.message || 'Error in resolving outcome');
    }
  };

  return (
    <div className='mt-3'>
    { isAdmin && (<div className="card">
      <div className="card-body">
        <h2>Resolve outcome for winning</h2>
        <Button variant="primary" onClick={handleShow}>
          Resolve Outcome
        </Button>

        {/* Bootstrap Modal for Placing Bet */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Select the wining outcome to resolve </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {result && <Alert variant="info">{result}</Alert>}
            <Form>
              <Form.Check
                type="radio"
                name="outcome"
                label="Outcome 1"
                value="1"
                checked={winningOutcome === '1'}
                onChange={() => setWinningOutCome('1')}
                className='mb-1'
              />
              <Form.Check
                type="radio"
                name="outcome"
                label="Outcome 2"
                value="2"
                checked={winningOutcome === '2'}
                onChange={() => setWinningOutCome('2')}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={resolveOutcome}>
              Resolve Outcome
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>)}
    </div>
  );
};

export default ResolveOutcome;
