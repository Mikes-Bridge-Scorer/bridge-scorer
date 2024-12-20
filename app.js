<!DOCTYPE html>
<html>
<head>
  <title>Scores App</title>
</head>
<body>
  <div id="dealInfo"></div>
  <table>
    <thead>
      <tr>
        <th>Deal</th>
        <th>Contract</th>
        <th>Made</th>
        <th>Raw Score</th>
        <th>HCP</th>
        <th>Compensation</th>
        <th>Net Score</th>
        <th>NS IMPs</th>
        <th>EW IMPs</th>
      </tr>
    </thead>
    <tbody id="scoresBody"></tbody>
    <tfoot>
      <tr>
        <td colspan="7">Total</td>
        <td id="totalNS"></td>
        <td id="totalEW"></td>
      </tr>
    </tfoot>
  </table>
  <button id="newGame">New Game</button>
  <div>
    Bid: <input type="number" id="bid" min="1" max="7" />
    Suit: <select id="suit">
      <option value="NT">NT</option>
      <option value="S">Spades</option>
      <option value="H">Hearts</option>
      <option value="D">Diamonds</option>
      <option value="C">Clubs</option>
    </select>
    By: <select id="by">
      <option value="N">North</option>
      <option value="E">East</option>
      <option value="S">South</option>
      <option value="W">West</option>
    </select>
    Made: <input type="number" id="made" min="0" />
    HCP: <input type="number" id="hcp" min="20" max="37" />
    <input type="checkbox" id="double" /> Doubled
    <input type="checkbox" id="redouble" /> Redoubled
    <button class="add-btn">Add</button>
  </div>

  <script>
    window.onload = function() {
      const tableBody = document.getElementById('scoresBody');
      const totalNSCell = document.getElementById('totalNS');
      const totalEWCell = document.getElementById('totalEW');
      let dealNumber = 1;

      const COMPENSATION = {
        NV: {
          20: 0, 21: -50, 22: -70, 23: -110, 24: -200,
          25: -300, 26: -350, 27: -400, 28: -430, 29: -460,
          30: -490, 31: -600, 32: -700, 33: -900, 34: -1000,
          35: -1100, 36: -1200, 37: -1300
        },
        V: {
          20: 0, 21: -50, 22: -70, 23: -110, 24: -290,
          25: -440, 26: -520, 27: -610, 28: -630, 29: -660,
          30: -690, 31: -900, 32: -1050, 33: -1350, 34: -1500,
          35: -1650, 36: -1800, 37: -1950
        }
      };

      const DOUBLE_PENALTIES = {
        NV: [0, -50, -100, -150, -200, -300, -400, -500, -600, -700, -800, -900, -1000],
        V: [0, -50, -100, -150, -300, -500, -600, -700, -800, -900, -1000, -1100, -1200]
      };

      function getVulnerability(dealNum) {
        switch ((dealNum - 1) % 4) {
          case 0: return { ns: false, ew: false, str: "None" };
          case 1: return { ns: true, ew: false, str: "N/S" };
          case 2: return { ns: false, ew: true, str: "E/W" };
          case 3: return { ns: true, ew: true, str: "All" };
        }
      }

      function getDealer(dealNum) {
        switch ((dealNum - 1) % 4) {
          case 0: return "N";
          case 1: return "E";
          case 2: return "S";
          case 3: return "W";
        }
      }

      function updateDealInfo() {
        const vulInfo = getVulnerability(dealNumber);
        const dealer = getDealer(dealNumber);
        document.getElementById('dealInfo').innerHTML = `
          <div>Deal: ${dealNumber}</div>
          <div>Dealer: ${dealer}</div>
          <div>Vulnerable: ${vulInfo.str}</div>
        `;
      }

      function calculateScore(bid, suit, made, isVul, isDoubled, isRedoubled) {
        const contractTricks = parseInt(bid) + 6;
        const tricksMade = parseInt(made);
        const undertricks = contractTricks - tricksMade;
        
        if (undertricks > 0) {
          if (isRedoubled) return DOUBLE_PENALTIES[isVul ? 'V' : 'NV'][undertricks] * -2;
          if (isDoubled) return DOUBLE_PENALTIES[isVul ? 'V' : 'NV'][undertricks] * -1;
          return isVul ? (-100 * undertricks) : (-50 * undertricks);
        }
        
        let trickScore = 0;
        if (suit === 'NT') {
          trickScore = 40 + (30 * (parseInt(bid) - 1));
        } else if ('SH♠♥'.includes(suit)) {
          trickScore = 30 * parseInt(bid);
        } else {
          trickScore = 20 * parseInt(bid);
        }
        
        if (isRedoubled) trickScore *= 4;
        else if (isDoubled) trickScore *= 2;
        
        let score = trickScore;
        
        const overtricks = tricksMade - contractTricks;
        if (overtricks > 0) {
          if (isRedoubled) {
            score += overtricks * (isVul ? 400 : 200);
          } else if (isDoubled) {
            score += overtricks * (isVul ? 200 : 100);
          } else {
            score += overtricks * (isVul ? 30 : 20);
          }
        }
        
        if (trickScore >= 100) {
          score += isVul ? 500 : 300;
        } else {
          score += 50;
        }
        
        if (parseInt(bid) === 6) score += isVul ? 750 : 500;
        if (parseInt(bid) === 7) score += isVul ? 1500 : 1000;
        
        if (isRedoubled) score += 100;
        else if (isDoubled) score += 50;
        
        return score;
      }

      function calculateImps(score) {
        // Implementation of IMP calculation logic
      }

      function getCompensation(hcp, isVul) {
        return COMPENSATION[isVul ? 'V' : 'NV'][hcp];
      }

      function updateTotals() {
        let nsTotal = 0, ewTotal = 0;
        for (let i = 0; i < tableBody.rows.length; i++) {
          nsTotal += parseInt(tableBody.rows[i].cells[7].textContent) || 0;
          ewTotal += parseInt(tableBody.rows[i].cells[8].textContent) || 0;
        }
        totalNSCell.textContent = nsTotal;
        totalEWCell.textContent = ewTotal;
      }

      function addDeleteButton(row) {
        const deleteCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = function() {
          row.remove();
          updateTotals();
        };
        deleteCell.appendChild(deleteButton);
      }

      document.getElementById('newGame').onclick = function() {
        tableBody.innerHTML = '';
        dealNumber = 1;
        updateDealInfo();
        updateTotals();
      };

      document.querySelector('.add-btn').addEventListener('click', function() {
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
        
        addDeleteButton(row);

        dealNumber++;
        updateDealInfo();
        updateTotals();
      });

      // Initial setup
      updateDealInfo();
    };
  </script>
</body>
</html>
