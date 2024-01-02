// Event listener for extension icon click
chrome.action.onClicked.addListener(function (tab) {
    try {
      var searchTerm = extractSearchQuery(tab.url);
  
      if (!searchTerm) {
        // If no recognized parameter is found, use the entire title as the search query
        searchTerm = extractSearchQueryFromTitle(tab.title);
      }
  
      hitYouTube(searchTerm);
    } catch (error) {
      console.error("Error in event handler:", error.message);
    }
  });
  
  // Function to open YouTube with the search term
  const hitYouTube = (searchTerm) => {
    try {
      var youtubeUrl =
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(searchTerm);
      chrome.tabs.create({ url: youtubeUrl });
    } catch (error) {
      console.error("Error in hitYouTube:", error.message);
    }
  }
  
  // Function to extract the search query from the URL
  function extractSearchQuery(url) {
    try {
      var urlObject = new URL(url);
      var searchParams = urlObject.searchParams;
  
      // Check for recognized search query parameters
      return (
        searchParams.get("q") ||
        searchParams.get("k") ||
        searchParams.get("query") ||
        searchParams.get("search") ||
        searchParams.get("search_query") ||
        null
      );
    } catch (error) {
      console.error("Error in extractSearchQuery:", error.message);
      return null;
    }
  }
  
  // Function to extract the search query from the page title
  function extractSearchQueryFromTitle(title) {
    try {
      // Use a regular expression to match the desired part of the title
      var regex = /^(.*?)(?: - | \| |,|:|-|\bAmazon\.com\b|\bEbay\.com\b|$)/; // Matches everything until the first " - ", " | ", ",", ":", "Amazon.com", "Ebay.com", or end of the string
      var match = title.match(regex);
  
      if (match && match[1]) {
        return match[1].split(',')[0].trim(); // Extract the portion before the first comma
      }
  
      // If no match is found, use the entire title
      return title.trim();
    } catch (error) {
      console.error("Error in extractSearchQueryFromTitle:", error.message);
      return title.trim();
    }
  }
  
// Event listener for keyboard shortcut
chrome.commands.onCommand.addListener(function (command) {
    if (command === "triggerYouTubeIt") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var searchTerm = extractSearchQuery(tabs[0].url) || extractSearchQueryFromTitle(tabs[0].title) || 'No Search Term';
        hitYouTube(searchTerm);
      });
    }
  });
  
  chrome.contextMenus.create({
    title: "📺 YouTube It \"%s\"",
    contexts: ["selection"],
    id: "tubeItContextMenu" // Unique identifier for the menu item
  });
  
  // Event listener for the context menu item click
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "tubeItContextMenu") {
      // Handle the selected text, e.g., open YouTube with the selected text
      var selectedText = info.selectionText;
      if (selectedText) {
        openYouTubeWithSelectedText(selectedText);
      }
    }
  });
  
  // Function to open YouTube with a search term
  function openYouTubeWithSelectedText(searchTerm) {
    var youtubeUrl =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(searchTerm);
    chrome.tabs.create({ url: youtubeUrl });
  }
  
  