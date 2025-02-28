import React, { useState } from 'react';
import { Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

const CloseBet = ({ isAdmin }) => {
  const [result, setResult] = useState('');
  const [show, setShow] = useState(false); // Modal visibility state

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const closeBet = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/rounds/close');
      setResult(response.data.message);
      handleClose(); // Close modal after closing bet
    } catch (error) {
      setResult(error.response.data.message || 'Error closing bet');
      handleClose();
    }
  };

  return (
    <div>
    {isAdmin && (<div className="card mb-3">
      <div className="card-body">
        <h2>Close the Current Bet</h2>
        <Button variant="primary" onClick={handleShow}>
          Close Bet
        </Button>

        {result && <Alert variant={result.includes('Error') ? 'danger' : 'success'}>{result}</Alert>}

        {/* Bootstrap Modal for Placing Bet */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to close bet?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={closeBet}>
              Close Bet
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>)
    }
    </div>
  );
};

export default CloseBet;
