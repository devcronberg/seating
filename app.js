document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('jsonModal');
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const closeModalBtn = document.getElementsByClassName('close')[0];

    const modalContent = document.querySelector('.modal-content');
    // Clear existing buttons
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Select JSON File</h2>
    `;

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

    const fetchJsonFiles = () => {
        fetch('/data/files.json')
            .then(response => response.json())
            .then(files => {
                files.forEach(file => {
                    fetch(`/data/${file}`)
                        .then(response => response.json())
                        .then(data => {
                            const button = document.createElement('button');
                            button.textContent = `${data.title}`;
                            button.onclick = () => loadJsonFile(`/data/${file}`);
                            modalContent.appendChild(button);
                        })
                        .catch(error => console.error('Error fetching JSON file:', error));
                });
            })
            .catch(error => console.error('Error fetching JSON file list:', error));
    };

    fetchJsonFiles();

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

    // Check for JSON file in URL
    const urlParams = new URLSearchParams(window.location.search);
    const jsonFile = urlParams.get('json');
    if (jsonFile) {
        loadJsonFile(jsonFile);
    }
});