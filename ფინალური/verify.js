axios.defaults.headers.common["Accept-Language"] = "ka"

const name = document.getElementById('name');

const refreshToken = localStorage.getItem('refreshToken');

if(!refreshToken){
    window.location.href = 'login.html';
}else{
    axios.get('https://training-api-three.vercel.app/api/token', {
        headers: {
            'Authorization': `Bearer ${refreshToken}`
        }
    })
    .then((response) => {
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        axios.get('https://training-api-three.vercel.app/api/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            name.textContent = user.name + ' ' + user.surname;   
            document.getElementById('loading').remove();
            document.querySelector('nav').style.display = 'flex';
            document.body.style.display = 'block';  
            document.querySelector('aside').style.display = 'flex';
            document.querySelectorAll('.container .post').forEach(post => {
            post.style.display = 'block';
            document.getElementById('createPost').style.display = 'flex';
            });
         })
         .catch(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = 'login.html';
         })
         .finally(() => {

          })
    })
    .catch(() => {
        localStorage.removeItem('refreshToken');
        window.location.href = 'login.html';
    })
    .finally(() => {
        
    })

}