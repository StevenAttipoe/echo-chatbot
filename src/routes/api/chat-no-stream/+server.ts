import type { RequestHandler } from './$types';
import { chain } from '$lib/utils/chain';


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
  
    const question: string = body.query.trim().replaceAll("\n", " ");
    const history: Message[] = body.history ?? []

    console.log("question", question);
    console.log("history", history);

    const response = await chain.invoke({
        question: question,
        chat_history: history.slice(0, -1).map(h => h.content).join("\n"),
    });

    // const documents: string[] = Array.from(
    //     new Set(response.sourceDocuments.map((
    //         document: { metadata: {source: string} }) => document.metadata.source
    //     ))
    // );
    
    return new Response(
        JSON.stringify({
            role: 'assistant',
            content: response.text,
            // documents: documents,
        }),
        {
            headers: { 'content-type': 'application/json' }
        }
    );
  }