import { auth, signIn } from "@/auth";
import Header from "@/components/Header";
import PublishForm from "./PublishForm";

export default async function Publish() {
  const session = await auth();
  const userEmail = session?.user?.email || "";
  if (!userEmail) return await signIn();

  return (
    <div className="max-w-screen-xl mx-auto mt-5">
      <Header />
      <PublishForm userEmail={userEmail}/>
    </div>
  );
}