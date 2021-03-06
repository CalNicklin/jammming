let userAccessToken;
const clientId = 'b533500775164346aeadd6758b2fbb2c';
const redirectUri = 'http://cals-jammm.surge.sh';

const Spotify = {
    getAccessToken() {
        if (userAccessToken) {
            return userAccessToken;
        }

        // check for access token match 
        const userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (userAccessTokenMatch && expiresInMatch) {
            userAccessToken = userAccessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // This clears the parameters, allowing us to get new UAT when expired
            window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl; 
        };
    },

    search(term) {
        const userAccessToken = Spotify.getAccessToken();  
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        {
            headers: {Authorization: `Bearer ${userAccessToken}`}
        }).then (response => {
            return response.json(); 
        }).then (jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                audio: track.preview_url,
                uri: track.uri
            }));
        })
    },

    savePlaylist(name, trackUris) {
        if (!name && !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then (response => response.json()
        ).then (jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify( {name: name} )
            }).then (response => response.json()
            ).then (jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify( {uris: trackUris} )
                })
            })
        })
    }
}

export default Spotify;