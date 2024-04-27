import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {PrismaClient} from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import {db} from "@/lib/db";
import {userSettings} from "@/utils/user_settings";

const prisma = new PrismaClient()

export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })
    ],
    events: {
        async createUser({user}) {
            if (!user || !user.id) {
                throw new Error("User or User ID not defined");
            }
            await db.userSettings.create({
                data: {
                    userId: user.id,
                    ...userSettings
                }
            })
        },
        async linkAccount({user}) {
            await db.user.update({
                where: {id: user.id},
                data: {emailVerified: new Date()}
            })
        }
    },
    callbacks: {
        async session({session, token}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({token}) {
            return token;
        },
        async redirect({url}) {
            return url;
        }
    },
    pages: {
        error: "/",
        signIn: "/",
        signOut: "/",
    },
})