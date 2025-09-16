'use client'

import { Button } from "@/components/ui/button"
import {TextHoverEffect} from "@/components/ui/text-hover-effect"
import { toast } from "sonner"

export default function LoginPage() {
  const redirect = (provider: 'google' | 'github') => {
    window.location.href = `http://arcauth.up.railway.app/auth/${provider}`
    toast(`Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)} for authentication...`)
  }

  return (
    <div className="flex flex-col items-center justify-evenly min-h-screen bg-white">

        <div>
            <TextHoverEffect text="ArcAuth" duration={0.5} />
            <p className="text-center text-gray-600 mt-2 mb-8">Welcome to ArcAuth - Your Gateway to Seamless Authentication</p>
        </div>

        <div className="space-y-4">
            <Button
                onClick={() => redirect('github')}
                className="flex items-center justify-center w-64 px-4 py-2 mx-auto border border-transparent rounded-full bg-purple-400 shadow hover:shadow-md transition text-black hover:bg-white"
            >
                <img src="/github.svg" alt="GitHub" className="w-6 h-6 mr-2" />
                Sign in with GitHub
            </Button>
            <Button
                onClick={() => redirect('google')}
                className="flex items-center justify-center w-64 px-4 py-2 mx-auto border border-transparent rounded-full bg-blue-400 shadow hover:shadow-md transition text-black hover:bg-white"
            >
                <img src="/google.svg" alt="Google" className="w-6 h-6 mr-2" />
                Sign in with Google
            </Button>
        </div>
        
    </div>
)
}
