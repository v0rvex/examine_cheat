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

async function loadImages(containerId, folderPath) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    try {
        // Assuming you have an endpoint that lists image files in the directory
        const response = await fetch(`${folderPath}/images.json`);
        if (!response.ok) {
            throw new Error(`Could not fetch ${folderPath}, status: ${response.status}`);
        }
        const images = await response.json(); // Assuming server returns JSON list of image filenames

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = `${folderPath}/${image}`;
            imgElement.alt = image;
            container.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await loadJson('index.json');
        const subjects = ["RuLang", "KzLang", "Physics", "History"];
        subjects.forEach(subject => {
            if (data[subject]) {
                populateTable(data, subject);
            }
        });
        showTable('RuLang'); // Default to showing RuLang table

        // Load images for Math container
        await loadImages('Math-images', 'mathPictures');
    } catch (error) {
        console.error('Error loading JSON data or images:', error);
    }
});
