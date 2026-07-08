import api from '@/lib/axios';

export async function createOrder(orderData) {
  const { data } = await api.post('/orders', orderData);
  return data;
}

export async function fetchMyOrders() {
  const { data } = await api.get('/orders/my');
  return data.orders || [];
}

export async function deleteOrder(orderId) {
  const { data } = await api.delete(`/orders/${orderId}`);
  return data;
}
