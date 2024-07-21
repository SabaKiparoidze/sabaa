const logOutButton = document.getElementById('log-out-button');
const logOutDiv = document.getElementById('log-out-button');
const profile = document.getElementById('name');
const post = document.querySelector('.post');

profile.addEventListener('click', (event) => {
    event.preventDefault();
    if (logOutDiv.style.display === 'none') {
        logOutDiv.style.display = 'flex';
    } else {
        logOutDiv.style.display = 'none';
    }
});

logOutButton.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = 'login.html';
});
