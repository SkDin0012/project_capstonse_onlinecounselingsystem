import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = "http://localhost:5111/api/";
const API_URL = "https://project-capstonse-onlinecounselingsystem-pp1y.onrender.com/api/";

const initialState = {
    sessionNotes: [],
    loading: false,
    error: null,
    successMessage: '',
};

export const createSessionNote = createAsyncThunk(`${API_URL}sessionNotes/createSession`, async ({ formData, config }, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/createSession`, formData, config);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        return thunkAPI.rejectWithValue(error.response?.data || 'Failed to create session note');
    }
});

export const fetchSessionNotes = createAsyncThunk(`${API_URL}sessionNotes/getSessionNotes`, async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/getSessionNotes`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching session notes:', error);
        return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch session notes');
    }
});

const sessionNoteSlice = createSlice({
    name: 'sessionNotes',
    initialState,
    reducers: {
        clearSuccessMessage: (state) => {
            state.successMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSessionNote.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = ''; 
            })
            .addCase(createSessionNote.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionNotes.push(action.payload); 
                state.successMessage = 'Session note saved successfully!';
            })
            .addCase(createSessionNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSessionNotes.pending, (state) => {
                state.loading = true;
                state.error = null; 
            })
            .addCase(fetchSessionNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionNotes = action.payload; 
            })
            .addCase(fetchSessionNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSuccessMessage } = sessionNoteSlice.actions;
export default sessionNoteSlice.reducer;
