// Create context menu item for images
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendImage",
    title: "Send image to Discord",
    contexts: ["image"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendImage") {
    // Open popup for image selection
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 320,
      height: 400
    });
  }
});

// Function to send data to your API
async function sendToApi(type, data) {
  try {
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId: localStorage.getItem('selectedThreadId'),
        type: type,
        data: data,
        message: ''
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
} 