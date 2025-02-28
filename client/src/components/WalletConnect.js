import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Alert } from 'react-bootstrap';

const WalletConnect = ({ onConnect, isConnected, userAddress }) => {
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        onConnect(address, provider, signer);
      } catch (err) {
        setError('Failed to connect wallet');
      }
    } else {
      setError('MetaMask is not installed!');
    }
  };

  return (
    <div>
      <h2>Connect Your Wallet</h2>
      {isConnected ? (
        <Alert variant="success">Connected: {userAddress}</Alert>
      ) : (
        <Button onClick={connectWallet} className="mb-3">
          Connect Wallet
        </Button>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default WalletConnect;