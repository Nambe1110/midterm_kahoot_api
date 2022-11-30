import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from 'google-auth-library';

export const getDecodedOAuthJwtGoogle = async (token) => {
    // const CLIENT_ID_GOOGLE = 'yourGoogleClientId'
    try {
        const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE)

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID_GOOGLE,
        })
        return ticket;
    } catch (error) {
        return { status: 500, data: error }
    }
}