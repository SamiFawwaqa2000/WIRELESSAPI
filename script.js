// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

function showError(message) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `<strong style='color:red;'>Error: ${message}</strong>`;
}

// Wireless Communication System Calculations
document.getElementById("wireless-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const Fs = parseFloat(document.getElementById("fs").value);
    const bps = parseFloat(document.getElementById("bps").value);
    const Rs = parseFloat(document.getElementById("rs").value);
    const Rc = parseFloat(document.getElementById("rc").value);
    const overhead = parseFloat(document.getElementById("overhead").value);
    const modulation = parseFloat(document.getElementById("modulation").value);

    // Input validation
    if (Fs <= 0 || bps <= 0 || Rs <= 0 || Rc <= 0 || overhead <= 0 || modulation <= 0) {
        showError("All values must be positive and non-zero.");
        return;
    }
    if (Rc > 1 || Rs > 1 || overhead < 1) {
        showError("Channel code rate and compression ratio should be ≤ 1. Overhead factor should be ≥ 1.");
        return;
    }

    const rawRate = Fs * bps;
    const afterCompression = rawRate * Rs;
    const afterCoding = afterCompression / Rc;
    const afterOverhead = afterCoding * overhead;
    const symbolRate = afterOverhead / modulation;

    const resultData = { rawRate, afterCompression, afterCoding, afterOverhead, symbolRate };
    const inputData = { fs: Fs, bps, rs: Rs, rc: Rc, overhead, modulation };

    displayResults("wireless", resultData, inputData);
});

// OFDM Systems Calculations
document.getElementById("ofdm-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const subcarrierSpacing = parseFloat(document.getElementById("subcarrier-spacing").value) * 1000; // Convert to Hz
    const numSubcarriers = parseInt(document.getElementById("num-subcarriers").value);
    const modulation = parseInt(document.getElementById("ofdm-modulation").value);
    const numRB = parseInt(document.getElementById("num-rb").value);
    const channelBW = parseFloat(document.getElementById("channel-bw").value) * 1e6; // Convert to Hz

    // Input validation
    if (subcarrierSpacing <= 0 || numSubcarriers <= 0 || modulation <= 0 || numRB <= 0 || channelBW <= 0) {
        showError("All values must be positive and non-zero.");
        return;
    }

    const reDataRate = subcarrierSpacing * modulation;
    const symbolDuration = 1 / subcarrierSpacing;
    const symbolDataRate = reDataRate * numSubcarriers;
    const rbDataRate = symbolDataRate * 12; // 12 subcarriers per RB
    const maxCapacity = rbDataRate * numRB;
    const spectralEfficiency = maxCapacity / channelBW;

    const resultData = {
        reDataRate,
        symbolDuration,
        symbolDataRate,
        rbDataRate,
        maxCapacity,
        spectralEfficiency
    };
    const inputData = {
        subcarrierSpacing,
        numSubcarriers,
        modulation,
        numRB,
        channelBW
    };

    displayResults("ofdm", resultData, inputData);
});

// Link Budget Calculations
document.getElementById("link-budget-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const txPower = parseFloat(document.getElementById("tx-power").value);
    const txGain = parseFloat(document.getElementById("tx-gain").value);
    const rxGain = parseFloat(document.getElementById("rx-gain").value);
    const distance = parseFloat(document.getElementById("distance").value) * 1000; // Convert to meters
    const frequency = parseFloat(document.getElementById("frequency").value) * 1e6; // Convert to Hz

    // Input validation
    if (distance <= 0 || frequency <= 0) {
        showError("Distance and frequency must be positive and non-zero.");
        return;
    }

    // Free space path loss calculation
    const wavelength = 3e8 / frequency;
    const pathLoss = 20 * Math.log10(4 * Math.PI * distance / wavelength);
    
    // Received power calculation
    const rxPower = txPower + txGain + rxGain - pathLoss;

    const resultData = {
        pathLoss,
        rxPower,
        wavelength
    };
    const inputData = {
        txPower,
        txGain,
        rxGain,
        distance,
        frequency
    };

    displayResults("link-budget", resultData, inputData);
});

// Cellular System Design Calculations
document.getElementById("cellular-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const area = parseFloat(document.getElementById("area").value);
    const cellRadius = parseFloat(document.getElementById("cell-radius").value);
    const reuseFactor = parseInt(document.getElementById("reuse-factor").value);
    const channelBW = parseFloat(document.getElementById("cell-bw").value);
    const channelsPerCell = parseInt(document.getElementById("channels-per-cell").value);

    // Input validation
    if (area <= 0 || cellRadius <= 0 || reuseFactor <= 0 || channelBW <= 0 || channelsPerCell <= 0) {
        showError("All values must be positive and non-zero.");
        return;
    }

    // Calculate number of cells
    const cellArea = Math.PI * Math.pow(cellRadius, 2);
    const numCells = Math.ceil(area / cellArea);

    // Calculate total system capacity
    const totalChannels = channelsPerCell * numCells;
    const systemCapacity = totalChannels * channelBW;

    const resultData = {
        cellArea,
        numCells,
        totalChannels,
        systemCapacity
    };
    const inputData = {
        area,
        cellRadius,
        reuseFactor,
        channelBW,
        channelsPerCell
    };

    displayResults("cellular", resultData, inputData);
});

// Helper function to display results and get AI explanation
async function displayResults(scenario, resultData, inputData) {
    const outputDiv = document.getElementById("output");
    let resultsHTML = '<strong>Results:</strong><br>';

    switch(scenario) {
        case 'wireless':
            resultsHTML += `
                Raw Data Rate: ${resultData.rawRate.toFixed(2)} bps<br>
                After Compression: ${resultData.afterCompression.toFixed(2)} bps<br>
                After Channel Coding: ${resultData.afterCoding.toFixed(2)} bps<br>
                After Overhead: ${resultData.afterOverhead.toFixed(2)} bps<br>
                Required Symbol Rate: ${resultData.symbolRate.toFixed(2)} symbols/sec<br>
            `;
            break;
        case 'ofdm':
            resultsHTML += `
                Resource Element Data Rate: ${(resultData.reDataRate / 1000).toFixed(2)} kbps<br>
                Symbol Duration: ${(resultData.symbolDuration * 1000).toFixed(2)} ms<br>
                Symbol Data Rate: ${(resultData.symbolDataRate / 1e6).toFixed(2)} Mbps<br>
                Resource Block Data Rate: ${(resultData.rbDataRate / 1e6).toFixed(2)} Mbps<br>
                Maximum System Capacity: ${(resultData.maxCapacity / 1e6).toFixed(2)} Mbps<br>
                Spectral Efficiency: ${resultData.spectralEfficiency.toFixed(2)} bps/Hz<br>
            `;
            break;
        case 'link-budget':
            resultsHTML += `
                Path Loss: ${resultData.pathLoss.toFixed(2)} dB<br>
                Received Power: ${resultData.rxPower.toFixed(2)} dBm<br>
                Wavelength: ${(resultData.wavelength * 100).toFixed(2)} cm<br>
            `;
            break;
        case 'cellular':
            resultsHTML += `
                Cell Area: ${resultData.cellArea.toFixed(2)} km²<br>
                Number of Cells: ${resultData.numCells}<br>
                Total Channels: ${resultData.totalChannels}<br>
                System Capacity: ${(resultData.systemCapacity / 1e6).toFixed(2)} MHz<br>
            `;
            break;
    }

    resultsHTML += '<br><em>Generating explanation...</em>';
    outputDiv.innerHTML = resultsHTML;

    try {
        const explanation = await getExplanation(scenario, resultData, inputData);
        outputDiv.innerHTML += `
            <hr>
            <strong>AI Explanation:</strong><br>
            ${explanation}
        `;
    } catch (error) {
        outputDiv.innerHTML += `
            <hr>
            <strong>Error:</strong> Could not generate AI explanation. Please try again.
        `;
    }
}