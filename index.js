async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }
    return await response.json();
}

function populateTable(data, subject) {
    const tableBody = document.querySelector(`#${subject}-table tbody`);
    tableBody.innerHTML = ''; // Clear existing rows
    data[subject].forEach(entry => {
        for (const [question, answer] of Object.entries(entry)) {
            const row = document.createElement('tr');
            const questionCell = document.createElement('td');
            const answerCell = document.createElement('td');

            questionCell.textContent = question;
            answerCell.textContent = answer;

            row.appendChild(questionCell);
            row.appendChild(answerCell);

            tableBody.appendChild(row);
        }
    });
}

function showTable(subject) {
    const containers = document.querySelectorAll('.table-container');
    containers.forEach(container => {
        container.style.display = 'none';
    });

    const selectedContainer = document.querySelector(`#${subject}-container`);
    if (selectedContainer) {
        selectedContainer.style.display = 'block';
    }
}

function searchQuestions() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const visibleTable = document.querySelector('.table-container:not([style*="display: none"]) table tbody');

    if (visibleTable) {
        const rows = visibleTable.querySelectorAll('tr');
        rows.forEach(row => {
            const questionCell = row.querySelector('td:first-child');
            if (questionCell.textContent.toLowerCase().includes(searchInput)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await loadJson('index.json');
        const subjects = ["RuLang", "KzLang", "Physics", "History", "Math"];
        subjects.forEach(subject => {
            if (data[subject]) {
                populateTable(data, subject);
            }
        });
        showTable('RuLang'); // Default to showing RuLang table
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
});
