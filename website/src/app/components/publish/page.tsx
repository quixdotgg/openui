import { auth, signIn } from "@/auth";
import Header from "@/components/Header";
import PlaygroundPage from "@/components/playground/playground";

export default async function Home() {
  const session = await auth();
  if (!session?.user) return await signIn();

  return (
    <div className="max-w-screen-xl mx-auto mt-5">
      <Header />
      <PlaygroundPage />
    </div>
  );
}
