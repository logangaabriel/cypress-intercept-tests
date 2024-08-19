document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://jsonplaceholder.typicode.com/users'; 
    const errorContainer = document.getElementById('error-message');
    const loadingIndicator = document.getElementById('loading');
    const table = document.getElementById('data-table');
    const tableBody = document.querySelector('#data-table tbody');
    
    const fetchData = () => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                loadingIndicator.style.display = 'none';

                // Check if the data has the expected structure
                if (Array.isArray(data)) {
                    if (data.length > 0 && data.every(user => user.id && user.name && user.email)) {
                        table.style.display = 'table';
                        tableBody.innerHTML = '';

                        data.forEach(user => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                            `;
                            tableBody.appendChild(row);
                        });
                    } else if (data.length === 0) {
                        errorContainer.textContent = 'No users found.';
                    } else {
                        errorContainer.textContent = 'Unexpected data format';
                    }
                } else {
                    errorContainer.textContent = 'Unexpected data format';
                }
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                console.error('Error loading data:', error);
                errorContainer.textContent = `An error occurred while loading data: ${error.message}`;
            });
    };

    fetchData();
});
