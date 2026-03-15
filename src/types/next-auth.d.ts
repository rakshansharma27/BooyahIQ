import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    isPremium: boolean
    playerName: string
    uid: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      isPremium: boolean
      playerName: string
      uid: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isPremium: boolean
    playerName: string
    uid: string
  }
}
