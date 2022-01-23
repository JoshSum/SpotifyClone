import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import spotifyApi, { helper } from "../lib/spotify";

// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//     clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//   })
//   console.log(spotifyApi)
//   spotifyApi
//     .clientCredentialsGrant()
//     .then(data => {
//         const access_token = data.body['access_token'];
//         const refresh_token = data.body['refresh_token'];
//         const expires_in = data.body['expires_in'];
//         console.log(access_token)
//         console.log(refresh_token)
//         console.log(expires_in)
//         console.log(data)
//     }).catch(error => {
//         console.error('Error getting Tokens:', error);
//         // res.send(`Error getting Tokens: ${error}`);
//       });
function useSpotify() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if(session) {
            // If refresh access token attempt fails, direct users to login...
            if(session.error === "RefreshAccessTokenError") {
                signIn();
            }
            
            spotifyApi.setAccessToken(session.user.accessToken);
        }
    },[session]);
    return spotifyApi;
}

export default useSpotify
