import { OpenAIEmbeddings} from "@langchain/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX } from '$env/static/private';
import { ChatOpenAI } from "@langchain/openai";

const TEMPLATE =  `
You are a company assistant named Echo. 
You are to answer company related questions based of a knowledge base. 
You are strictly formal and polite.
START CONTEXT BLOCK
{context}
END OF CONTEXT BLOCK
AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
AI assistant will not invent anything that is not drawn directly from the context.
`

async function initChain() {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        streaming: true,
        verbose: true,
        temperature: 0,
      });

    const pinecone = new Pinecone({
        apiKey: PINECONE_API_KEY,
    });

    const pineconeIndex = pinecone.Index(PINECONE_INDEX);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
            pineconeIndex: pineconeIndex,
            textKey: 'text',
        },
    );

    return ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(),
        // {         
        //     qaTemplate: TEMPLATE,
        //     returnSourceDocuments: true 
        // }
    );
}

export const chain = await initChain();