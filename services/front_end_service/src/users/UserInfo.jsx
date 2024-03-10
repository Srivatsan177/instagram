// TODO: This is not complete fully yet user info updation especially

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Grid, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Button } from "@mui/material";
import { CloudUpload } from '@mui/icons-material';
import styled from '@emotion/styled';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UserInfo = () => {
  const location = useLocation();
  const user = location.state.user;

  const [editable, setEditable] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState({
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    dob: user.dob,
  });
  const [newImage, setNewImage] = useState();
  const handleChange = (e) => {
    const element = e.target.id;
    setNewUserInfo((prev) => ({...prev, [element]: e.target.value}));
  }
  return (
    <Card>
      {
        editable ?
          <Button onClick={() => {
              setEditable(false);
            }
          }
          variant="contained"
          color="primary"
          >
            Save
          </Button>
          :
          <Button onClick={() => setEditable(true)} variant="contained" color="success">
            Edit{ /* Add more user information fields as needed */}
          </Button>
      }
      <CardContent>
        <Typography variant="h5" component="h2">
          {user.username}
        </Typography>
        {editable ?
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
          >
            Upload Profile Pic
            <VisuallyHiddenInput type="file" />
          </Button> :
          <img src={user.image_s3_url} />
        }
        <List>
          {editable ?
            <>
              <ListItem>
                <TextField id="name" onChange={handleChange} label="Name" value={newUserInfo.name} />
              </ListItem>
              <ListItem>
                <TextField id="email" onChange={handleChange} label="Email" value={newUserInfo.email} />
              </ListItem>
              <ListItem>
                <TextField id="phone_number" onChange={handleChange} label="Phone" value={newUserInfo.phone_number} />
              </ListItem>
              <ListItem>
                <TextField id="dob" onChange={handleChange} label="Date of Birth" value={newUserInfo.dob} />
              </ListItem>
            </> :
            <>
              <ListItem>
                <ListItemText primary="Name" secondary={newUserInfo.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={newUserInfo.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone" secondary={newUserInfo.phone_number} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Date of Birth" secondary={newUserInfo.dob} />
              </ListItem>
            </>
          }
        </List>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
