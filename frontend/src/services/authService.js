// authService.js

// Function to register a new user
function registerUser(username, password) {
    let users = JSON.parse(localStorage.getItem('app_users')) || {};
    users[username] = password;
    localStorage.setItem('app_users', JSON.stringify(users));
    return true;
}

// Function to log in a user
function loginUser(username, password) {
    let users = JSON.parse(localStorage.getItem('app_users')) || {};
    if (users[username] && users[username] === password) {
        localStorage.setItem('loggedInUser', username);
        return true;
    }
    return false;
}

// Function to log out a user
function logoutUser() {
    localStorage.removeItem('loggedInUser');
}

// Function to validate credentials
function validateCredentials(username, password) {
    let users = JSON.parse(localStorage.getItem('app_users')) || {};
    return users[username] && users[username] === password;
}

export { registerUser, loginUser, logoutUser, validateCredentials };