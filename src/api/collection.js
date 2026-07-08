import api from '@/lib/axios';

export async function addToCollection({ artworkId, artwork }) {
  const { data } = await api.post('/collection', { artworkId, artwork });
  return data;
}

export async function fetchMyCollection() {
  const { data } = await api.get('/collection/my');
  return data.items || [];
}

export async function removeFromCollection(artworkId) {
  const { data } = await api.delete(`/collection/${artworkId}`);
  return data;
}
