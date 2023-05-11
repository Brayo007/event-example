import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from "next-auth/providers/email";
import User from '../../../models/User';
import db from '../../../utils/db';

export default NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    verifyRequest: '/verify',
    signout: '/'
  },
  
  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      //let hapa = JSON.stringify(token);
      //let kule = JSON.stringify(user);
      //console.log(hapa + ' ndio token')
      //console.log(kule + ' user b4 token');
      if (user?._id) token.sub = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      //let sasa = JSON.stringify(session);
      //console.log(sasa + ' alafu session?')
      if (token?.sub) session.user._id = token.sub;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),

    
  ],
  
});