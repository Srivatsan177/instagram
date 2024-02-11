import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const ImageItem = ({ id, caption, image_url }) => {
  return (
    <Card>
      <Link href={"#"} underline="none">
        <CardMedia component="img" image={image_url} alt={id} />
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {caption}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageItem;
