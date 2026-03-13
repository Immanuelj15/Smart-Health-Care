import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face client
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2";

// Helper function to call the model
const callHF = async (prompt) => {
  try {
    const response = await hf.textGeneration({
      model: MODEL_NAME,
      inputs: `<s>[INST] ${prompt} [/INST]`,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
      },
    });
    return response.generated_text.split('[/INST]').pop().trim();
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
};

// For the Patient's Symptom Checker
export const checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms) {
    return res.status(400).json({ message: 'Symptoms are required.' });
  }

  const prompt = `
    Act as a helpful medical information assistant. A user is providing the following symptoms: "${symptoms}".
    Based on these symptoms, please provide:
    1. A list of 3 to 5 possible conditions.
    2. A brief, one-sentence description for each.
    3. The type of specialist to consult.
    4. MUST include this exact disclaimer at the end: "Disclaimer: This is AI-generated information and not a substitute for professional medical advice. Consult a qualified doctor."
  `;

  try {
    const aiResponse = await callHF(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get a response from the AI assistant.' });
  }
};

// For the Doctor's AI Assistant
export const assistDoctor = async (req, res) => {
  const { notes } = req.body;
  if (!notes) {
    return res.status(400).json({ message: 'Patient notes are required.' });
  }

  const prompt = `
    Act as an expert clinical decision support system for a doctor. Based on the notes: "${notes}", provide:
    1. **Differential Diagnosis:** 3-5 possible conditions.
    2. **Recommended Tests:** Suggest relevant diagnostic tests.
    3. **Treatment Suggestions:** Outline potential treatment options.
    4. **Disclaimer:** Include this exact text: "For clinical decision support only, not a substitute for professional medical judgment."
  `;

  try {
    const aiResponse = await callHF(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get a response from the AI assistant.' });
  }
}

// General AI Chatbot ("Dr. Smart")
export const chatWithAI = async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const conversationHistory = context ? context.map(msg => `${msg.sender}: ${msg.text}`).join('\n') : '';

  const prompt = `
    System: You are Dr. Smart, a friendly and knowledgeable AI medical assistant for the SmartHealth Portal. 
    Your goal is to assist patients with general health questions, navigation of the portal (booking appointments, finding doctors), and symptom checking.
    
    Rules:
    1. Be polite, empathetic, and professional.
    2. If a user asks about medical advice, strictly warn them you are an AI and they should see a doctor.
    3. Keep answers concise (under 100 words).
    4. If asked about features, you can mention: Symptom Checker, Video Consultations, and Medicine Store.
    
    Current Conversation History:
    ${conversationHistory}
    
    User: ${message}
    Dr. Smart:
  `;

  try {
    const aiResponse = await callHF(prompt);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: 'Dr. Smart is temporarily unavailable.' });
  }
};