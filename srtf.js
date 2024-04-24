function acceptProcesses() {
    const num = document.getElementById('numProcesses').value;
    const container = document.getElementById('processContainer');
    container.innerHTML = '';
    for (let i = 0; i < num; i++) {
        container.innerHTML += `<div>
            <label>Proses ${i} Arrival Time: </label>
            <input type="number" id="at${i}">
            <label> Burst Time: </label>
            <input type="number" id="bt${i}">
        </div>`;
    }
}

function runSRTF() {
    const num = document.getElementById('numProcesses').value;
    let processes = [];
    for (let i = 0; i < num; i++) {
        let at = parseInt(document.getElementById(`at${i}`).value);
        let bt = parseInt(document.getElementById(`bt${i}`).value);
        processes.push({ pid: i, at: at, bt: bt, remaining: bt, ft: 0, wt: 0, tat: 0, lastActive: 0 });
    }

    let time = 0;
    let finished = 0;
    let currentProcess = null;
    const order = [];

    while (finished < processes.length) {
        let shortestRemainingTime = Infinity;
        currentProcess = null;

        for (let i = 0; i < processes.length; i++) {
            if (processes[i].at <= time && processes[i].remaining > 0 && processes[i].remaining < shortestRemainingTime) {
                currentProcess = processes[i];
                shortestRemainingTime = processes[i].remaining;
            }
        }

        if (currentProcess === null) {
            time++;
            continue;
        }

        order.push(currentProcess.pid);
        currentProcess.remaining--;
        time++;

        if (currentProcess.remaining === 0) {
            currentProcess.ft = time;
            currentProcess.tat = currentProcess.ft - currentProcess.at;
            currentProcess.wt = currentProcess.tat - currentProcess.bt;
            finished++;
        }
    }

    displayResults(processes, order);
}

function displayResults(processes, order) {
    const ganttChart = document.getElementById('ganttChart');
    const results = document.getElementById('results');
    ganttChart.innerHTML = '';
    results.innerHTML = '';

    let labels = [];
    let wtData = [];
    let tatData = [];

    processes.forEach(proc => {
        let startTime = proc.at; // Start time adalah arrival time
        let completionTime = proc.ft; // Completion time adalah finish time
        let waitingTime = proc.wt;
        let turnaroundTime = proc.tat;

        results.innerHTML += `Proses ${proc.pid}: ST = ${startTime}ms, CT = ${completionTime}ms, WT = ${waitingTime}ms, TAT = ${turnaroundTime}ms\n`;

        labels.push(`P${proc.pid}`);
        wtData.push(proc.wt);
        tatData.push(proc.tat);
    });

    let totalWT = processes.reduce((acc, proc) => acc + proc.wt, 0);
    let totalTAT = processes.reduce((acc, proc) => acc + proc.tat, 0);
    let avgWT = totalWT / processes.length;
    let avgTAT = totalTAT / processes.length;

    results.innerHTML += `\nRata-rata Waktu Tunggu: ${avgWT.toFixed(2)}ms`;
    results.innerHTML += `\nRata-rata Turn Around Time: ${avgTAT.toFixed(2)}ms`;

    // Panggil fungsi untuk membuat grafik batang
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
                    label: 'Waktu Tunggu',
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
