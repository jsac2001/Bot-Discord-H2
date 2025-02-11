// Fetch forum posts when popup opens
async function loadForumPosts() {
  try {
    const response = await fetch('http://localhost:3000/api/forum-posts');
    const posts = await response.json();
    
    const select = document.getElementById('forumPosts');
    select.innerHTML = '';
    
    posts.forEach(post => {
      const option = document.createElement('option');
      option.value = post.id;
      option.textContent = post.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading forum posts:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadForumPosts);

document.getElementById('sendUrl').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;
  const threadId = document.getElementById('forumPosts').value;
  const message = document.getElementById('message').value;
  
  if (!threadId) {
    alert('Please select a forum post');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId,
        type: 'url',
        data: url,
        message
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    console.log('Success:', result);
    window.close();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to send URL');
  }
}); 