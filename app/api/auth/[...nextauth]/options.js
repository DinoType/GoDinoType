import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '@/lib/mongodb'

export const authOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],

	callbacks: {
		async signIn({ user, account }) {
			const client = await clientPromise
			const db = client.db('dinotype')
			const usersCollection = db.collection('users')

			const existingUser = await usersCollection.findOne({ email: user.email })

			if (!existingUser) {
				await usersCollection.insertOne({
					username: user.email.split('@')[0],
					name: user.name,
					email: user.email,
					image: user.image || null,
				})
			}

			return true
		},
	},

	session: {
		strategy: 'jwt',
	},

	secret: process.env.NEXTAUTH_SECRET,
}
