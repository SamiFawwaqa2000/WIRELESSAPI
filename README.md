# Wireless Network Design Calculator

A web-based application for wireless and mobile network design calculations with AI-powered explanations. This application supports four key scenarios:

1. Wireless Communication Systems
2. OFDM Systems
3. Link Budget Calculations
4. Cellular System Design

## Features

- Interactive web interface with tabbed navigation
- Real-time calculations for various wireless communication scenarios
- AI-powered explanations of results using OpenAI's GPT model
- Responsive design that works on desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd wireless-communication-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Select the desired calculation scenario from the tabs
2. Enter the required parameters in the form
3. Click "Compute" to see the results
4. Read the AI-generated explanation of the results

## Scenarios

### 1. Wireless Communication System
- Calculate data rates at various stages of the communication system
- Includes sampling, quantization, source encoding, channel encoding, and more

### 2. OFDM Systems
- Calculate data rates for resource elements and OFDM symbols
- Compute maximum transmission capacity and spectral efficiency

### 3. Link Budget Calculation
- Calculate path loss and received signal strength
- Consider transmitter and receiver specifications

### 4. Cellular System Design
- Design cellular networks based on user parameters
- Calculate coverage area and system capacity

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 