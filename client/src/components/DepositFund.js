import React, { useEffect, useState } from 'react';
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
  const [ethBalance, setEthBalance] = useState('');
  const [depositedEth, setDepositedEth] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const depositFund = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Metamask not found');
      }

      setLoading(true);
      setResult('');

      // Convert amount to Wei (since ETH is in Wei)
      const value = ethers.utils.parseEther(amount);

      // Connect to Metamask
      const signer = await provider.getSigner();

      const ethBalance = await provider.getBalance(window.ethereum.selectedAddress);
      if (ethBalance.lt(value)) {
        throw new Error('Insufficient funds in wallet address');
      }

      // Connect to the smart contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call deposit function (assuming it's payable)
      const tx = await contract.depositFunds({ value });
      provider.once(tx.hash, (receipt) => {
          console.log(receipt);
          setResult(`Deposit ${amount} ETH successful!`);
      });
      setLoading(false);
      setShow(false);
    } catch (error) {
      console.error(error);
      setShow(false);
      setResult('Error: ' + (error.message || 'Transaction failed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const address = window.ethereum.selectedAddress
    const getEthBalance = async () => {
      const balance = await provider.getBalance(address);
      setEthBalance(ethers.utils.formatEther(balance));
    };
    const getDepositedEth = async () => {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const balance = await contract.balances(address);
      setDepositedEth(ethers.utils.formatEther(balance));
    }
    getEthBalance();
    getDepositedEth();
  }, []);

  return (
    <div className='card mb-3'>
      <div className='card-body'>
        <h2>Deposit Fund</h2>
        <span>ETH Balance: {ethBalance} ETH</span><br/>
        <span>Deposited Fund: {depositedEth} ETH</span><br/>
        <Button variant="primary" onClick={handleShow} className='mt-3'>
          Deposit Fund
        </Button>
        {result && <Alert variant={result.includes('Error') ? 'danger' : 'success'} className='mt-3'>{result}</Alert>}
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
                  type="text" 
                  placeholder="Enter amount" 
                  value={amount} 
                  onChange={(e) => { 
                    if (isNaN(Number(e.target.value))) {
                      e.target.value = '';
                      return;
                    }
                    setAmount(e.target.value) 
                  }} 
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
