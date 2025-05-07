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

function showFormError(formElement, message) {
    // Remove any existing error messages
    const existingError = formElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-circle-exclamation"></i>${message}`;
    formElement.insertBefore(errorDiv, formElement.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');

    // Toggle between login and signup forms
    showSignupBtn?.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    });

    showLoginBtn?.addEventListener('click', () => {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    // Handle login form submission
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            username: e.target.username.value,
            password: e.target.password.value
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                showFormError(loginForm, data.message || 'Invalid username or password');
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('rfid', data.rfid || '');
            window.location.href = '/dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            showFormError(loginForm, 'Unable to connect to server. Please try again later.');
        }
    });

    // Handle signup form submission
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear any existing errors
        const existingErrors = signupForm.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());

        // Validate password match
        if (e.target.password.value !== e.target.confirmPassword.value) {
            showFormError(signupForm, 'Passwords do not match');
            e.target.confirmPassword.parentElement.classList.add('error');
            return;
        }

        // Validate password length
        if (e.target.password.value.length < 8) {
            showFormError(signupForm, 'Password must be at least 8 characters long');
            e.target.password.parentElement.classList.add('error');
            return;
        }

        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            role: e.target.role.value
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                showFormError(signupForm, data.message || 'Failed to create account');
                return;
            }

            showNotification('Account created successfully!', 'success');
            // Switch to login form
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
            signupForm.reset();
        } catch (error) {
            console.error('Signup error:', error);
            showFormError(signupForm, 'Unable to connect to server. Please try again later.');
        }
    });

    // Add role change handler
    const roleSelect = document.getElementById('role');
    const rfidGroup = document.querySelector('.rfid-group');

    roleSelect?.addEventListener('change', (e) => {
        if (e.target.value === 'passenger') {
            if (rfidGroup) {
                rfidGroup.style.display = 'block';
            }
            const rfidInput = document.getElementById('rfid');
            if (rfidInput) {
                rfidInput.setAttribute('required', 'true');
            }
        } else {
            if (rfidGroup) {
                rfidGroup.style.display = 'none';
            }
            const rfidInput = document.getElementById('rfid');
            if (rfidInput) {
                rfidInput.removeAttribute('required');
            }
        }
    });
});

// Helper functions
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`Element with id '${inputId}' not found`);
        return;
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    if (input.parentElement) {
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.parentElement.appendChild(errorDiv);
    }
    input.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 