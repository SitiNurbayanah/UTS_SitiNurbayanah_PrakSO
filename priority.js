function acceptProcesses() {
    const num = document.getElementById('numProcesses').value;
    const container = document.getElementById('processContainer');
    container.innerHTML = '';
    for (let i = 0; i < num; i++) {
        container.innerHTML += `<div>
            <label>Proses ${i} Burst Time: </label>
            <input type="number" id="bt${i}">
            <label> Prioritas: </label>
            <input type="number" id="pr${i}">
        </div>`;
    }
}

function runPriority() {
    const num = document.getElementById('numProcesses').value;
    let processes = [];
    for (let i = 0; i < num; i++) {
        let bt = document.getElementById(`bt${i}`).value;
        let pr = document.getElementById(`pr${i}`).value;
        processes.push({ pid: i, bt: parseInt(bt), pr: parseInt(pr), st: 0, ft: 0, wt: 0, tat: 0 });
    }

    processes.sort((a, b) => a.pr - b.pr);

    let time = 0;
    processes.forEach(proc => {
        proc.st = time;
        proc.ft = time + proc.bt;
        proc.wt = proc.st; 
        proc.tat = proc.bt + proc.wt;
        time += proc.bt;
    });

    displayResults(processes);
}

function displayResults(processes) {
    const ganttChart = document.getElementById('ganttChartCanvas');
    const results = document.getElementById('results');

    results.innerHTML = '';

    let labels = [];
    let wtData = [];
    let tatData = [];
    let btData = []; 

    processes.forEach(proc => {
        results.innerHTML += `Proses ${proc.pid}: ST = ${proc.st}ms, CT = ${proc.ft}ms, WT = ${proc.wt}ms, TAT = ${proc.tat}ms, BT = ${proc.bt}ms\n`;

        labels.push(`P${proc.pid}`);
        wtData.push(proc.wt);
        tatData.push(proc.tat);
        btData.push(proc.bt);
    });

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
