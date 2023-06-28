# Vulpo Server

Vulpo Server is a backend server application that provides API endpoints and functionality for the Vulpo web application.

## Features

- Managing beacons and users
- Store and retrieve data from a json file
- Real-time notifications using websockets

## Technologies Used

- Node.js
- WebSocket
- fs

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Arthur-MONNET/WS-server.git
```

2. Navigate to the project directory:

```bash
cd WS-server
```

3. Install the dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5.The server should be running on `ws://127.0.0.1:8080`.

## Exposing the Server with Ngrok (optional)

If you want to expose your server to the internet for testing or demonstration purposes, you can use ngrok. Ngrok provides a public URL with HTTPS support for your locally hosted server. Follow the steps below to use ngrok:

1. Start your Vulpo server:

```bash
npm start
```

2. In a separate terminal window, navigate to the directory where ngrok is installed.

3. Run the following command to expose your local server:

```bash
./ngrok http 8080
```

**Note:** Ngrok provides a randomly generated subdomain and a temporary public URL ( 2 hours).


## API Documentation

API documentation and usage examples can be found in the [API Documentation](./API_DOCUMENTATION.md) file.

## Contributing

Contributions are welcome! If you find any issues or would like to propose enhancements, please submit an issue or a pull request.