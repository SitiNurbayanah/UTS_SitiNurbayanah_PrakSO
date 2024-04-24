function acceptProcesses() {
    const num = document.getElementById('numProcesses').value;
    const container = document.getElementById('processContainer');
    container.innerHTML = '';
    for (let i = 0; i < num; i++) {
        container.innerHTML += `<div>
            <label>Proses ${i} Arrival Time: </label>
            <input type="number" id="at${i}">
            <label>Proses ${i} Burst Time: </label>
            <input type="number" id="bt${i}">
        </div>`;
    }
}

function runSJF() {
    const num = document.getElementById('numProcesses').value;
    let processes = [];
    for (let i = 0; i < num; i++) {
        let at = document.getElementById(`at${i}`).value;
        let bt = document.getElementById(`bt${i}`).value;
        processes.push({ pid: i, at: parseInt(at), bt: parseInt(bt), st: 0, ft: 0, wt: 0, tat: 0 });
    }

    processes.sort((a, b) => a.at - b.at || a.bt - b.bt);

    let time = 0;
    processes.forEach(proc => {
        proc.st = Math.max(time, proc.at); 
        proc.wt = proc.st - proc.at; 
        proc.ft = proc.st + proc.bt; 
        proc.tat = proc.ft - proc.at; 
        time = proc.ft; 
    });

    displayResults(processes);
}

function displayResults(processes) {
    const ganttChart = document.getElementById('ganttChart');
    const results = document.getElementById('results');
    ganttChart.innerHTML = '';
    results.innerHTML = '';

    let labels = [];
    let wtData = [];
    let tatData = [];
    let btData = []; 

    processes.forEach(proc => {
        ganttChart.innerHTML += `| P${proc.pid} `;
        results.innerHTML += `Proses ${proc.pid}: ST = ${proc.st}ms, CT = ${proc.ft}ms, WT = ${proc.wt}ms, TAT = ${proc.tat}ms\n`;

        labels.push(`P${proc.pid}`);
        wtData.push(proc.wt);
        tatData.push(proc.tat);
        btData.push(proc.bt);
    });
    ganttChart.innerHTML += '|';

    let totalWT = processes.reduce((acc, proc) => acc + proc.wt, 0);
    let totalTAT = processes.reduce((acc, proc) => acc + proc.tat, 0);
    let totalBT = processes.reduce((acc, proc) => acc + proc.bt, 0); 
    let avgWT = totalWT / processes.length;
    let avgTAT = totalTAT / processes.length;

    results.innerHTML += `\nRata-rata Waiting Time: ${avgWT.toFixed(2)}ms`;
    results.innerHTML += `\nRata-rata Turn Around Time: ${avgTAT.toFixed(2)}ms`;
    results.innerHTML += `\nTotal Burst Time: ${totalBT}ms`;

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
