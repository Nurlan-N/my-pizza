import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryId: 0,
  sort: { name: 'популярности', sortProperty: 'raiting' },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    onChangeSort(state, action){
        state.sort = action.payload
    },
  },
});

export const { setCategoryId , onChangeSort } = filterSlice.actions;

export default filterSlice.reducer;
