# Pari Mutuel Betting

## Description
This project is a Pari Mutuel Betting application that allows users to place bets on various outcomes. It consists of a client-side React application and a server-side Node.js application.

# Perquisite
- node.js 18+
- mongoDB

# Escrow Betting Contract
- contract: https://sepolia.etherscan.io/address/0x6E858737Ed8C34e66840C750C41DF24C9F3E3C4b

## Installation
To install the dependencies for both the client and server, run the following commands:

```bash
# concurrent Install dependencies from root
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

# projects stepup
- create .env file in server folder or at root
- copy the environment variable of .env.example in new .env
- update the .env variables with new values
- run the following command to start the server and client

## Usage
To run the project, use the following commands:

```bash
# Run the application concurrent on local
npm run dev

# Start the server
cd server
npm start

# Start the client
cd ../client
npm start
```

## Scripts
### Root Scripts
- `npm run dev`: Runs the server and client in development mode.

### Server Scripts
- `npm start`: Starts the server.
- `npm run dev`: Runs the server in development mode.

### Client Scripts
- `npm start`: Starts the React application.
- `npm build`: Builds the application for production.
