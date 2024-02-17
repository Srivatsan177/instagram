import React, { useState, useEffect } from "react";
import axios from "axios";
import { IMAGE_API_URL } from "../../constants";
import { Cookies } from "react-cookie";
import { Grid, Paper, Pagination } from "@mui/material";
import ImageItem from "./ImageItem";
import FABButton from "../assets/FABButton";
import AddImageModal from "./AddImageModal";

export const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [maxPage, setMaxPage] = useState(2);

  // Modal handling
  const [open, setOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    if(newPage == maxPage) {
        setMaxPage(newPage + 1);
    }
    setPage(newPage);
  };

  const fetchData = async () => {
    const cookies = new Cookies();
    const accessToken = cookies.get("access_token");
    const params = {
      page: page - 1,
      limit,
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await axios.get(apiUrl, { params, headers });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Replace with your actual backend API endpoint
  const apiUrl = `${IMAGE_API_URL}/images`;

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [page]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Render the fetched data here based on its structure
  return (
    <div style={{marginTop: 10}}>
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid item xs={4} key={index}>
            <Paper style={{ padding: 20 }}><ImageItem {...item} /></Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Pagination count={maxPage + 1} page={page} onChange={handleChangePage} />
        </Grid>
      </Grid>
      <AddImageModal open={open} setOpen={setOpen} />
      <FABButton setOpen={setOpen} />
    </div>
  );
};
