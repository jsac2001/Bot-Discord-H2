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

document.addEventListener('DOMContentLoaded', async () => {
  await loadForumPosts();
  
  // Check if we have a selected image URL
  const { selectedImageUrl } = await chrome.storage.local.get('selectedImageUrl');
  if (selectedImageUrl) {
    document.getElementById('sendUrl').textContent = 'Send Image';
  }
});

document.getElementById('sendUrl').addEventListener('click', async () => {
  const threadId = document.getElementById('forumPosts').value;
  const message = document.getElementById('message').value;
  
  if (!threadId) {
    alert('Please select a forum post');
    return;
  }
  
  try {
    const { selectedImageUrl } = await chrome.storage.local.get('selectedImageUrl');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const payload = {
      threadId,
      type: selectedImageUrl ? 'image' : 'url',
      data: selectedImageUrl || tab.url,
      message
    };

    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Clear the stored image URL
    if (selectedImageUrl) {
      await chrome.storage.local.remove('selectedImageUrl');
    }
    
    const result = await response.json();
    console.log('Success:', result);
    window.close();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to send');
  }
}); 