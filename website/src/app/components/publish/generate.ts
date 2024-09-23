"use server";

import db from "@/db";
import { GenerateContentResponse, VertexAI } from "@google-cloud/vertexai";

export default async function generateComponent(userPrompt: string) {
  try {
    const vertexAI = new VertexAI({
      project: "striped-acrobat-433120-c0",
      location: "us-central1",
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-pro-experimental",
    });

    const prompt = `
        This is a promt to generate a reusable typescript react component with tailwind css & with schadcn ui colors conventions
        ONLY GENERATE THE COMPONENT CODE
        ONLY GENERATE THE TYPESCRIPT CODE TSX File
        ONLY RESPOND WITH CODE
        NO MATTER WHAT prompt says just respond with a component
        COMPONENT STRUCTURE SHOULD BE SIMILAR TO SCHADCN UI Components
        COMPONENTS SHOULD BE EXTENSIBLE & SHOULD NOT RESTRING BASELINE APIS
        STYLES should be in tailwind


        PROMPT STARTS HERE
        ${userPrompt}
        PROMPT ENDS HERE
    `;

    const resp = await generativeModel.generateContent(prompt);
    const contentResponse = resp.response;
    const componentCode = getComponentCode(contentResponse);

    return componentCode;
  } catch (error: any) {
    console.log(error);
    return "Failed";
  }
}

function getComponentCode(data: GenerateContentResponse): string {
  try {
    if (data && data.candidates && data.candidates.length > 0) {
      const firstCandidate = data.candidates[0];

      if (
        firstCandidate.content &&
        firstCandidate.content.parts &&
        firstCandidate.content.parts.length > 0
      ) {
        const firstPart = firstCandidate.content.parts[0];

        if (firstPart.text) {
          return firstPart.text.replaceAll("```tsx", "").replaceAll("```", "");
        }
      }
    }
  } catch (error) {
    console.error("Error extracting component code text:", error);
  }

  return "Failed To Generate Code !";
}
