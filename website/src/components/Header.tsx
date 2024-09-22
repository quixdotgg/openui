"use server";
import { auth } from "@/auth";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <div className="my-8 flex gap-2 items-center">
      <Link href={"/"}>
        <h1 className="font-righteous font-bold text-3xl">OpenUi</h1>
      </Link>
      <span className="font-righteous font-medium text-[.9rem]">
        @{session?.user?.email ? session?.user?.email.split("@")[0] : ""}
      </span>
      <Link className="ml-auto" href={"/components/publish"}>
        publish
      </Link>
    </div>
  );
}
