import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const userJSON = localStorage.getItem('user');
const initialState = {
  user: userJSON ? JSON.parse(userJSON) : null,
  token: localStorage.getItem('token') || null,
  loading: false, error: null,
};

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/auth/login', data); return res.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/auth/register', data); return res.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Register failed'); }
});

const slice = createSlice({
  name: 'auth', initialState,
  reducers: {
    logout: (s) => {
      s.user = null; s.token = null;
      localStorage.removeItem('token'); localStorage.removeItem('user');
    },
  },
  extraReducers: (b) => {
    const success = (s, a) => {
      s.loading = false;
      s.user = { _id: a.payload._id, name: a.payload.name, email: a.payload.email, role: a.payload.role };
      s.token = a.payload.token;
      localStorage.setItem('token', a.payload.token);
      localStorage.setItem('user', JSON.stringify(s.user));
    };
    b.addCase(login.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(login.fulfilled, success);
    b.addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    b.addCase(register.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(register.fulfilled, success);
    b.addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
