



export interface ChatMessages{
    role: 'user'|'assistant'|'system';
    content: string;
}

export interface ChatRequest {
    messages: ChatMessages[];
    service?: string; // optional: name of AI service to use
}

export interface AIServices{
    name: string;
    chat: (messages:ChatMessages[])=> Promise<AsyncIterable<string>>;
}