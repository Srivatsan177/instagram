import { configureStore } from '@reduxjs/toolkit'
import snackBarMsgReducer from '../src/features/global/snackbar'

export default configureStore({
  reducer: {
    snackBarMsg: snackBarMsgReducer,
  },
})