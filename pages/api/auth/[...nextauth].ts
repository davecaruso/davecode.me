import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    // Providers.Discord({
    //   clientId: process.env.DISCORD_CLIENT_ID,
    //   clientSecret: process.env.DISCORD_CLIENT_SECRET
    // }),
    Providers.Credentials({
      name: 'the magic word',
      credentials: {
        password: { label: "Magic Word", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials.password === 'pasta') {
          return { id: 1, name: 'dave', email: 'dave@davecode.me' };
        } else {
          return null
        }
      }
    })
  ],
});
