import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setValue } from "../features/global/snackbar";
import { Snackbar } from "@mui/material";

function SnackBar() {
  const msg = useSelector((state) => state.snackBarMsg.value);
  console.log(msg);
  const dispatch = useDispatch();
  return (
    <Snackbar
      open={msg?true:false}
      autoHideDuration={6000}
      onClose={() => {
        dispatch(setValue(""))
      }}
      message={msg}
    />
  );
}

export default SnackBar;
