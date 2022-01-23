import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    // 'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ].join(',');

  const params={
      scope: scopes,
  }

  const queryParamString = new URLSearchParams(params);

  const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  })

// Retrieve an access token.
// spotifyApi.clientCredentialsGrant().then(
//   function(data) {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);

//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//   },
//   function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
//   }
// );

   // Can wrap the following methods in a class for ease of use
   const initialize = async () => {
    const token = await getToken()
    spotifyApi.setAccessToken(token)
  }
  
  const refreshToken = async () => {
    const token = await getRefreshToken()
    spotifyApi.setAccessToken(token)
  }

  
  const getToken = async () => {
    const result = await spotifyApi.clientCredentialsGrant()
    return result.body.access_token
  }
  

  const getRefreshToken = async () => {
    const result = await spotifyApi.refreshAccessToken()
    return result.body.access_token
  }

  const useApi = async () => {
    // initialize or refreshToken as desired
   await spotifyApi.initialize()
    // use api 
    await spotifyApi.search()
  }

  const helper = {};
  helper.initialize = initialize;
  helper.refreshToken = refreshToken;
  helper.getToken = getToken;
  helper.getRefreshToken = getRefreshToken;
  helper.useApi = useApi;
  
  export default spotifyApi;
  export { helper };
  export { LOGIN_URL };

