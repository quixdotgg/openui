"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import componentSchema from "./publish.zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Editor, { Monaco } from "@monaco-editor/react";
import { Form } from "@/components/ui/form";
import publishComponent from "./action";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BotIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import generateComponent from "./generate";

export default function PublishForm({ userEmail }: { userEmail: string }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setGenerating] = useState(false);
  const defaultComponent = `
// modify below code for your component
export default function YourComponent() {
  return <button className="bg-red-500 rounded-sm px-3 py-2 border">Click</button>
}`;
  // 1. Define your form.
  const form = useForm<z.infer<typeof componentSchema>>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      component: defaultComponent,
      createdBy: userEmail,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof componentSchema>) {
    try {
      const component: any = await publishComponent(values);
      console.log(component);
      form.reset();
      if (component.id)
        toast({
          title: `Successfully Published Component !`,
          description: component.id,
          action: (
            <a
              target="_blank"
              href={`https://openui.quix.gg/api/component/${component.id}`}
            >
              <Button variant={"link"} size={"sm"}>
                link
              </Button>
            </a>
          ),
        });
    } catch (e: any) {
      toast({
        title: `Failed Publishing Component !`,
        variant: "destructive",
        description: e.message,
      });
    }
  }

  function handleEditorWillMount(_: any, monaco: Monaco) {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: 2,
    });
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>New Component</CardTitle>
          <CardDescription>Write the code for your component</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="h-[40dvh] rounded-sm overflow-hidden">
                <Editor
                  height="40dvh"
                  defaultLanguage="typescript"
                  value={form.watch("component")}
                  onChange={(value = "") => form.setValue("component", value)}
                  theme="vs-dark"
                  onMount={handleEditorWillMount}
                />
              </div>
              <div className="flex items-center">
                Generate with AI <BotIcon className="ml-2 h-6" />
              </div>
              <div className="flex items-start mt-2">
                <Textarea
                  className="w-[80%]"
                  placeholder="A bootstrap like button component"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                  size={"icon"}
                  disabled={isGenerating}
                  className="ml-2"
                  onClick={async () => {
                    setGenerating(true);
                    // call generate
                    const code = await generateComponent(prompt);
                    // set code to generated code
                    form.setValue("component", code);

                    // setGenerating false
                    setGenerating(false);
                  }}
                >
                  <BotIcon
                    className={cn("h-4", isGenerating && "animate-bounce")}
                  />
                </Button>
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
