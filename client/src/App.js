import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import WalletConnect from './components/WalletConnect';
import BetSection from './components/BetSection';
import DepositFund from './components/DepositFund';
import CloseBet from './components/CloseBet';
import { ethers } from 'ethers';
import contractABI from './abis/PariMutuelBetting.json'; 
import config from './config/config';
import ResolveOutcome from './components/ResolveOutcome';
import BettingStatus from './components/BettingStatus';

const contractAddress = config.contractAddress;

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  const checkIsAdmin = async () => {
    if (!window.ethereum) {
      throw new Error('Metamask not found');
    }

    // Connect to Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    // Connect to the smart contract
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const owner = await contract.owner();

    return owner.toLowerCase() === window.ethereum.selectedAddress.toLowerCase();
  }
  
  const handleConnect = (address) => {
    setConnected(true);
    setUserAddress(address);
  };

  useEffect(() => { 

    checkIsAdmin().then((isAdmin) => {
      if (isAdmin) {
        setIsAdmin(true);
      }
    })
   }, []);

  return (
    <Container className="mt-5">
      <h1>Escrow Betting App</h1>
      <WalletConnect onConnect={handleConnect} isConnected={isConnected} userAddress={userAddress} />
      {isConnected && (
        <div class="row">
          <div className='col-md-3'><BettingStatus /></div>
          <div className='col-md-5'><BetSection userAddress={userAddress} /></div>
          <div className='col-md-4'>
            <DepositFund userAddress={userAddress} />
            <CloseBet isAdmin={isAdmin} />
            <ResolveOutcome isAdmin={isAdmin} />
          </div>
        </div>
      )}
    </Container>
  );
}

export default App;