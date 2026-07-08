import api from './axios';

export async function fetchTopArtists() {
  const { data } = await api.get('/artists/top');
  return data.artists || data;
}

export async function fetchArtistById(id) {
  const { data } = await api.get(`/artists/${id}`);
  return data.artist || data;
}
