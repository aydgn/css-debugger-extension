// Listen for clicks on the extension icon in the browser toolbar
chrome.action.onClicked.addListener(async tab => {
  try {
    // Execute the toggleDebugStyles function in the context of the active tab
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectDebugger,
      args: [tab.id],
    });
  } catch (error) {
    console.error("Error injecting script:", error);
  }
});

// This function will be injected into the page and contains all necessary code
function injectDebugger(tabId) {
  // Define color mapping for different HTML elements
  const elementStyles = {
    '*': '#E63946',
    'body *': '#2A9D8F',
    'div': '#457B9D',
    'article': '#9B5DE5',
    'section': '#00BCD4',
    'nav': '#F4A261',
    'header': '#FF7043',
    'footer': '#4CAF50',
    'main': '#7B1FA2',
    'aside': '#FF4081',
    'form': '#009688',
    'ul, ol': '#5C6BC0',
    'li': '#FF8A65',
    'p': '#66BB6A',
    'a': '#FFB74D',
    'img': '#4DD0E1',
    'button, input, select, textarea': '#EC407A'
  };

  /**
   * Generates CSS rules for debugging element outlines
   * @param {Object.<string, string>} styles - An object where keys are CSS selectors and values are colors
   * @returns {string} A string containing CSS rules with outlines for elements and their pseudo-elements
   */
  function generateCSS(styles) {
    return Object.entries(styles).map(([selector, color]) => `
      ${selector} {
        outline: 1px solid ${color} !important;
      }

      ${selector}::before,
      ${selector}::after {
        outline: 1px dashed ${color} !important;
      }`
    ).join('\n');
  }

  // Create a unique storage key for this tab
  const tabKey = `tab_${tabId}`;

  // Get the current state for this tab from storage
  chrome.storage.local.get([tabKey], result => {
    const isActive = result[tabKey] || false;
    const newState = !isActive;

    // Update the state in storage and apply/remove styles accordingly
    chrome.storage.local.set({ [tabKey]: newState }, () => {
      const styleId = "css-debugger-styles";
      let styleElement = document.getElementById(styleId);

      if (newState) {
        // Add debug styles if they don't exist
        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = styleId;
          styleElement.textContent = generateCSS(elementStyles);
          document.head.appendChild(styleElement);
        }
      } else {
        // Remove debug styles if they exist
        if (styleElement) {
          styleElement.remove();
        }
      }
    });
  });
}
