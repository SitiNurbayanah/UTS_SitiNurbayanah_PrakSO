function acceptProcesses() {
    const num = document.getElementById('numProcesses').value;
    const container = document.getElementById('processContainer');
    container.innerHTML = '';
    for (let i = 0; i < num; i++) {
        container.innerHTML += `<div>
            <label>Proses ${i}: Arrival Time </label>
            <input type="number" id="at${i}">
            <label> Burst Time </label>
            <input type="number" id="bt${i}">
        </div>`;
    }
}

function runFCFS() {
    const num = document.getElementById('numProcesses').value;
    let processes = [];
    let totalWT = 0; 
    let totalTAT = 0; 

    for (let i = 0; i < num; i++) {
        let atInput = document.getElementById(`at${i}`).value;
        let btInput = document.getElementById(`bt${i}`).value;
        let atVal = parseInt(atInput);
        let btVal = parseInt(btInput);

        if (atVal < 0 || btVal <= 0 || isNaN(atVal) || isNaN(btVal)) {
            alert(`Kedatangan waktu dan Burst Time untuk proses ${i} harus bilangan bulat positif.`);
            return;
        }

        let wt = 0;
        let st = 0;
        let ct = 0;
        let tat = 0;

        if (i === 0) {
            st = atVal;
        } else {
            st = processes[i - 1].ct;
        }

        ct = st + btVal; 
        wt = st - atVal; 
        tat = ct - atVal;

        processes.push({ pid: i, at: atVal, bt: btVal, st: st, ct: ct, wt: wt, tat: tat });
        totalWT += wt;
        totalTAT += tat;
    }

    let avgWT = totalWT / num;
    let avgTAT = totalTAT / num;

    displayResults(processes, avgWT, avgTAT);
}

function displayResults(processes, avgWT, avgTAT) {
    const ganttChart = document.getElementById('ganttChart');
    const results = document.getElementById('results');
    ganttChart.innerHTML = '';
    results.innerHTML = '';

    let labels = [];
    let wtData = [];
    let tatData = [];

    processes.forEach(proc => {
        ganttChart.innerHTML += `| P${proc.pid} `;
        results.innerHTML += `Proses ${proc.pid}: ST = ${proc.st}ms, CT = ${proc.ct}ms, WT = ${proc.wt}ms, TAT = ${proc.tat}ms\n`;

        labels.push(`P${proc.pid}`);
        wtData.push(proc.wt);
        tatData.push(proc.tat);
    });
    ganttChart.innerHTML += '|';

    results.innerHTML += `\nRata-rata Waiting Time: ${avgWT.toFixed(2)}ms`;
    results.innerHTML += `\nRata-rata Turnaround Time: ${avgTAT.toFixed(2)}ms`;

    createBarChart(labels, wtData, tatData);
}

function createBarChart(labels, wtData, tatData) {
    const ctx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Waiting Time',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: wtData
                },
                {
                    label: 'Turn Around Time',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: tatData
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
