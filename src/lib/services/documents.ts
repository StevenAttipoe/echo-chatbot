import { listAll, ref, uploadBytes } from "firebase/storage";

import { Pinecone } from "@pinecone-database/pinecone";
import { storage } from "$lib/services/firebase";
import { embedAndStoreDocs } from "$lib/utils/vector-stores";
import { getChunkedDocsFromPDF } from "$lib/utils/pdf";
import { PUBLIC_PINECONE_INDEX, PUBLIC_PINECONE_API_KEY } from '$env/static/public';


const PATH = 'docs/pdf';

export async function uploadFile(file: File): Promise<boolean> {
    try {
        const storageRef = ref(storage, `${PATH}/${file.name}`);
        await uploadBytes(storageRef, file);
        return true;
    } catch (error) {
        return false;
    }
}


export async function getUploadedFiles(): Promise<Document[]> {
    const listRef = ref(storage, PATH);

    const list = await listAll(listRef);

    const files = list.items.map(async (itemRef) => {
        return {
            name: itemRef.name,
        } as Document;
    });

    return Promise.all(files);
}

export async function embedAndIndexDocumentsToPincone(pdf: File): Promise<boolean> {
    try {
        const pinecone = new Pinecone({
            apiKey: PUBLIC_PINECONE_API_KEY
        });

        const indexName: string = PUBLIC_PINECONE_INDEX;
        
        const indexes = await pinecone.listIndexes();
        const existingIndexes = indexes.indexes?.map((index) => index.name);

        if (!existingIndexes?.includes(indexName)) {
            await pinecone.createIndex({ 
                name: indexName,
                dimension: 1536,
                metric: "cosine",
                spec: null
            });
        } else {
            console.log("Your index already exists. nice !!");
        }
        
        const docs = await getChunkedDocsFromPDF(pdf);
        console.log(`Loading ${docs.length} chunks into pinecone...`);

        await embedAndStoreDocs(pinecone, docs);
        return true;

    } catch (error) {
        console.log("error ", error);
        return false;
    }
}