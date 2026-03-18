import { createSlice } from '@reduxjs/toolkit';

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: {
    transactionSound: true,
    showBalance: true,
  },
  reducers: {
    setTransactionSound(state, action) {
      state.transactionSound = action.payload;
    },
    setShowBalance(state, action) {
      state.showBalance = action.payload;
    },
    setPreference(state, action) {
      state = { ...state, ...action.payload };
    },
  },
});

export const { setTransactionSound, setShowBalance, setPreference } = preferencesSlice.actions;
export default preferencesSlice.reducer;
