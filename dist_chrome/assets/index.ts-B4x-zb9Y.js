console.log("background script loaded");chrome.runtime.onMessage.addListener((e,r,o)=>(e.type==="PRODUCT_DATA"&&(console.log("Background received product data:",e.payload),o({received:!0})),!1));
//# sourceMappingURL=index.ts-B4x-zb9Y.js.map
