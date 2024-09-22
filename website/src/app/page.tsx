import { auth, signIn } from "@/auth";
import { UserView } from "./UserView";
import PlaygroundPage from "@/components/playground/playground";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return await signIn();

  return (
    <div className="max-w-screen-xl mx-auto mt-5">
      <UserView user={session.user} />
      <PlaygroundPage/>
    </div>
  );
}
