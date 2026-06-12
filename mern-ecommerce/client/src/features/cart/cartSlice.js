import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await api.get('/cart'); return res.data;
});
export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }) => {
  const res = await api.post('/cart', { productId, quantity }); return res.data;
});
export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }) => {
  const res = await api.put(`/cart/${productId}`, { quantity }); return res.data;
});
export const removeFromCart = createAsyncThunk('cart/remove', async (productId) => {
  const res = await api.delete(`/cart/${productId}`); return res.data;
});
export const clearCart = createAsyncThunk('cart/clear', async () => {
  await api.delete('/cart'); return { items: [] };
});

const slice = createSlice({
  name: 'cart', initialState: { items: [], loading: false },
  reducers: { resetCart: (s) => { s.items = []; } },
  extraReducers: (b) => {
    [fetchCart, addToCart, updateCartItem, removeFromCart, clearCart].forEach((thunk) => {
      b.addCase(thunk.fulfilled, (s, a) => { s.items = a.payload.items || []; s.loading = false; });
    });
    b.addCase(fetchCart.pending, (s) => { s.loading = true; });
  },
});

export const { resetCart } = slice.actions;
export default slice.reducer;
