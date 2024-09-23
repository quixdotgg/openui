"use server";
import { auth, signIn } from "@/auth";
import Header from "@/components/Header";
import db from "@/db";
import ComponentExplorer from "./ComponentExplorer";

export default async function Home() {
  const session = await auth();
  if (!session?.user) return await signIn();

  const defaultComponents = await db.component.findMany({ take: 10 });

  return (
    <div className="max-w-screen-xl mx-auto mt-5">
      <Header />
      <ComponentExplorer defaultComponents={defaultComponents} />
    </div>
  );
}
