function injectDebugger(tabId){let elementStyles={"*":"#E63946","body *":"#2A9D8F",div:"#457B9D",article:"#9B5DE5",section:"#00BCD4",nav:"#F4A261",header:"#FF7043",footer:"#4CAF50",main:"#7B1FA2",aside:"#FF4081",form:"#009688","ul, ol":"#5C6BC0",li:"#FF8A65",p:"#66BB6A",a:"#FFB74D",img:"#4DD0E1","button, input, select, textarea":"#EC407A"};let tabKey="tab_"+tabId;chrome.storage.local.get([tabKey],result=>{let newState=!(result[tabKey]||!1);chrome.storage.local.set({[tabKey]:newState},()=>{var styles;let styleElement=document.getElementById("css-debugger-styles");newState?styleElement||((styleElement=document.createElement("style")).id="css-debugger-styles",styleElement.textContent=(styles=elementStyles,Object.entries(styles).map(([selector,color])=>`
      ${selector} {
        outline: 1px solid ${color} !important;
      }
      /* Add outlines to pseudo-elements for complete visual debugging */
      ${selector}::before,
      ${selector}::after {
        outline: 1px dashed ${color} !important;
      }`).join("\n")),document.head.appendChild(styleElement)):styleElement&&styleElement.remove()})})}chrome.action.onClicked.addListener(async tab=>{try{await chrome.scripting.executeScript({target:{tabId:tab.id},func:injectDebugger,args:[tab.id]})}catch(error){console.error("Error injecting script:",error)}});