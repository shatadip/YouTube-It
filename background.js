// background.js

// Event listener for extension icon click
chrome.action.onClicked.addListener(function (tab) {
    try {
      var searchTerm = extractSearchQuery(tab.url);
  
      if (!searchTerm) {
        // If no recognized parameter is found, use the entire title as the search query
        searchTerm = extractSearchQueryFromTitle(tab.title);
        // alertUser('Search Term: ' + searchTerm);
      }
  
      hitYouTube(searchTerm);
    } catch (error) {
      console.error("Error in event handler:", error.message);
    }
  });
  
  // Function to display notifications
  const alertUser = (msg) => {
    chrome.notifications.create(
      "Message",
      {
        type: "basic",
        iconUrl: "icon-48.png",
        title: 'YouTube It',
        message: msg
      }
    );
    chrome.notifications.clear("Message");
  }
  
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
  