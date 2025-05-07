import config from './config.js';

// Helper functions for notifications
function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showModalError(modalElement, message) {
    const form = modalElement.querySelector('form');
    if (!form) return;

    // Remove any existing error messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-circle-exclamation"></i>${message}`;
    form.insertBefore(errorDiv, form.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const registerModal = document.getElementById('register-modal');
    const editModal = document.getElementById('edit-passenger-modal');
    const deleteModal = document.getElementById('delete-confirmation-modal');
    
    // Button elements
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    // Search and sort elements
    const searchInput = document.getElementById('search-passenger');
    const sortSelect = document.getElementById('sort-by');

    // Check user role and hide register button if passenger
    const userRole = localStorage.getItem('role');
    const isPassenger = userRole === 'Passenger';
    if (isPassenger && registerBtn) {
        registerBtn.style.display = 'none';
    }

    // Form elements
    const registerForm = document.getElementById('register-form');
    const editForm = document.getElementById('edit-passenger-form');

    let currentDeleteTarget = null;

    // Modal handlers
    registerBtn?.addEventListener('click', () => {
        registerModal.classList.add('active');
        // Clear any existing errors
        const existingError = registerModal.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            registerModal?.classList.remove('active');
            editModal?.classList.remove('active');
            deleteModal?.classList.remove('active');
            // Clear any existing errors
            document.querySelectorAll('.error-message').forEach(error => error.remove());
        });
    });

    // Logout handler
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
    });

    // Form submit handlers
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            RFID: e.target.rfid.value,
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            phoneNumber: e.target.phoneNumber.value,
            currentBalance: parseFloat(e.target.initialBalance.value)
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                showModalError(registerModal, data.message || 'Failed to register passenger');
                return;
            }

            showNotification('Passenger registered successfully!', 'success');
            registerModal.classList.remove('active');
            fetchPassengers();
            e.target.reset();
        } catch (error) {
            console.error('Error registering passenger:', error);
            showModalError(registerModal, 'Unable to connect to server. Please try again later.');
        }
    });

    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            rfid: e.target.rfid.value,
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            phoneNumber: e.target.phoneNumber.value
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/passenger/${formData.rfid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                showModalError(editModal, data.message || 'Failed to update passenger');
                return;
            }

            showNotification('Passenger updated successfully!', 'success');
            editModal.classList.remove('active');
            fetchPassengers();
            e.target.reset();
        } catch (error) {
            console.error('Error updating passenger:', error);
            showModalError(editModal, 'Unable to connect to server. Please try again later.');
        }
    });

    // Delete confirmation handler
    confirmDeleteBtn?.addEventListener('click', async () => {
        const targetRfid = window.currentDeleteTarget;
        if (!targetRfid) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/passenger/${targetRfid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                showModalError(deleteModal, data.message || 'Failed to delete passenger');
                return;
            }

            showNotification('Passenger deleted successfully!', 'success');
            deleteModal.classList.remove('active');
            fetchPassengers();
            window.currentDeleteTarget = null;
        } catch (error) {
            console.error('Error deleting passenger:', error);
            showModalError(deleteModal, 'Unable to connect to server. Please try again later.');
        }
    });

    // Add event listeners for search and sort
    searchInput?.addEventListener('input', filterPassengers);
    sortSelect?.addEventListener('change', filterPassengers);

    // Initial data fetch
    fetchPassengers();
});

function fetchPassengers() {
    fetch(`${config.API_BASE_URL}/api/passengers`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch passengers');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#passenger-table tbody');
            if (!tableBody) return;
            
            const userRole = localStorage.getItem('role');
            const isPassenger = userRole === 'Passenger';
            
            tableBody.innerHTML = '';
            data.forEach(passenger => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${passenger.RFID || '-'}</td>
                    <td>${passenger.FirstName || '-'}</td>
                    <td>${passenger.LastName || '-'}</td>
                    <td>${passenger.PhoneNumber || '-'}</td>
                    <td class="balance">₱${Number(passenger.CurrentBalance || 0).toFixed(2)}</td>
                    ${!isPassenger ? `
                    <td>
                        <button onclick="editPassenger('${passenger.RFID}', '${passenger.FirstName}', '${passenger.LastName}', '${passenger.PhoneNumber}')" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="destructive" onclick="deletePassenger('${passenger.RFID}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </td>
                    ` : '<td>-</td>'}
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching passengers:', error));
}

// Helper functions for passenger management
window.editPassenger = function(rfid, firstName, lastName, phoneNumber) {
    const editModal = document.getElementById('edit-passenger-modal');
    const form = document.getElementById('edit-passenger-form');
    
    if (!editModal || !form) return;
    
    form.rfid.value = rfid;
    form.firstName.value = firstName;
    form.lastName.value = lastName;
    form.phoneNumber.value = phoneNumber;
    
    editModal.classList.add('active');
};

window.deletePassenger = function(rfid) {
    const deleteModal = document.getElementById('delete-confirmation-modal');
    if (!deleteModal) return;
    
    window.currentDeleteTarget = rfid;
    deleteModal.classList.add('active');
};

function filterPassengers() {
    const searchTerm = document.getElementById('search-passenger')?.value.toLowerCase() || '';
    const sortBy = document.getElementById('sort-by')?.value || 'lastName-asc';
    const rows = Array.from(document.querySelectorAll('#passenger-table tbody tr'));

    // First filter rows based on search term
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });

    // Then sort visible rows
    const visibleRows = rows.filter(row => row.style.display !== 'none');
    visibleRows.sort((a, b) => {
        const [field, order] = sortBy.split('-');
        const aValue = field === 'rfid' ? 
            a.cells[0].textContent : // RFID is in first column
            a.cells[2].textContent; // LastName is in third column
        const bValue = field === 'rfid' ? 
            b.cells[0].textContent :
            b.cells[2].textContent;
        
        return order === 'asc' ? 
            aValue.localeCompare(bValue) : 
            bValue.localeCompare(aValue);
    });

    // Update table with sorted rows
    const tbody = document.querySelector('#passenger-table tbody');
    visibleRows.forEach(row => tbody.appendChild(row));
} 