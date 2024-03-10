import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import HeartIconLabel from './HeartIconLabel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IMAGE_API_URL, USER_API_URL } from '../../constants';
import { Cookies } from 'react-cookie';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';


const ImageItem = ({ id, caption, image_url, liked_by_user, user_id, own_user }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [likeFlag, setLikeFlag] = useState(false);
  const cookie = new Cookies();
  const [minUser, setMinUser] = useState({});
  const navigate = useNavigate();
  const headers = {
    Authorization: `Bearer ${cookie.get("access_token")}`
  }
  useEffect(() => {
    axios.get(`${IMAGE_API_URL}/images/like-count/`, {params: {image_ids: id}, headers})
    .then((resp) => setLikeCount(resp.data[0].like_count))
    .catch(err => console.error(err));
    
    axios.get(`${USER_API_URL}/users/info/${user_id}`, {headers})
    .then(resp => setMinUser(resp.data))
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
      <Button onClick={() => navigate(`/user-info/${user_id}`)} sx={{width: "100%", justifyContent: "start"}} startIcon={<img src={minUser?.image_s3_url} style={{width: "25px", height: "25px"}}/>}>
        {minUser?.username}
      </Button>
      <Link href={"#"} underline="none">
        <CardMedia component="img" image={image_url} alt={id} />
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {caption}
          <br />
          <HeartIconLabel ownUser={own_user} onClick={handleClick} onDelete={handleDelete} count={likeCount} liked={likeFlag ? !liked_by_user:liked_by_user} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageItem;
