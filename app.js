window.onload = function() {
    const tableBody = document.getElementById('scoresBody');
    const addButton = document.querySelector('.add-btn');
    const totalNSCell = document.getElementById('totalNS');
    const totalEWCell = document.getElementById('totalEW');
    let dealNumber = 1;

    // HCP compensation tables
    const COMPENSATION = {
        NV: {
            20: 0, 21: 50, 22: 70, 23: 110, 24: 200,
            25: 300, 26: 350, 27: 400, 28: 430, 29: 460,
            30: 490, 31: 600, 32: 700, 33: 900, 34: 1000,
            35: 1100, 36: 1200, 37: 1300
        },
        V: {
            20: 0, 21: 50, 22: 70, 23: 110, 24: 290,
            25: 440, 26: 520, 27: 610, 28: 630, 29: 660,
            30: 690, 31: 900, 32: 1050, 33: 1350, 34: 1500,
            35: 1650, 36: 1800, 37: 1950
        }
    };

    // Doubled undertrick penalties
    const DOUBLE_PENALTIES = {
        NV: {
            1: 100, 2: 300, 3: 500, 4: 800, 5: 1100, 6: 1400,
            7: 1700, 8: 2000, 9: 2300, 10: 2600, 11: 2900, 12: 3200, 13: 3500
        },
        V: {
            1: 200, 2: 500, 3: 800, 4: 1100, 5: 1400, 6: 1700,
            7: 2000, 8: 2300, 9: 2600, 10: 2900, 11: 3200, 12: 3500, 13: 3800
        }
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
            if (isRedoubled) {
                return -DOUBLE_PENALTIES[isVul ? 'V' : 'NV'][undertricks] * 2;
            } else if (isDoubled) {
                return -DOUBLE_PENALTIES[isVul ? 'V' : 'NV'][undertricks];
            } else {
                return isVul ? (-100 * undertricks) : (-50 * undertricks);
            }
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
        
        let originalTrickScore = 0;
        if (suit === 'NT') {
            originalTrickScore = 40 + (30 * (parseInt(bid) - 1));
        } else if ('SH♠♥'.includes(suit)) {
            originalTrickScore = 30 * parseInt(bid);
        } else {
            originalTrickScore = 20 * parseInt(bid);
        }
        
        if (originalTrickScore >= 100) {
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
function calculateImps(score) {
    if (score <= 20) return 0;
    if (score <= 50) return 1;
    if (score <= 90) return 2;
    if (score <= 130) return 3;
    if (score <= 170) return 4;
    if (score <= 220) return 5;
    if (score <= 270) return 6;
    if (score <= 320) return 7;
    if (score <= 370) return 8;
    if (score <= 430) return 9;
    if (score <= 500) return 10;
    if (score <= 600) return 11;
    if (score <= 750) return 12;
    if (score <= 900) return 13;
    if (score <= 1100) return 14;
    if (score <= 1300) return 15;
    if (score <= 1500) return 16;
    if (score <= 1750) return 17;
    if (score <= 2000) return 18;
    if (score <= 2250) return 19;
    if (score <= 2500) return 20;
    if (score <= 3000) return 21;
    if (score <= 3500) return 22;
    if (score <= 4000) return 23;
    return 24;
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

    addButton.addEventListener('click', function() {
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
        
        // Updated contract display to include X/XX
        let contractText = `${bid}${suit} by ${by}${isVul ? ' V' : ' NV'}`;
        if (isRedoubled) contractText += 'XX';
        else if (isDoubled) contractText += 'X';
        row.insertCell().textContent = contractText;
        
        row.insertCell().textContent = made;  // New Tricks column
        row.insertCell().textContent = rawScore;
        row.insertCell().textContent = hcp;   // New HCP column
        row.insertCell().textContent = comp;
        row.insertCell().textContent = netScore;
        row.insertCell().textContent = nsImps;
    row.insertCell().textContent = ewImps;
addDeleteButton(row);

dealNumber++;
updateDealInfo();
updateTotals();

}; // Close window.onload

// Initial setup
updateDealInfo();  // no closing bracket
updateTotals();

dealNumber++;
updateDealInfo();
updateTotals();

}; // Close window.onload

// Initial setup
updateDealInfo();
updateTotals();
// Initial setup
updateDealInfo();
updateTotals();

}); // Close window.onload

// Initial setup
updateDealInfo();
        updateTotals();
    });

    // Initial setup
    updateDealInfo();
};
    }); // Close window.onload
