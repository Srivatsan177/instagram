import { createSlice } from '@reduxjs/toolkit'

export const snackBarMsg = createSlice({
  name: 'snackBarMsg',
  initialState: {
    value: "",
  },
  reducers: {
    getValue: (state) => {
        return state.value;
    },
    setValue: (state, action) => {
        state.value = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setValue, getValue } = snackBarMsg.actions

export default snackBarMsg.reducer