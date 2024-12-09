const tableBody = document.getElementById('scoresBody');
let isEditing = false;

document.addEventListener('DOMContentLoaded', function() {
   const referenceButton = document.getElementById('referenceButton');
   if (referenceButton) {
       referenceButton.addEventListener('click', function() {
           document.getElementById('referenceModal').style.display = 'flex';
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
       deleteScore(row);
   };
   deleteCell.appendChild(deleteButton);

   row.classList.add('new-row-highlight');
   row.scrollIntoView({ behavior: 'smooth', block: 'center' });

   if (!isEditing) {
       dealNumber++;
       updateDealInfo();
   }
   isEditing = false;
   updateTotals();
}
function deleteScore(row) {
   const index = row.rowIndex;
   row.remove();
   const rows = tableBody.getElementsByTagName('tr');
   for (let i = 0; i < rows.length; i++) {
       rows[i].cells[0].textContent = i + 1;
   }
   function showTab(tabName) {
    event.preventDefault();
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
    }
    event.target.classList.add('active');
}
     dealNumber = rows.length + 1;
   updateDealInfo();
   updateTotals();
}
