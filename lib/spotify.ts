const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

const basicEncoded = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
  'base64'
);

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const tokenEndpoint = 'https://accounts.spotify.com/api/token';

const getRefreshToken = async() => {
    const supabase = createClientComponentClient()
    const session = await supabase.auth.getSession()
    const user_id = session?.data.session?.user.id
    
    const { data, error } = await supabase
    .from('decrypted_users')
    .select('decrypted_provider_refresh_token')
    .eq('id', user_id)
  
    if (error) {
      console.error(error)
    } else {
      return data[0].decrypted_provider_refresh_token
    }
}

const getAccessToken = async() => {
    const refresh_token = await getRefreshToken()

    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    })

    const body = params.toString();

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
        Authorization: `Basic ${basicEncoded}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });

    const data = await response.json()

    return data;
}

export const getTopArtists = async() => {
    const { access_token: accessToken } = await getAccessToken();

    if (!accessToken) {
        return;
    }
    const res = await fetch("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json()
    return data.items
}

export const getTopSongs = async() => {
    const { access_token: accessToken } = await getAccessToken();

    console.log(accessToken)
    
    if (!accessToken) {
      return;
    }
    const res = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json()

    console.log(res)

    return data.items
}