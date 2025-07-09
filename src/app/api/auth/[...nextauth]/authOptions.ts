import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../mongodb";
import User from "@/models/userModel";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;
        const user = await User.findOne({ email: credentials.email });
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user._id.toString(), // Always return id from _id
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        (token as any).role = (user as any).role;
        // Use user.id if present, otherwise user._id (from MongoDB)
        (token as any).id =
          user.id || (user._id ? user._id.toString() : undefined);
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/client/login", // Custom login page
    // signOut, error, etc. can be added here
  },
};
