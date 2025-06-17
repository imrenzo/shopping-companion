import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

// get AI output objecy with this function. just pass in product Name
export async function processProduct(productName: string) {
    const prompt = generatePrompt(productName)
    const output = await sendAI(prompt)
    console.log(output)
    const match = (output as string).match(/```json\s*([\s\S]*?)\s*```/);
    if (!match) {
        throw new Error("No valid JSON block found in output");
    }
    const jsonString = match[1];
    const object: outputProps = await JSON.parse(jsonString);
    // access object fields with outputProps interface
    return object
}

function generatePrompt(productName: string) {
    const prompt = `Give me an environmental score for this product ${productName} from 0-100 and suggest any alternatives.
    Output in JSON using template:
    {
    productName: "Tide Power Pods Laundry Detergent Pacs with Febreze Sport",
    score: 0,
    suggestedAlternative: "Alternative product name"
    summaryOfEnvironmentalImpact: ""
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
    return output
}