import { GoogleGenAI } from "@google/genai";

interface ChatResponse {
  text: string;
}

export class GeminiCorrection {
  private ai: GoogleGenAI;
  private chat: any;
  private content: string;

  constructor(apiKey: string, contents: string) {
    this.content = contents;
    this.ai = new GoogleGenAI({
      vertexai: false,
      apiKey: apiKey,
    });
    this.initChat();
  }

  private initChat() {
    this.chat = this.ai.chats.create({
      model: "gemini-2.5-flash-lite",
      history: [
        {
          role: "user",
          parts: [{ text: this.content }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Ok!, C'est compris, je vais corriger tous vos textes suivant vos instructions",
            },
          ],
        },
      ],
    });
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      // Correction : utiliser le bon format pour le message
      const response = await this.chat.sendMessage({ message });
      return {
        text: response.text,
      };
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    }
  }

  async sendMessageStream(message: string): Promise<AsyncGenerator<string>> {
    try {
      // Correction : utiliser le bon format pour le message en stream
      const response = await this.chat.sendMessageStream([{ text: message }]);

      const generator = async function* () {
        for await (const chunk of response) {
          yield chunk.text;
        }
      };
      return generator();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message en stream:", error);
      throw error;
    }
  }

  resetChat(): void {
    this.initChat();
  }
}
