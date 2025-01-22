export const searchArtists = async (query) => {
    const response = await fetch(`${API_URL}/api/artists/search?query=${query}`);
    return await response.json();
  };