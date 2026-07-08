import api from './axios';
import expressApi from '@/lib/axios';

export async function fetchComments(artworkId) {
  const { data } = await api.get(`/artworks/${artworkId}/comments`);
  return data.comments || data;
}

export async function addComment({ artworkId, text }) {
  const { data } = await api.post(`/artworks/${artworkId}/comments`, { text });
  return data.comment || data;
}

export async function fetchMyComments() {
  const { data } = await expressApi.get('/comments/my');
  return data.comments || [];
}
