let dealNumber = 1;
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

function showConfirmation() {
  console.log('showConfirmation called');

  const confirmationDetailsElement = document.getElementById('confirmationDetails');
  const confirmationModalElement = document.getElementById('confirmationModal');
  
  console.log('confirmationDetailsElement:', confirmationDetailsElement);
  console.log('confirmationModalElement:', confirmationModalElement);

  if (confirmationDetailsElement && confirmationModalElement) {
    confirmationDetailsElement.innerHTML = details;
    confirmationModalElement.style.display = 'flex';
  } else {
    console.error('Required elements not found in the DOM.');
  }

  console.log('showConfirmation completed');
}

<userStyle>Normal</userStyle>
}

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
   dealNumber = rows.length + 1;
   updateDealInfo();
   updateTotals();
}
