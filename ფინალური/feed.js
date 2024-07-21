const container = document.querySelector('.container');
const feed = document.getElementById('feed');

let postsArray = [];

axios.get('https://training-api-three.vercel.app/api/post/feed?page=1&perPage=20')
.then((response) => {
    const { posts } = response.data;
    postsArray = posts;

    postsArray.forEach((post) => {
        createPost(post, container);
    });
})

function createPost(post, container){
    const div = document.createElement('div');
    div.classList.add('post');

const authorTimeDiv = document.createElement('div');

const author = document.createElement('h1');
author.classList.add('author');
author.textContent = post.author.name + ' ' + post.author.surname;

const time = document.createElement('p');
time.classList.add('time');
time.textContent = formatDateTime(post.createdAt);  

authorTimeDiv.appendChild(author);
authorTimeDiv.appendChild(time);
div.appendChild(authorTimeDiv);

const title = document.createElement('h1');
title.classList.add('title');
title.textContent = post.title;
div.appendChild(title);

const content = document.createElement('p');
content.classList.add('content');
content.textContent = post.content;
div.appendChild(content);

const reactionDiv = document.createElement('div');
reactionDiv.classList.add('reaction');

const likesDiv = document.createElement('div');
likesDiv.classList.add('likes');

const likeImg = document.createElement('img');
likeImg.id = 'react-icons';
likeImg.src = './photos/like.png';
likeImg.alt = 'like';



const likeSpan = document.createElement('span');
likeSpan.classList.add('like-span');
likeSpan.textContent = post.likes; 

likesDiv.appendChild(likeImg);
likesDiv.appendChild(likeSpan);

const dislikesDiv = document.createElement('div');
dislikesDiv.classList.add('dislikes');

const dislikeImg = document.createElement('img');
dislikeImg.id = 'react-icons';
dislikeImg.src = './photos/dislike.png';
dislikeImg.alt = 'dislike';

const dislikeSpan = document.createElement('span');
dislikeSpan.classList.add('dislike-span');
dislikeSpan.textContent = post.dislikes;

dislikesDiv.appendChild(dislikeImg);
dislikesDiv.appendChild(dislikeSpan);

reactionDiv.appendChild(likesDiv);
reactionDiv.appendChild(dislikesDiv);

div.appendChild(reactionDiv);

let remove = document.createElement("img");
remove.src = "./photos/trash.png";
remove.classList.add("remove");
remove.style.width = "30px";
remove.style.height = "30px";
div.appendChild(remove);

container.appendChild(div);

const accessToken = localStorage.getItem('accessToken');

remove.addEventListener("click", function () {
    axios.delete(`https://training-api-three.vercel.app/api/post/${post._id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }       
    })
    .then(() => {
        container.removeChild(div);
    })
    .catch(() => {
        
    });
});


likeImg.addEventListener('click', () => {
    axios.post('https://training-api-three.vercel.app/api/reaction', {
        postId: post._id,
        reaction : 'like',
    },
    {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(() => {
          likeSpan.textContent = post.likes + 1;
         
     })
     .catch((error) => {
          console.log(error);
      })
});


dislikeImg.addEventListener('click', () => {
    axios.post('https://training-api-three.vercel.app/api/reaction', {
        postId: post._id,
        reaction : 'dislike',
    },
    {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(() => {
        dislikeSpan.textContent = post.dislikes + 1;
     })
     .catch((error) => {
          console.error(error);
      })
});


}
    

function formatDateTime(isoString) {

    const date = new Date(isoString);

    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getUTCMonth()];


    return `${hours}:${minutes}, ${day} ${month}`;

    
}