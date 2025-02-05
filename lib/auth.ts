import {  DefaultSession, NextAuthOptions } from "next-auth";
import prisma from "@/server/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";


declare module "next-auth" {
    interface User {
      id: string;
      email: string;
      name?: string | null;
    }
    interface Session {
      user: DefaultSession["user"] & {
        id: string;
      email: string;
      name?: string | null;
      };
    }
  }
  declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        name?: string | null;
    }
  }

export const authOptions = {

 adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "praash@gmail.com",
        },
        name: {
            label: "Name",
            type: "text",
            placeholder: "praash",
          },
      },
      async authorize(credentials) {
        const isUserExists = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
          }
        });
                
        if(isUserExists){
          return {
            id: isUserExists?.id,
            email: isUserExists?.email,
            name: isUserExists?.name,
          };
        }

        const user = await prisma.user.create({
          data: {
            email: credentials?.email as string,
          },
        });
     
        if (user) {
          return {
            ...user,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, credentials }) {
      
      if (!user) {
        return false;
      }

      const isUserExists = await prisma.user.findUnique({
        where: {
          email: credentials?.email as string,
        },
      });
      if (isUserExists) {
        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.phoneNumber = user.email;
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      
      if (token) {
         session.user.email = token.email;
         session.user.id = token.id;
         session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",

} satisfies NextAuthOptions