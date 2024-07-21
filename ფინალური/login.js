axios.defaults.headers.common["Accept-Language"] = "ka";

const loginForm = document.getElementById("login");
const loginButton = document.getElementById('login_button');

loginForm.addEventListener("submit", login);

async function login(event) {
  event.preventDefault();

  errorDelete();

  loginButton.textContent = 'იტვირთება...';

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  const data = {
    email: email,
    password: password,
  };

  axios.post("https://training-api-three.vercel.app/api/login", data)
  .then((response) => {
    const { refreshToken } = response.data;
    localStorage.setItem('refreshToken', refreshToken);
    window.location.href = 'index.html';
  })
  .catch((error) => {
    const input = loginForm.password;
    const errorText = document.createElement('p');
    errorText.classList.add('error');
    errorText.textContent = error.response.data.error;
    input.insertAdjacentElement('afterend', errorText);
  })
  .finally(() => {
    loginButton.textContent = "ავტორიზირება";
  });
}

function errorDelete() {
  const errors = loginForm.querySelectorAll(".error");
  errors.forEach((error) => error.remove());
}

const registerIfNotButton = document.getElementById('registerIfNot');

registerIfNotButton.addEventListener('click', () => {
  window.location.href ='register.html';
});