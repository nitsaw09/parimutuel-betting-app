import React, { useState } from 'react';
import { Button, Form, Alert, Modal } from 'react-bootstrap';
import { ethers } from 'ethers';
import contractABI from '../abis/PariMutuelBetting.json'; 
import config from '../config/config';

const contractAddress = config.contractAddress;

const DepositFund = () => {
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [show, setShow] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const depositFund = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Metamask not found');
      }

      setLoading(true);
      setResult('');

      // Connect to Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();

      // Connect to the smart contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Convert amount to Wei (since ETH is in Wei)
      const value = ethers.utils.parseEther(amount);

      // Call deposit function (assuming it's payable)
      const tx = await contract.deposit({ value });
      provider.once(tx.hash, (receipt) => {
          console.log(receipt);
          setResult(`Deposit ${amount} ETH successful!`);
      });
      setLoading(false);
      setShow(false);
    } catch (error) {
      console.error(error);
      setResult('Error: ' + (error.message || 'Transaction failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='card mb-3'>
      <div className='card-body'>
        <h2>Deposit Fund</h2>
        <Button variant="primary" onClick={handleShow}>
          Deposit Fund
        </Button>
        {result && <Alert variant={result.includes('Error') ? 'danger' : 'success'}>{result}</Alert>}
        {/* Bootstrap Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Deposit Funds</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFundAmount">
                <Form.Label>Fund Amount (ETH)</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Enter amount" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Close
            </Button>
            <Button variant="primary" onClick={depositFund} disabled={loading}>
              {loading ? 'Processing...' : 'Deposit'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DepositFund;
