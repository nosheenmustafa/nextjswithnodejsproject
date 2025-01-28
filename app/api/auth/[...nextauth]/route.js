import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      // authorization: {
      //   params: {
      //     scope: "email, public_profile",
      //   },
      // },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user info to the token
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.profileImage = user.profileImage || '';  // optional
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to the session object
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.profileImage = token.profileImage;
      return session;
    },
  }
  ,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
