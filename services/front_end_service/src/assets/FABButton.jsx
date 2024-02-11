import React from "react";
import { Fab } from "@mui/material";

function FABButton({setOpen}) {

  return (
    <Fab
      color="primary"
      aria-label="add"
      style={{
        position: "fixed",
        bottom: 16, 
        right: 16, 
        zIndex: 999,
      }}
      onClick={() => {
        setOpen((prev) => !prev);
      }}
    >
      +
    </Fab>
  );
}

export default FABButton;
