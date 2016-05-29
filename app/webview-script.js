const ipcRenderer = require('electron').ipcRenderer;

(function observeUnreadBadge() { // Wait for element to be available.
  const unreadBadge = document.querySelector('.unread-badge');

  if (unreadBadge) {
    // Look for changes to the unread messages badge.
    new MutationObserver(function(mutations) {
      ipcRenderer.send('unread', mutations[0].target.nodeValue.trim()); // Send number of unread messages.
    }).observe(unreadBadge, { subtree: true, characterData: true });
  } else {
    setTimeout(observeUnreadBadge, 2000);
  }
}());
