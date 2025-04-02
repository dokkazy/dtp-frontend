import { z } from "zod";
const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_AI_AGENT_URL: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_AI_AGENT_URL: process.env.NEXT_PUBLIC_AI_AGENT_URL,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Giá trị khai báo không hợp lệ trong .env");
}

const envConfig = configProject.data;

export default envConfig;
