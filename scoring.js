function showConfirmation() {
    const bid = document.getElementById('bid').value;
    const suit = document.getElementById('suit').value;
    const by = document.getElementById('by').value;
    const made = document.getElementById('made').value;
    const hcp = document.getElementById('hcp').value;
    const isDoubled = document.getElementById('double').checked;
    const isRedoubled = document.getElementById('redouble').checked;
    
    const vulInfo = getVulnerability(dealNumber);
    const isVul = (by === 'N' || by === 'S') ? vulInfo.ns : vulInfo.ew;
    
    const details = `
        <div><strong>Contract:</strong> ${bid}${suit} by ${by} (${isVul ? 'Vul' : 'Not Vul'})</div>
        <div><strong>Made:</strong> ${made} tricks</div>
        <div><strong>HCP:</strong> ${hcp}</div>
        <div><strong>Double/Redouble:</strong> ${isDoubled ? 'Doubled' : (isRedoubled ? 'Redoubled' : 'No')}</div>
    `;
    
    document.getElementById('confirmationDetails').innerHTML = details;
    document.getElementById('confirmationModal').style.display = 'flex';
}

function hideConfirmation() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function confirmAndAddScore() {
    hideConfirmation();
    // Call the original scoring function
    const row = addScore();
    
    // Scroll to and highlight the new row
    if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('new-row-highlight');
    }
}
