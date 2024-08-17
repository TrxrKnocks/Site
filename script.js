// Simulated data storage
let posts = [];

// Load posts from local storage on page load
document.addEventListener('DOMContentLoaded', loadPosts);

// Function to load posts from local storage
function loadPosts() {
    posts = JSON.parse(localStorage.getItem('posts')) || [];
    renderPosts();
}

// Function to render posts
function renderPosts() {
    const hotPosts = document.getElementById('hot-posts');
    const newPosts = document.getElementById('new-posts');
    const topPosts = document.getElementById('top-posts');

    hotPosts.innerHTML = '';
    newPosts.innerHTML = '';
    topPosts.innerHTML = '';

    // Sort and display posts
    const now = new Date().getTime();

    const hot = [...posts].sort((a, b) => b.votes - a.votes)
                          .filter(post => now - new Date(post.timestamp).getTime() <= 30 * 24 * 60 * 60 * 1000);

    const newest = [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const top = [...posts].sort((a, b) => b.votes - a.votes);

    hot.forEach(post => hotPosts.appendChild(createPostElement(post)));
    newest.forEach(post => newPosts.appendChild(createPostElement(post)));
    top.forEach(post => topPosts.appendChild(createPostElement(post)));
}

// Function to create a new post
function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (title && content) {
        const post = {
            id: Date.now(),
            title,
            content,
            votes: 0,
            timestamp: new Date().toISOString(),
            ip: ''
        };

        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();

        // Clear inputs
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
    } else {
        alert('Please fill in both fields');
    }
}

// Function to create post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = post.title;

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = post.content;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const voteCount = document.createElement('div');
    voteCount.className = 'vote-count';
    voteCount.textContent = post.votes;

    const upvote = document.createElement('div');
    upvote.className = 'emoji';
    upvote.innerHTML = '😍';
    upvote.onclick = () => vote(post.id, 1);

    const downvote = document.createElement('div');
    downvote.className = 'emoji';
    downvote.innerHTML = '💩';
    downvote.onclick = () => vote(post.id, -1);

    actions.appendChild(upvote);
    actions.appendChild(downvote);
    postDiv.appendChild(title);
    postDiv.appendChild(content);
    postDiv.appendChild(voteCount);
    postDiv.appendChild(actions);

    return postDiv;
}

// Function to vote
function vote(postId, change) {
    const post = posts.find(p => p.id === postId);
    const userIp = getUserIP();

    if (post.ip !== userIp) {
        post.votes += change;
        post.ip = userIp;
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    } else {
        alert('You have already voted on this post.');
    }
}

// Function to get user IP (simulated with localStorage in this case)
function getUserIP() {
    let userIp = localStorage.getItem('userIp');
    if (!userIp) {
        userIp = Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userIp', userIp);
    }
    return userIp;
}
