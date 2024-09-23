"use server";
import db from "@/db";
import { Prisma } from "@prisma/client";

export async function findComponents(params?: Prisma.ComponentFindManyArgs) {
  return db.component.findMany(params);
}
