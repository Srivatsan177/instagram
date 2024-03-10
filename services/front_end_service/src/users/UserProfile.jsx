import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserProfile({user}) {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate("/info", {state: {user}})} sx={{color: "white"}} startIcon={<img src={user.image_s3_url} style={{height: "50px", width: "50px"}} />}>
        {user.username}
    </Button>
  )
}
