import SambaNova from "sambanova";
import type { ChatMessage } from "../types";

export const sambanovaService = {
  name: "sambanova",
  async chat(messages: ChatMessage[]) {
    async function* gen() {
      const baseUrl = process.env.SAMBA_NOVA_BASE_URL ?? process.env.SAMBANOVA_BASE_URL;
      if (!baseUrl) {
        yield "SambaNova configuration error: please set SAMBA_NOVA_BASE_URL (or SAMBANOVA_BASE_URL) in .env.local (example: https://api.YOUR_WORKSPACE.sambanova.ai).";
        return;
      }

      const apiKey = process.env.SAMBANOVA_API_KEY;
      if (!apiKey) {
        yield "SambaNova configuration error: SAMBANOVA_API_KEY not set in environment.";
        return;
      }

      const client = new SambaNova({
        baseURL: baseUrl,
        apiKey,
      });

      try {
        const chatCompletion = await client.chat.completions.create({
          messages,
          model: "Meta-Llama-3.3-70B-Instruct",
        });
        const text = chatCompletion.choices?.[0]?.message?.content || "";
        yield text;
      } catch (err: any) {
        console.error("SambaNova service error", err);
        const status = err?.status ?? "?";
        const msg = err?.message ?? JSON.stringify(err);
        yield `SambaNova error: ${status} ${msg}`;
      }
    }

    return gen();
  },
};
