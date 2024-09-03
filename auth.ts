import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials'; //username + password only.
import { z } from 'zod';

// https://authjs.dev/getting-started/providers/credentials

import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// create a new getUser function that queries the user from the database.
async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                //
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    // call bcrypt to check if passwords match
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user; //return user otherwise 'null' will be returned and fail login.
                }

                console.log('Invalid credentials.');
                return null;
            },
        }),
    ],
});