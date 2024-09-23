import db from "@/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    let component: any = await db.component.findUnique({ where: { id } });

    if (component) {
      const { id, createdAt, createdBy, ...rest } = component;
      component = rest;
    }
    return Response.json(component);
  } catch (e: any) {
    return Response.json({ success: false, error: e.message });
  }
}
