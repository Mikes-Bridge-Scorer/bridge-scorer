function showConfirmation() {
    // Get dealNumber from the deal info display or default to 1
    const dealNumberDisplay = document.getElementById('dealInfo').textContent;
    const dealNumber = parseInt(dealNumberDisplay.match(/\d+/)[0]) || 1;

    const bid = document.getElementById('bid').value;
    const suit = document.getElementById('suit').value;
    const by = document.getElementById('by').value;
    const made = document.getElementById('made').value;
    const hcp = document.getElementById('hcp').value;
    const isDoubled = document.getElementById('double').checked;
    const isRedoubled = document.getElementById('redouble').checked;
    
    // Get vulnerability from display
    const vulDisplay = document.getElementById('dealInfo').textContent;
    const isVul = vulDisplay.includes('N/S') && (by === 'N' || by === 'S') || 
                  vulDisplay.includes('E/W') && (by === 'E' || by === 'W');
    
    const details = `
        <div style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            <div><strong>Contract:</strong> ${bid}${suit} by ${by} (${isVul ? 'Vul' : 'Not Vul'})</div>
            <div><strong>Made:</strong> ${made} tricks</div>
            <div><strong>HCP:</strong> ${hcp}</div>
            <div><strong>Double/Redouble:</strong> ${isDoubled ? 'Doubled' : (isRedoubled ? 'Redoubled' : 'No')}</div>
        </div>
    `;
    
    document.getElementById('confirmationDetails').innerHTML = details;
    document.getElementById('confirmationModal').style.display = 'flex';
}

function hideConfirmation() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function confirmAndAddScore() {
    hideConfirmation();
    
    const bid = document.getElementById('bid').value;
    const suit = document.getElementById('suit').value;
    const by = document.getElementById('by').value;
    const made = document.getElementById('made').value;
    const hcp = parseInt(document.getElementById('hcp').value);
    const isDoubled = document.getElementById('double').checked;
    const isRedoubled = document.getElementById('redouble').checked;

    const vulInfo = getVulnerability(dealNumber);
    const isVul = (by === 'N' || by === 'S') ? vulInfo.ns : vulInfo.ew;
    
    const rawScore = calculateScore(bid, suit, made, isVul, isDoubled, isRedoubled);
    const comp = -getCompensation(hcp, isVul);
    const netScore = rawScore + comp;
    const nsScore = (by === 'N' || by === 'S') ? netScore : -netScore;
    const imps = calculateImps(Math.abs(netScore));
    const nsImps = nsScore > 0 ? imps : 0;
    const ewImps = nsScore < 0 ? imps : 0;

    const row = tableBody.insertRow();
    row.insertCell().textContent = dealNumber;
    
    let contractText = `${bid}${suit} by ${by}${isVul ? ' V' : ' NV'}`;
    if (isRedoubled) contractText += 'XX';
    else if (isDoubled) contractText += 'X';
    row.insertCell().textContent = contractText;
    
    row.insertCell().textContent = made;
    row.insertCell().textContent = rawScore;
    row.insertCell().textContent = hcp;
    row.insertCell().textContent = comp;
    row.insertCell().textContent = netScore;
    row.insertCell().textContent = nsImps;
    row.insertCell().textContent = ewImps;
    
    const deleteCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = function() {
        row.remove();
        updateTotals();
    };
    deleteCell.appendChild(deleteButton);

    // Highlight the new row
    row.classList.add('new-row-highlight');
    
    // Scroll to the new row
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });

    dealNumber++;
    updateDealInfo();
    updateTotals();
}

// Add this to ensure we capture all necessary variables from the original app.js
let dealNumber = 1;
const tableBody = document.getElementById('scoresBody');
