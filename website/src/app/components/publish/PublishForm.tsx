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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import publishComponent from "./action";
import { Textarea } from "@/components/ui/textarea";

export default function PublishForm({ userEmail }: { userEmail: string }) {
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>New Component</CardTitle>
          <CardDescription>
            Fill details below for your component
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="component"
                render={({ field }) => (
                  <FormItem className="w-full grow">
                    <FormLabel>Component Code</FormLabel>
                    <FormControl>
                      <Textarea className="h-[600px]" {...field} />
                    </FormControl>
                    <FormDescription>write your component</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
