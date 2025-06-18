import { createRoot } from "react-dom/client";
import "./style.css";
import { processProduct } from "@src/scripts/geminiProcess";

let lastProductData: any = null;

//func to wait for page to load before scraping, mainly for shopee cuz it doesn't work without waiting
function waitForSelector(
  selector: string,
  timeout = 5000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    function check() {
      const el = document.querySelector(selector);
      //stops loop if found element or more than 5secs
      if (el) return resolve(el);
      if (Date.now() - start > timeout) return resolve(null);
      //calls check again on next animation frame, repeatedly looping
      requestAnimationFrame(check);
    }
    //start check loop
    check();
  });
}

async function scrapeProductData() {
  const url = window.location.hostname;
  let title = "";
  let price = "";

  //use different selectors if on different sites (amazon, shopee, lazada)
  if (url.includes("amazon")) {
    console.log("using amazon scraper");
    title = document.getElementById("productTitle")?.textContent?.trim() || "";
    price =
      document.querySelector(".a-price .a-offscreen")?.textContent?.trim() ||
      document.getElementById("priceblock_ourprice")?.textContent?.trim() ||
      document.getElementById("priceblock_dealprice")?.textContent?.trim() ||
      "";
  } else if (url.includes("shopee")) {
    console.log("using shopee scraper");
    //shopee needs to wait for page to load otherwise won't work
    const titleEl = await waitForSelector("h1.vR6K3w");
    const priceEl = await waitForSelector("div.IZPeQz.B67UQ0");
    title = titleEl?.textContent?.trim() || "";
    price = priceEl?.textContent?.trim() || "";
  } else if (url.includes("lazada")) {
    console.log("using lazada scraper");
    title =
      document
        .querySelector(".pdp-mod-product-badge-title")
        ?.textContent?.trim() ||
      document
        .querySelector(".pdp-mod-product-badge-title-v2")
        ?.textContent?.trim() ||
      "";
    price =
      document
        .querySelector(".pdp-v2-product-price-content-salePrice-amount")
        ?.textContent?.trim() || "";
    if (!price) {
      const priceEl = await waitForSelector("span[data-spm-anchor-id]");
      price = priceEl?.textContent?.trim() || "";
    }
    price = price ? "$" + price : price;
  } else {
    // if none of the 3 sites then use generic selectors
    title = document.querySelector("h1")?.textContent?.trim() || "";
    price = document.querySelector("[class*=price]")?.textContent?.trim() || "";
  }

  return {
    title: title || "No product title found",
    price: price || "No price found",
  };
}

async function runScraper() {
  const product = await scrapeProductData();
  lastProductData = { ...product };
  chrome.runtime.sendMessage({
    type: "PRODUCT_DATA",
    payload: { ...product }
  });
}

let lastUrl = window.location.href;

//repeatedly checks every second if user navigated to another listing and then scraping if so
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    runScraper();
  }
}, 1000); // Check every second (adjust as needed)

//scrapes data on page load
runScraper();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PRODUCT_DATA") {
    scrapeProductData().then((product) => {
      sendResponse(product);
    });
    return true; // Keep channel open for async response
  }
});

