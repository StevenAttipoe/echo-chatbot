// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	export interface Document {
		name: string;
		link?: string;
	}

	export interface Message {
		sequenceNumber: number
		role: "user" | "assistant"
		content: string
		documents?: string[]
	}

	export interface Chat {
		id: string,
		name: string,
	}
}

export {};
