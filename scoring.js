let dealNumber = 1;
const tableBody = document.getElementById('scoresBody');
let isEditing = false;

function updateDealInfo(newDealNumber) {
    const dealNumberElement = document.getElementById('dealNumber');
    const dealerElement = document.getElementById('dealer');
    const vulnerableElement = document.getElementById('vulnerable');
    
    if (dealNumberElement) dealNumberElement.textContent = newDealNumber;
    
    // Calculate dealer
    const dealer = getDealer(newDealNumber);
    if (dealerElement) dealerElement.textContent = dealer;
    
    // Calculate vulnerability
    const vulInfo = getVulnerability(newDealNumber);
    let vulText = 'None';
    if (vulInfo.ns && vulInfo.ew) vulText = 'All';
    else if (vulInfo.ns) vulText = 'N/S';
    else if (vulInfo.ew) vulText = 'E/W';
    if (vulnerableElement) vulnerableElement.textContent = vulText;
}

document.addEventListener('DOMContentLoaded', function() {
    // Reference button functionality
    const referenceButton = document.getElementById('referenceButton');
    if (referenceButton) {
        referenceButton.addEventListener('click', function() {
            const modal = document.getElementById('referenceModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }
});

window.showReference = function() {
    document.getElementById('referenceModal').style.display = 'flex';
}

window.hideReference = function() {
    document.getElementById('referenceModal').style.display = 'none';
}

function showConfirmation() {
    const bid = document.getElementById('bid').value;
    const suit = document.getElementById('suit').value;
    const by = document.getElementById('by').value;
    const made = document.getElementById('made').value;
    const hcp = document.getElementById('hcp').value;
    const isDoubled = document.getElementById('double').checked;
    const isRedoubled = document.getElementById('redouble').checked;
    
    // Get vulnerability from dealer and deal number
    const dealNumberValue = document.getElementById('dealNumber').textContent;
    const vulValue = document.getElementById('vulnerable').textContent;
    const isVul = (vulValue.includes('N/S') && (by === 'N' || by === 'S')) || 
                  (vulValue.includes('E/W') && (by === 'E' || by === 'W')) ||
                  vulValue === 'All';
    
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
    
    // Store current deal number before adding score
    const currentDeal = parseInt(document.getElementById('dealNumber').textContent);
    
    const bid = document.getElementById('bid').value;
    const suit = document.getElementById('suit').value;
    const by = document.getElementById('by').value;
    const made = document.getElementById('made').value;
    const hcp = parseInt(document.getElementById('hcp').value);
    const isDoubled = document.getElementById('double').checked;
    const isRedoubled = document.getElementById('redouble').checked;

    const vulValue = document.getElementById('vulnerable').textContent;
    const isVul = (vulValue.includes('N/S') && (by === 'N' || by === 'S')) || 
                  (vulValue.includes('E/W') && (by === 'E' || by === 'W')) ||
                  vulValue === 'All';
    
    const rawScore = calculateScore(bid, suit, made, isVul, isDoubled, isRedoubled);
    const comp = -getCompensation(hcp, isVul);
    const netScore = rawScore + comp;
    const nsScore = (by === 'N' || by === 'S') ? netScore : -netScore;
    const imps = calculateImps(Math.abs(netScore));
    const nsImps = nsScore > 0 ? imps : 0;
    const ewImps = nsScore < 0 ? imps : 0;

    const row = tableBody.insertRow();
    row.insertCell().textContent = currentDeal;
    
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
        deleteScore(row);
    };
    deleteCell.appendChild(deleteButton);

    // Highlight the new row
    row.classList.add('new-row-highlight');
    
    // Scroll to the new row
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Only increment if not editing
    if (!isEditing) {
        updateDealInfo(currentDeal + 1);
    }
    isEditing = false;
    updateTotals();
}

function deleteScore(row) {
    const index = row.rowIndex;
    row.remove();
    // Recalculate deal numbers
    const rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].textContent = i + 1;
    }
    updateDealInfo(rows.length + 1);
    updateTotals();
}
