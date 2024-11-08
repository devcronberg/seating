document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('jsonModal');
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const closeModalBtn = document.getElementsByClassName('close')[0];

    const jsonFiles = [
        { fileName: 'test1.json', date: '2023-01-01' },
        { fileName: 'test2.json', date: '2023-02-01' },
        { fileName: 'test3.json', date: '2023-03-01' }
    ];

    jsonFiles.sort((a, b) => new Date(b.date) - new Date(a.date));

    const modalContent = document.querySelector('.modal-content');
    // Clear existing buttons
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Select JSON File</h2>
    `;
    jsonFiles.forEach(file => {
        const button = document.createElement('button');
        button.textContent = `Load ${file.fileName}`;
        button.onclick = () => loadJsonFile(file.fileName);
        modalContent.appendChild(button);
    });

    const showModal = () => {
        modal.style.display = 'block';
    };

    header.onclick = showModal;
    footer.onclick = showModal;

    closeModalBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    const loadJsonFile = (fileName) => {
        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                // Set header content
                header.textContent = data.header || 'Default header';

                // Set footer content
                footer.textContent = data.footer || 'Default footer';

                // Set grid configuration
                const gridContainer = document.getElementById('grid-container');
                gridContainer.style.gridTemplateRows = `repeat(${data.grid.rows}, 1fr)`;
                gridContainer.style.gridTemplateColumns = `repeat(${data.grid.columns}, 1fr)`;

                // Clear existing grid items
                gridContainer.innerHTML = '';

                // Generate grid items
                data.names.forEach((item, index) => {
                    const gridItem = document.createElement('div');
                    gridItem.className = 'grid-item';
                    gridItem.textContent = item.name;
                    gridItem.style.backgroundColor = item.bgColor || 'white';
                    if (item.online) {
                        const icon = document.createElement('span');
                        icon.className = 'online-icon';
                        icon.textContent = '🟢'; // Online icon
                        gridItem.appendChild(icon);
                    }
                    gridContainer.appendChild(gridItem);
                });

                // Close the modal
                modal.style.display = 'none';
            })
            .catch(error => console.error('Error fetching grid configuration:', error));
    };

    // Check for JSON file in URL
    const urlParams = new URLSearchParams(window.location.search);
    const jsonFile = urlParams.get('json');
    if (jsonFile) {
        loadJsonFile(jsonFile);
    }
});