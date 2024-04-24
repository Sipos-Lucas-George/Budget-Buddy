import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@/models/user';
import {connectToDB} from '@/utils/database';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    callbacks: {
        async session({session}) {
            const sessionUser = await User.findOne({email: session.user!.email});
            if (!sessionUser) {
                return null;
            }
            const _session: any = session;
            _session.user.id = sessionUser._id.toString();
            return _session;
        },
        async signIn({profile, account}) {
            try {
                await connectToDB();
                const pro: any = profile;
                const userExists = await User.findOne({email: profile!.email});

                if (!userExists) {
                    await User.create({
                        email: profile!.email,
                        name: profile!.name,
                        image: pro!["picture"] ?? "",
                    });
                } else if (userExists.image !== profile!.image) {
                    await User.updateOne({email: profile!.email}, {image: pro!.picture});
                }

                return true
            } catch (error) {
                console.log("Error checking if user exists: ", error!.toString());
                return false
            }
        },
        async redirect({url, baseUrl}) {
            return url;
        }
    },
    pages: {
        error: "/",
        signIn: "/",
        signOut: "/",
    },
})

export {handler as GET, handler as POST}