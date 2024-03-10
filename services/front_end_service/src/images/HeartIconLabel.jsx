import React from 'react';
import { Avatar, Badge, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function HeartIconLabel({ count, onClick, onDelete, size = 'medium', color = 'secondary', liked, ownUser }) {
  return (
    <div style={{ float: "right" }}>
      <IconButton>
        <Badge badgeContent={count} color={color}>
          <Avatar onClick={onClick} sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: `var(--${color})` }}>
            {liked ? <FavoriteIcon fontSize={size} color={color} /> : <FavoriteBorderIcon fontSize={size} color={color} />}
          </Avatar>
        </Badge>
      </IconButton>
      {ownUser &&
        <IconButton onClick={onDelete}>
          <DeleteOutlineIcon style={{ color: "red" }} />
        </IconButton>
      }
    </div>
  );
}

export default HeartIconLabel;
