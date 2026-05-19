let tasks = JSON.parse(localStorage.getItem('nova_tasks')) || [];

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    
    tasks.forEach((task, i) => {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${i})">
            <div style="flex:1; ${task.completed ? 'opacity:0.4; text-decoration:line-through' : ''}">
                <div style="font-weight: 600; font-size: 1.1rem; color: var(--text-white);">${task.text}</div>
                <small style="color: var(--text-muted); margin-top: 5px; display: block;">${task.date || 'No Deadline'}</small>
            </div>
            <i data-lucide="trash-2" onclick="deleteTask(${i})" class="delete-icon"></i>
        `;
        list.appendChild(item);
    });
    
    lucide.createIcons();
    updateStatistics();
}

function addTask() {
    const textInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    
    if(!textInput.value.trim()) return;
    
    tasks.unshift({
        text: textInput.value,
        date: dateInput.value,
        completed: false
    });
    
    textInput.value = '';
    dateInput.value = '';
    saveData();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveData();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveData();
}

function saveData() {
    localStorage.setItem('nova_tasks', JSON.stringify(tasks));
    renderTasks();
}

function updateStatistics() {
    const done = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    
    document.getElementById('percentText').innerText = percent + '%';
    document.getElementById('doneCount').innerText = done;
    document.getElementById('pendingCount').innerText = total - done;
}

// telicharje lay9onat
lucide.createIcons();

// Enter bach nzid lmaham
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// bach nkhrj pdf
document.getElementById('exportBtn').onclick = () => {
    if(tasks.length === 0) {
        alert("Add some tasks first before exporting!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    // color dyal pdf ofc purple 
    doc.setTextColor(77, 18, 80);
    doc.text("Nova Task - Daily Report", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    const tableData = tasks.map(t => [
        t.text, 
        t.date || 'N/A', 
        t.completed ? 'Accomplished' : 'Active'
    ]);

    doc.autoTable({
        startY: 35,
        head: [['Mission', 'Deadline', 'Status']],
        body: tableData,
        headStyles: { fillColor: [129, 60, 133] },
        theme: 'striped'
    });
    
    doc.save('Nova-Task-Report.pdf');
};

document.getElementById('addBtn').onclick = addTask;
renderTasks();
