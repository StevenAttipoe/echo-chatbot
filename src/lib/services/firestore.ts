import { generateRandomString } from "$lib/components/helpers/str";
import { db } from "$lib/services/firebase";
import { collection, addDoc, getDocs, writeBatch } from "firebase/firestore";

const CHATS_PATH = "chats";
const CHATS_DETAILS_PATH = "chats_details";

async function createChat(): Promise<Chat>
{
    try {
        const chatCollectionRef = collection(db, CHATS_DETAILS_PATH);

        const chatId = generateRandomString(10);
        const chatUTCTime = new Date().toUTCString();

        const chat: Chat = {
            id: chatId,
            name: `Chat ${chatUTCTime}`
        }
        await addDoc(chatCollectionRef, chat);

        return chat;
        
    } catch (error) {
        console.error("Error creating chat", error);
        throw new Error("Error creating chat");
    }
}

async function getChats(): Promise<Chat[]>
{
    const collectionRef = collection(db, CHATS_DETAILS_PATH);
    
    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data() as Chat);

    return data;

}

async function saveMessage(message: Message, chatId: string): Promise<boolean>
{
    try {
        const collectionRef = collection(db, `${CHATS_PATH}/${chatId}/messages`);
        
        await addDoc(collectionRef, message);
        return true;
    } catch (error) {
        return false;
    }
}

async function getMessages(chatId: string): Promise<Message[]>
{
    const collectionRef = collection(db, `${CHATS_PATH}/${chatId}/messages`);
    
    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data() as Message);

    data.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    return data;
}

async function deleteMessages(chatId: string): Promise<boolean>
{
    const batch = writeBatch(db);

    const collectionRef = collection(db, `${CHATS_PATH}/${chatId}/messages`);
    
    const snapshot = await getDocs(collectionRef);

    snapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    return true;
}
export { saveMessage, getMessages, createChat, getChats, deleteMessages };