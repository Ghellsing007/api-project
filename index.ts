import { groqService } from "./services/groq";
import { cerebrasService } from "./services/cerebras";
import { openRouterService } from "./services/openrouter";
import { googleService } from "./services/google";
import { sambanovaService } from "./services/sambanova";
import type { AIServices, ChatMessages } from "./types";


const services: AIServices[] = [
    groqService,
    cerebrasService,
    //openRouterService,
    googleService,
    sambanovaService,
]
let currentServiceIndex = 0;

function getNextServices() {
    const service = services[currentServiceIndex];
    currentServiceIndex = (currentServiceIndex + 1) % services.length;
    return service;
}

const server = Bun.serve({
    port: process.env.PORT ?? 3001,
    async fetch(req) {
        const { pathname } = new URL(req.url)

        if (req.method === "POST" && pathname === "/chat") {
            try {
                const body = await req.json() as import("./types").ChatRequest;
                const messages = body.messages;
                // if client specified a service name, attempt to use it
                let service: AIServices | undefined;
                if (body.service) {
                    service = services.find(s => s.name.toLowerCase() === body.service!.toLowerCase());
                    if (!service) {
                        return new Response(JSON.stringify({ error: `Unknown service '${body.service}'` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
                    }
                    console.log(`Using requested service ${service.name}`);
                } else {
                    service = getNextServices();
                    console.log(`Using ${service?.name} services`);
                }
                const stream = await service?.chat(messages);

                return new Response(stream, {
                    headers: {
                        'content-Type': 'text/event-stream',
                        'Cache-control': 'no-cache',
                        'Connection': 'keep-alive',
                    },
                });
            } catch (err) {
                console.error('Error handling /chat:', err);
                const message = (err && (err as any).message) ? (err as any).message : String(err);
                const status = (err && (err as any).status) ? (err as any).status : 500;
                return new Response(JSON.stringify({ error: message }), {
                    status,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response("Not found", {status: 404});
    }
})

console.log(`Server is running on ${server.url}`)