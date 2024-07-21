document.addEventListener("DOMContentLoaded", function () {

    const createPostForm = document.getElementById('createPost');
    const accessToken = localStorage.getItem('accessToken');
    const postContainer = document.querySelector('.container');

    createPostForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = createPostForm.title.value;
        const content = createPostForm.content.value;

        const data = { title, content };

        axios.post('https://training-api-three.vercel.app/api/post', data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(() => {
            showToast("Post created successfully");
            fetchPosts();
        })
        .catch(handlePostError)
        .finally(() => {
            createPostForm.reset();
        });
    });

    function fetchPosts() {
        axios.get('https://training-api-three.vercel.app/api/post/feed?page=1&perPage=20')
        .then((response) => {
            const { posts } = response.data;
            renderPosts(posts);
        })
        .catch((error) => {
            console.error('Error fetching posts:', error);
        });
    }

    function renderPosts(posts) {
        postContainer.innerHTML = '';
        posts.forEach((post) => {
            createPostElement(post);
        });
    }

    function createPostElement(post) {
        const div = document.createElement('div');
        div.classList.add('post');

        const authorTimeDiv = document.createElement('div');
        authorTimeDiv.innerHTML = `
            <h1 class="author">${post.author.name} ${post.author.surname}</h1>
            <p class="time">${formatDateTime(post.createdAt)}</p>
        `;
        div.appendChild(authorTimeDiv);

        div.innerHTML += `
            <h1 class="title">${post.title}</h1>
            <p class="content">${post.content}</p>
        `;

        const reactionDiv = document.createElement('div');
        reactionDiv.classList.add('reaction');
        reactionDiv.innerHTML = `
            <div class="likes">
                <img id="react-icons" src="./photos/like.png" alt="like">
                <span>${post.likes}</span>
            </div>
            <div class="dislikes">
                <img id="react-icons" src="./photos/dislike.png" alt="dislike">
                <span>${post.dislikes}</span>
            </div>
        `;
        div.appendChild(reactionDiv);

        const removeBtn = document.createElement('img');
        removeBtn.src = "./photos/trash.png";
        removeBtn.classList.add("remove");
        removeBtn.style.width = "30px";
        removeBtn.style.height = "30px";
        removeBtn.addEventListener("click", () => {
            deletePost(post._id);
        });
        div.appendChild(removeBtn);

        postContainer.appendChild(div);
    }

    function deletePost(postId) {
        axios.delete(`https://training-api-three.vercel.app/api/post/${postId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }       
        })
        .then(() => {
            showToast("Post deleted successfully");
            fetchPosts();
        })
        .catch((error) => {
            console.error('Error deleting post:', error);
        });
    }

    function showToast(message) {
        Toastify({
            text: message,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: false,
        }).showToast();
    }

    function handlePostError(error) {
        if (error.response) {
            if (error.response.status === 400) {
                const { errors } = error.response.data;
                displayFormErrors(errors);
            } else {
                console.error('Server Error:', error.response.data.error);
                showToast('Server Error');
            }
        } else {
            console.error('Network Error:', error.message);
            showToast('Network Error');
        }
    }

    function displayFormErrors(errors) {
        for (const field in errors) {
            const input = createPostForm[field];
            const errorText = document.createElement('p');
            errorText.textContent = errors[field];
            errorText.classList.add('error');
            input.insertAdjacentElement('afterend', errorText);
        }
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

});
