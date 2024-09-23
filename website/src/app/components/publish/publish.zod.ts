import { z } from "zod";

export type PublishComponenetType = z.infer<typeof componentSchema>;

const componentSchema = z.object({
  component: z.string(),
  createdBy: z.string().email(),
});

export default componentSchema;
