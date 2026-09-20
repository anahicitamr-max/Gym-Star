import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Gym Star" });
});

// Assistant Gym Star API
app.post("/api/assistant", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje requerido" });
    }

    const ai = getGenAI();

    if (ai) {
      const systemInstruction = `Eres "Mi Asistente Gym Star ⭐", un entrenador digital motivacional, empático y práctico para la plataforma escolar y de emprendimiento "Gym Star" (lema: "Entrena. Avanza. Mantente constante.").
Tu objetivo es resolver la falta de constancia, desmotivación y desorientación de los usuarios que van al gimnasio.

INFORMACIÓN DEL USUARIO ACTUAL:
- Nombre: ${context?.userProfile?.name || "Atleta Gym Star"}
- Edad: ${context?.userProfile?.age || "No especificada"}
- Objetivo de entrenamiento: ${context?.userProfile?.goal || "Mejorar condición física"}
- Días entrenados esta semana: ${context?.stats?.daysTrainedThisWeek ?? 3} días
- Entrenamientos totales completados: ${context?.stats?.totalWorkouts ?? 12}
- Racha de constancia: ${context?.stats?.streakDays ?? 4} días seguidos
- Estrellas acumuladas: ${context?.stats?.stars ?? 140} ⭐
- Rutina actual: ${context?.currentRoutine?.title || "Rutina Adaptada Gym Star"} (${context?.currentRoutine?.exercises?.length || 5} ejercicios)

REGLAS FUNDAMENTALES:
1. Responde en español de forma motivadora, clara, juvenil y directa (máximo 2 a 3 párrafos concisos o con viñetas limpias).
2. Si el usuario pregunta qué ejercicio hacer hoy o qué ejercicios tiene su rutina, haz referencia a su rutina actual y objetivo (${context?.userProfile?.goal || "su objetivo actual"}).
3. Si pregunta cuántos entrenamientos lleva o su racha, dale el dato exacto de su perfil con entusiasmo.
4. Si pide recordarle su objetivo, anímalo con su meta (${context?.userProfile?.goal || "su meta"}) y un consejo de constancia.
5. Da consejos sobre postura, respiración o hidratación cuando sea útil.
6. AVISO OBLIGATORIO: Recuerda que eres un asistente de apoyo para el hábito y técnica general, no sustituyes el diagnóstico médico ni las indicaciones de un entrenador profesional certificado o profesional de salud.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "¡Excelente pregunta! Recuerda mantener una buena postura y respiración en cada repetición. ¡Sigue dando lo mejor en Gym Star!";
      return res.json({ reply: replyText, source: "gemini" });
    }

    // High quality intelligent fallback if API key is not yet set by the user
    const lower = message.toLowerCase();
    const userName = context?.userProfile?.name || "campeón/a";
    const goal = context?.userProfile?.goal || "Mejorar condición física";
    const totalWorkouts = context?.stats?.totalWorkouts ?? 12;
    const streak = context?.stats?.streakDays ?? 4;

    let fallbackReply = "";

    if (lower.includes("hoy") || lower.includes("hacer") || lower.includes("que ejercicio")) {
      fallbackReply = `¡Hola ${userName}! Hoy te sugiero enfocarte en tu objetivo de **${goal}**. En tu sección "Mi Rutina" tienes los ejercicios preparados con series y tiempos de descanso controlados. Comienza con 5 minutos de calentamiento articular y dale con intensidad controlada a cada serie. ¡Cada repetición cuenta!`;
    } else if (lower.includes("rutina") || lower.includes("ejercicios")) {
      fallbackReply = `Tu rutina activa está diseñada para **${goal}**. Incluye ejercicios multiarticulares con instrucciones paso a paso, series guiadas (3 a 4 series) y descanso programado. Puedes ir marcando cada ejercicio completado con el checkbox para registrar tu sesión y ganar estrellas ⭐.`;
    } else if (lower.includes("cuántos") || lower.includes("cuantos") || lower.includes("completado") || lower.includes("llevo") || lower.includes("entrenamientos")) {
      fallbackReply = `¡Vas con todo ${userName}! Llevas **${totalWorkouts} entrenamientos completados** y una racha activa de **${streak} días seguidos** 🔥. ¡Estás muy cerca de desbloquear el siguiente reto semanal en Gym Star!`;
    } else if (lower.includes("objetivo") || lower.includes("meta") || lower.includes("recuérdame") || lower.includes("recuerdame")) {
      fallbackReply = `Tu objetivo actual es: **${goal}** 🎯. Recuerda por qué empezaste: la constancia supera a la motivación momentánea. Mantén tu hidratación y procura cumplir tus días programados esta semana.`;
    } else if (lower.includes("motiva") || lower.includes("ánimo") || lower.includes("animo") || lower.includes("cansado") || lower.includes("flojera")) {
      fallbackReply = `El entrenamiento más difícil siempre es el que dudas en empezar. No tienes que ser extremo, solo tienes que ser **constante**. ¡Ponte los tenis, haz la primera serie y verás cómo la energía vuelve! ⭐`;
    } else {
      fallbackReply = `¡Hola ${userName}! Como tu Asistente Gym Star, te recomiendo avanzar paso a paso con tu meta de **${goal}**. Revisa tus ejercicios en "Mi Rutina", marca tu progreso y reclama tus estrellas en "Retos". *Nota: Soy un asistente educativo de acompañamiento y no sustituyo a un médico o entrenador certificado.* ¿En qué más puedo orientarte hoy?`;
    }

    return res.json({ reply: fallbackReply, source: "offline-assistant" });
  } catch (error) {
    console.error("Error in assistant endpoint:", error);
    res.status(500).json({
      reply: "Hubo un pequeño contratiempo al procesar tu consulta, pero recuerda: ¡mantén la constancia y sigue tu rutina de Gym Star!",
      error: "Service temporarily unavailable"
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gym Star server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
