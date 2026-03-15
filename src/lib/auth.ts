import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.playerName || user.name || '',
          image: user.avatarUrl || user.image || '',
          isPremium: user.isPremium,
          playerName: user.playerName || '',
          uid: user.uid || '',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const u = user as { isPremium?: boolean; playerName?: string; uid?: string }
        token.isPremium = u.isPremium ?? false
        token.playerName = u.playerName ?? ''
        token.uid = u.uid ?? ''
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.isPremium = token.isPremium as boolean
        session.user.playerName = token.playerName as string
        session.user.uid = token.uid as string
      }
      return session
    },
  },
}
