# Sustainability Shopping Companion for LifeHack 2025

## Intro
Our team has made a browser extension and mobile app that helps users make eco-friendly shopping decisions by providing real-time sustainability scores, clear visual impact indicators, and alternative product recommendations as they shop online. The platform ensures reliable data through trusted third-party certifications, verified databases, and transparent sourcing methods. To encourage ongoing engagement, it includes personalized tips, gamified achievements, and seamless integration into popular e-commerce platforms. The user experience balances depth and simplicity through intuitive design and digestible insights tailored for everyday use.

## Getting Started

### Method 1
#### Load your extension
For Chrome
1. Open - Chrome browser
2. Access - [chrome://extensions](chrome://extensions)
3. Tick - Developer mode
4. Find - Load unpacked extension
5. Select - `dist_chrome` folder in this project

### Method 2 (if method 1 fails)
#### Delete local cloned repository
1. Delete local cloned repository.

#### Get API Key
1. Go to https://aistudio.google.com/app/apikey and get Gemini API Key
2. In project folder, under same directory as `package.json`, create a `.env` file containing the key:

VITE_GEMINI_KEY=your_api_key_here

#### Developing and building
1. Clone this repository
2. Run `yarn` or `npm i` (check your node version >= 16)
3. Run `yarn dev:chrome`

#### Load your extension
For Chrome
1. Open - Chrome browser
2. Access - [chrome://extensions](chrome://extensions)
3. Tick - Developer mode
4. Find - Load unpacked extension
5. Select - `dist_chrome` folder in this project (after dev or build)
