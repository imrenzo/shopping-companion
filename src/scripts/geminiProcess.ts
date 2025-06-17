import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_KEY });

// get AI output with this function. just pass in product Name
async function processProduct(productName: string) {
    const prompt = generatePrompt(productName)
    const output = await sendAI(prompt)
    return output
}

function generatePrompt(productName: string) {
    const prompt = `Give me an environmental score for this product ${productName} from 0-100 and suggest any alternatives.
    Output in JSON without markdown using the given template. Template:
    {
    productName: "Tide Power Pods Laundry Detergent Pacs with Febreze Sport",
    score: 0,
    suggestedAlternative: "Alternative product name"
    }
    `
    return prompt
}

async function sendAI(input: string) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: input,
    });
    const output = response.text
    console.log(output);
    return output
}