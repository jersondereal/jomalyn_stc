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
    const travelModal = document.getElementById('travel-modal');
    const cashInModal = document.getElementById('cashin-modal');
    const deleteModal = document.getElementById('delete-confirmation-modal');
    
    // Button elements
    const travelBtn = document.getElementById('travel-btn');
    const cashInBtn = document.getElementById('cashin-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    // Form elements
    const travelForm = document.getElementById('travel-form');
    const cashInForm = document.getElementById('cashin-form');

    // Destination fare mapping
    const DESTINATION_FARES = {
        'Baras': 40.00,
        'Ngolos': 40.00,
        'Sulangan': 50.00,
    };

    // Add destination change handler
    const destinationSelect = document.getElementById('destination');
    const fareInput = document.getElementById('fare');

    destinationSelect?.addEventListener('change', (e) => {
        const selectedDestination = e.target.value;
        if (fareInput && selectedDestination) {
            fareInput.value = DESTINATION_FARES[selectedDestination].toFixed(2);
        }
    });

    let currentDeleteTarget = null;

    // Modal handlers
    travelBtn?.addEventListener('click', () => {
        travelModal.classList.add('active');
        // Clear any existing errors
        const existingError = travelModal.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    });
    
    cashInBtn?.addEventListener('click', () => {
        cashInModal.classList.add('active');
        // Clear any existing errors
        const existingError = cashInModal.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            travelModal?.classList.remove('active');
            cashInModal?.classList.remove('active');
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
    travelForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            RFID: e.target.rfid.value,
            destination: e.target.destination.value,
            fare: parseFloat(e.target.fare.value)
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/travel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                showModalError(travelModal, data.message || 'Failed to process travel payment');
                return;
            }

            showNotification('Travel payment processed successfully!', 'success');
            travelModal.classList.remove('active');
            fetchTransactions();
            e.target.reset();
        } catch (error) {
            console.error('Error processing travel payment:', error);
            showModalError(travelModal, 'Unable to connect to server. Please try again later.');
        }
    });

    cashInForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            RFID: e.target.rfid.value,
            amount: parseFloat(e.target.amount.value)
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/cashin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                showModalError(cashInModal, data.message || 'Failed to process cash-in');
                return;
            }

            showNotification('Cash-in processed successfully!', 'success');
            cashInModal.classList.remove('active');
            fetchTransactions();
            e.target.reset();
        } catch (error) {
            console.error('Error processing cash-in:', error);
            showModalError(cashInModal, 'Unable to connect to server. Please try again later.');
        }
    });

    // Delete confirmation handler
    confirmDeleteBtn?.addEventListener('click', async () => {
        const targetId = window.currentDeleteTarget;
        if (!targetId) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/transaction/${targetId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                showModalError(deleteModal, data.message || 'Failed to delete transaction');
                return;
            }

            showNotification('Transaction deleted successfully!', 'success');
            deleteModal.classList.remove('active');
            fetchTransactions();
            window.currentDeleteTarget = null;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            showModalError(deleteModal, 'Unable to connect to server. Please try again later.');
        }
    });

    // Add filter sections to tables
    const transactionSection = document.querySelector('#transactions .section-header');

    const transactionFilters = document.createElement('div');
    transactionFilters.className = 'search-filter-container';
    transactionFilters.innerHTML = `
        <div class="search-group">
            <input autocomplete="off"  
                type="text" 
                id="transaction-search" 
                placeholder="Search by RFID or destination..."
            />
        </div>
        <div class="filter-group">
            <label for="transaction-type">Type:</label>
            <select id="transaction-type">
                <option value="">All</option>
                <option value="Cash-in">Cash In</option>
                <option value="Payment">Travel</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="transaction-date">Date:</label>
            <input autocomplete="off"  type="date" id="transaction-date" />
        </div>
    `;

    transactionSection?.insertAdjacentElement('afterend', transactionFilters);

    // Add filter event listeners
    document.getElementById('transaction-search')?.addEventListener('input', filterTransactions);
    document.getElementById('transaction-type')?.addEventListener('change', filterTransactions);
    document.getElementById('transaction-date')?.addEventListener('change', filterTransactions);

    // Initial data fetch
    fetchTransactions();
});

function fetchTransactions() {
    fetch(`${config.API_BASE_URL}/api/transactions`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch transactions');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#transactions-table tbody');
            if (!tableBody) return;
            
            const userRole = localStorage.getItem('role');
            const isAdmin = userRole === 'Admin';
            const isPassenger = userRole === 'Passenger';
            
            tableBody.innerHTML = '';
            data.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.RFID || '-'}</td>
                    <td>${transaction.TransactionType || '-'}</td>
                    <td>₱${Number(transaction.Amount || 0).toFixed(2)}</td>
                    <td>${transaction.Destination || '-'}</td>
                    <td>${transaction.Fare ? `₱${Number(transaction.Fare).toFixed(2)}` : '-'}</td>
                    <td class="balance">₱${Number(transaction.RemainingBalance || 0).toFixed(2)}</td>
                    <td>${new Date(transaction.Timestamp).toLocaleString()}</td>
                    ${!isPassenger && isAdmin ? `
                        <td>
                            <button class="destructive" onclick="deleteTransaction('${transaction.TransactionID}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    ` : '<td>-</td>'}
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching transactions:', error));
}

// Helper function for transaction management
window.deleteTransaction = function(transactionId) {
    const deleteModal = document.getElementById('delete-confirmation-modal');
    if (!deleteModal) return;
    
    window.currentDeleteTarget = transactionId;
    deleteModal.classList.add('active');
};

function filterTransactions() {
    const searchTerm = document.getElementById('transaction-search')?.value.toLowerCase() || '';
    const type = document.getElementById('transaction-type')?.value || '';
    const date = document.getElementById('transaction-date')?.value || '';
    const rows = document.querySelectorAll('#transactions-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const typeMatch = !type || row.children[1].textContent === type;
        
        // Improved date matching
        let dateMatch = true;
        if (date) {
            const transactionDate = new Date(row.children[6].textContent).toISOString().split('T')[0];
            dateMatch = transactionDate === date;
        }
        
        const searchMatch = text.includes(searchTerm);

        row.style.display = typeMatch && dateMatch && searchMatch ? '' : 'none';
    });
} 