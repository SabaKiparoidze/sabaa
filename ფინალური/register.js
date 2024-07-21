axios.defaults.headers.common["Accept-Language"] = "ka";

const registerForm = document.getElementById("register");
const registerButton = document.getElementById('register_button');

registerForm.addEventListener("submit", registration);

async function registration(event) {
  event.preventDefault();

  errorDelete();

  registerButton.textContent = 'იტვირთება...'

  const name = registerForm.name.value;
  const surname = registerForm.surname.value;
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const repeat_password = registerForm.repeat_password.value;
  const data = {
    name: name,
    surname: surname,
    email: email,
    password: password,
    repeat_password: repeat_password,
  };

  try { 
    const response = await axios.post("https://training-api-three.vercel.app/api/user", data);
    registerButton.textContent = "რეგისტრაცია";
    window.location.href = 'login.html';
  } catch (error) {
    if(error.response.status===400){
            const data = error.response.data
            if(data.errors){
                registerButton.textContent = "რეგისტრაცია";
                const errors = data.errors
                const fields = Object.keys(errors)
                fields.forEach((field) => {
                    const input = registerForm[field];
                    const errorText = document.createElement('p');
                    errorText.textContent = errors[field];
                    input.insertAdjacentElement('afterend', errorText);
                    errorText.classList.add('error')
                })
            }
    }else{
        const input = registerForm.repeat_password
        const errorText = document.createElement("p");
        errorText.textContent = error.response.data.error;
        input.insertAdjacentElement("afterend", errorText);
        errorText.classList.add("error");
    }
  }
}

function errorDelete() {

    const errors = registerForm.querySelectorAll(".error");

    errors.forEach((error) => error.remove());
}

const loginIfNotButton = document.getElementById('loginIfNot');

loginIfNotButton.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = 'login.html';  
});
