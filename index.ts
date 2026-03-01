const server = Bun.serve({
    port: process.env.PORT ?? 3001,
    async fetch(req){
        return new Response("API de Bun está funcionando correctamente");
    }
})

console.log(`Server is running on ${server.url}:${server.port}`)