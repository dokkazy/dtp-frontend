import envConfig from "@/configs/envConfig";
import { apiEndpoint } from "@/configs/routes";
import { sessionToken } from "@/lib/http";

export const chatApiRequest = {
  chat: (message: string) => {
    return fetch(`${envConfig.NEXT_PUBLIC_AI_AGENT_URL}${apiEndpoint.chat}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken.value}`,
      },
      body: JSON.stringify({
        query: message,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  },
  reset: () => {
    return fetch(`${envConfig.NEXT_PUBLIC_AI_AGENT_URL}${apiEndpoint.reset}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken.value}`,
      },
      body: JSON.stringify({
        query: "reset",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  },
};
