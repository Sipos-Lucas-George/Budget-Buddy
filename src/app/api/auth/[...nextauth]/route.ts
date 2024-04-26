import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@/models/user';
import User_Settings from '@/models/user_settings';
import {connectToDB} from '@/utils/database';
import {userSettings} from '@/utils/user_settings';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    callbacks: {
        async session({session}) {
            try {
                const sessionUser = await User.findOne({email: session.user!.email});
                if (!sessionUser) {
                    return null;
                }
                const _session: any = session;
                _session.user.id = sessionUser._id.toString();
                return _session;
            } catch (error) {
                console.error('Error fetching user from database:', error);
                return null;
            }
        },
        async signIn({profile}) {
            try {
                await connectToDB();
                const pro: any = profile;
                const userExists = await User.findOne({email: profile!.email});

                if (!userExists) {
                    const user = await User.create({
                        email: profile!.email,
                        name: profile!.name,
                        image: pro!["picture"] ?? "",
                    });
                    await User_Settings.create({
                        user_id: user._id,
                        ...userSettings
                    })
                    return true;
                } else if (userExists.image !== profile!.image) {
                    await User.updateOne({email: profile!.email}, {image: pro!.picture});
                }
                const settings = await User_Settings.findOne({user_id: userExists._id});
                const {_id, __v, ...cleanedUserSettings} = settings._doc;
                userSettings.setAll(cleanedUserSettings);
                return true
            } catch (error) {
                console.log("Error checking if user exists: ", error!.toString());
                return false
            }
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

export {handler as GET, handler as POST}