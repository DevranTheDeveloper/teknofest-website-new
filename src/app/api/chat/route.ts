import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import db from '@/lib/db'

if (!process.env.GROQ_API_KEY) {
    console.error("❌ ERROR: GROQ_API_KEY is missing from environment variables.");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'dummy_key_to_prevent_init_crash'
});

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { message, history } = body

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // 1. Fetch Context from Database
        const [allMembers, events, projects, news] = await Promise.all([
            db.member.findMany({
                include: { role: true },
                orderBy: { role: { weight: 'asc' } } // Ascending weight (President usually 0 or 1)
            }),
            db.event.findMany({
                where: { date: { gte: new Date() } },
                orderBy: { date: 'asc' },
                take: 5
            }),
            db.project.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5
            }),
            db.news.findMany({
                orderBy: { date: 'desc' },
                take: 3
            })
        ])

        // Context Preparation: Use ALL members so the AI can answer specific questions (e.g., "Who manages the projects?").
        // However, the System Prompt will restrict it from simply listing everyone unprompted.
        const contextMembers = allMembers;

        // 2. Format Context
        const contextString = `
        Current Date: ${new Date().toLocaleDateString('tr-TR')}

        Team Members:
        ${contextMembers.map(m => `- ${m.name} (${m.role.name}): ${m.bio || 'No bio'}. Socials: ${m.twitter || ''}, ${m.instagram || ''}, ${m.linkedin || ''}`).join('\n')}

        Upcoming Events:
        ${events.map(e => `- ${e.title} (${new Date(e.date).toLocaleDateString('tr-TR')}): ${e.description}. Link: ${e.link || 'Yok'}`).join('\n')}

        Latest Projects:
        ${projects.map(p => `- ${p.title} (ID: ${p.id}): ${p.description}`).join('\n')}

        Recent News:
        ${news.map(n => `- ${n.title} (ID: ${n.id}) (${new Date(n.date).toLocaleDateString('tr-TR')}): ${n.description}`).join('\n')}
        `

        // 3. Construct System Prompt
        const systemPrompt = `You are "TeknoAsistan", the helpful AI assistant for the Haliç University TeknoFest Club.
        Your goal is to assist visitors by answering their questions using ONLY the information provided in the context below.
        
        RULES:
        - You must speak in a polite, formal, and helpful tone (Turkish language).
        - **Specific Questions**: If the user asks a specific question like "Who manages the projects?" or "Who is the president?", use the Team Members list to find the person with the matching Role or Bio and answer directly.
        - **General Lists**: If the user asks for a GENERAL list of members (e.g., "Who are the members?", "List the team", "Show me the board"), do NOT list everyone. Instead, provide a very brief summary (e.g., mention the President) and say "Web sitemizden tüm üyelerimizi inceleyebilirsiniz" AND append the tag \`[ACTION:MEMBERS]\` to the end of your message.
        - **Projects & News**: If you mention a specific Project or News article, provide a brief summary and then APPEND a button tag to let the user read more. Format: \`[BUTTON:/projects/ID|Devamını Oku]\` or \`[BUTTON:/news/ID|Devamını Oku]\`. (Use the ID provided in context).
        - **Events**: If you mention an upcoming Event and it has a valid external link (not 'Yok'), APPEND a registration button using that EXACT external link. Format: \`[BUTTON:LINK|Başvuru Yap]\`. NEVER link to /events/ID. If the link is 'Yok', do not add a button.
        - **Button Format**: Always use \`[BUTTON:URL|LABEL]\` for links. Do not use markdown links like [Link](url).
        - If the answer is not in the context, say "Üzgünüm, bu konuda bilgim yok. Lütfen kulüp yönetimi ile iletişime geçin."
        - NEVER invent information.
        - Keep answers concise.
        
        CONTEXT:
        ${contextString}
        `

        // 4. Call Groq API
        // We append the new message to the history if provided, or just send the single interaction.
        // For simplicity in this iteration, we'll send the system prompt + user message.
        // If you want history, you'd map the 'history' array here.

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...history || [], // Include previous messages if any
                { role: 'user', content: message }
            ],
            model: 'llama-3.1-8b-instant', // Updated to latest supported Llama 3.1 model
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
            stream: false, // For now, simple JSON response
            stop: null
        });

        const reply = chatCompletion.choices[0]?.message?.content || "Bir hata oluştu.";

        return NextResponse.json({ reply })

    } catch (error) {
        console.error('Chat API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
