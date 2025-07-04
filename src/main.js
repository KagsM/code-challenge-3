const baseURL = 'http://localhost:3000/posts';

function displayPosts() {
  fetch(baseURL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = `${post.topic} by ${post.author}`;
        div.dataset.id = post.id;
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });
    });
}

function handlePostClick(id) {
  fetch(`${baseURL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById('post-detail');
      detail.innerHTML = `
        <h3>${post.topic}</h3>
        <p><strong>Author:</strong> ${post.author}</p>
        <img src="${post.image}" alt="Post Image" />
        <p>${post.content}</p>
        <button id="delete-post-btn">Delete This Post</button>
    `;
    
      document.getElementById('delete-post-btn').addEventListener('click', () => {
        removePostFromUI(id);
      });
    });
}


function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPost = {
      topic: document.getElementById('topic').value,
      author: document.getElementById('author').value,
      image: document.getElementById('image').value,
      content: document.getElementById('content').value
    };

    fetch(baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
      form.reset();
      displayPosts();
    });
  });
}

function removePostFromUI(id) {

  const postList = document.getElementById('post-list');
  const postDivs = postList.querySelectorAll('div');

  postDivs.forEach(div => {
    if (div.dataset.id === String(id)) {
      div.remove();
    }
  });

  const detail = document.getElementById('post-detail');
  detail.innerHTML = `<p>Select a post to view its details.</p>`;
}


document.addEventListener('DOMContentLoaded', () => {
  addNewPostListener();
  displayPosts();
});