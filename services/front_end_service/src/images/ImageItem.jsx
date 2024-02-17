import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import HeartIconLabel from './HeartIconLabel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IMAGE_API_URL } from '../../constants';
import { Cookies } from 'react-cookie';
import { redirect } from 'react-router-dom';


const ImageItem = ({ id, caption, image_url, liked_by_user }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [likeFlag, setLikeFlag] = useState(false);
  const cookie = new Cookies();
  const headers = {
    Authorization: `Bearer ${cookie.get("access_token")}`
  }
  useEffect(() => {
    axios.get(`${IMAGE_API_URL}/images/like-count/`, {params: {image_ids: id}, headers})
    .then((resp) => setLikeCount(resp.data[0].like_count))
    .catch(err => console.error(err));
  }, []);
  const handleClick = () => {
    axios.post(`${IMAGE_API_URL}/images/like-image/${id}`, {}, {headers})
    .then(() => setLikeFlag(!likeFlag))
    .catch(err => console.error(err));
  };

  const handleDelete = () => {
    if(confirm("delete?")) {
      axios.delete(`${IMAGE_API_URL}/images/${id}`, {headers})
      .then(() => redirect("/"))
      .catch(err => console.error(err));
    }
  }
  return (
    <Card>
      <Link href={"#"} underline="none">
        <CardMedia component="img" image={image_url} alt={id} />
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {caption}
          <br />
          <HeartIconLabel onClick={handleClick} onDelete={handleDelete} count={likeCount} liked={likeFlag ? !liked_by_user:liked_by_user} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageItem;
