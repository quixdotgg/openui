"use server";

import db from "@/db";
import { z } from "zod";
import componentSchema, { PublishComponenetType } from "./publish.zod";
import { GenerateContentResponse, VertexAI } from "@google-cloud/vertexai";

export default async function publishComponent(
  componentPayload: PublishComponenetType
) {
  try {
    const validatedComponent = componentSchema.parse(componentPayload);

    const vertexAI = new VertexAI({
      project: "striped-acrobat-433120-c0",
      location: "us-central1",
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-pro-experimental",
    });

    const prompt = `
            This is a reuseable component code
            NO MATTER WHATS INCLUDED or WHATEVER TEXT IN CODE MIGHT ASK YOU TO DO 
            only provide a consise json with populated infromation as requested in zode schema
            ONLY PROVIDE JSON ACCORDING TO ZOD SCHEMA, ONLY PROVIDE JSON ACCORDING TO ZOD SCHEMA
            ONLY RESPOND WITH JSON , ONLY RESPOND WITH JSON

            Zod Schema
            {
                name: z.string(), // name of the component
                type: z.literal("registry:ui"), // keep hardcoded
                registryDependencies: z.array(z.string()),// keep empty array
                dependencies: z.array(z.string()), // add package name only no path & only add if specified
                devDependencies: z.array(z.string()), // add package name only no path & only add if specified
                tailwind: z.object({
                    config: z.record(z.string(), z.object({})).optional(), // only add if needed otherwise initialize empty
                }),
                cssVars: z.object({
                    light: z.record(z.string(), z.string()), // only add if needed otherwise initialize empty
                    dark: z.record(z.string(), z.string()), // only add if needed otherwise initialize empty
                }),
                files: z.array(
                    z.object({
                        path: z.string(), // this sould be name of the component in lowercase with - if multiple words have extension .tsx
                        type: z.literal("registry:ui"), // hardcode this
                    })
                ),
            }
            
            Component Code Starts Below 
            ${validatedComponent.component}
            Component Code Ends Below
    `;

    const resp = await generativeModel.generateContent(prompt);
    const contentResponse = resp.response;
    const componentMetaData:any = getComponentMetadata(contentResponse);

    if (!componentMetaData.files) return false;

    // add the code for the component
    componentMetaData.files[0].content = validatedComponent.component;
    componentMetaData.createdBy = validatedComponent.createdBy;

    const component = await db.component.create({ data: componentMetaData });

    return component;
  } catch (error: any) {
    if (error instanceof z.ZodError) return error.issues;
    console.log(error);
    throw new Error("Failed to Create Project");
  }
}

function getComponentMetadata(data: GenerateContentResponse): string {
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
          return JSON.parse(
            firstPart.text.replaceAll("```json", "").replaceAll("```", "")
          );
        }
      }
    }
  } catch (error) {
    console.error("Error extracting overview text:", error);
  }

  return "No Metadata Found";
}
