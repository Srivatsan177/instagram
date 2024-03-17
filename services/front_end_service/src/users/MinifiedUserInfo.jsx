import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
  Button,
} from "@mui/material";
import { USER_API_URL } from "../../constants";
import { Cookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { setValue } from "../features/global/snackbar";

export default function MinifiedUserInfo() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const cookies = new Cookies();
  const access_token = cookies.get("access_token");
  const [flag, setFlag] = useState(false);
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  useEffect(() => {
    axios
      .get(`${USER_API_URL}/users/info/${userId}`, { headers })
      .then((resp) => {
        setUser((prev) => ({ ...prev, ...resp.data }));
      })
      .catch((err) => console.error(err));
    axios
      .get(`${USER_API_URL}/users/follower-following-count/${userId}`, {
        headers,
      })
      .then((resp) => setUser((prev) => ({ ...prev, ...resp.data })))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get(`${USER_API_URL}/users/info/${userId}`, { headers })
      .then((resp) => setUser((prev) => ({ ...prev, ...resp.data })))
      .catch((err) => console.error(err));
    axios
      .get(`${USER_API_URL}/users/follower-following-count/${userId}`, {
        headers,
      })
      .then((resp) => setUser((prev) => ({ ...prev, ...resp.data })))
      .catch((err) => console.log(err));
  }, [flag]);
  const handleSubmit = () => {
    axios
      .post(`${USER_API_URL}/users/follow/${user.id}`, {}, { headers })
      .then((resp) => {
        if (resp.data) {
          dispatch(setValue("Following User"));
        } else {
          dispatch(setValue("Un-Followed user"));
        }
        setFlag(!flag);
      })
      .catch((err) => console.error(err));
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {user?.username}
        </Typography>
        <img src={user?.image_s3_url} />
        <List>
          <ListItem>
            Followers:{user?.follower_count} | Following:{" "}
            {user?.following_count}
          </ListItem>
          {!user?.own_user && (
            <ListItem>
              <Button onClick={handleSubmit}>
                {user?.following ? "Un-Follow" : "Follow"}
              </Button>
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
