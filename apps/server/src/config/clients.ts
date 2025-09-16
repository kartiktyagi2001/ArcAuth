export interface ClientConfig{
    redirectUris: string[]
}

export const Clients: Record<string, ClientConfig>={
    DataForge:{
        redirectUris:["https://dfteam.vercel.app/groups"]
    },
    Podium:{
        redirectUris:["https://podium-sand.vercel.app/blogs"]
    }
}