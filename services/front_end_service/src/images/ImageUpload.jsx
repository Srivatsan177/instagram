import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { IMAGE_API_URL } from "../../constants";
import { Cookies } from "react-cookie";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState();

  const handleChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    // Check file type
    if (file.type === "image/jpeg" || file.type === "image/png") {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName("");
      // Optionally display an error message
      console.error("Only JPG and PNG files are allowed.");
    }
  };

  const handleUpload = () => {
    // Implement your upload logic here
    // Example: send the file to your server using FormData
    const formData = new FormData();
    formData.append("file", selectedFile);
    const cookie = new Cookies();
    const accessToken = cookie.get("refresh_token");
    const payload = {
      image_name: fileName,
      caption,
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    axios
      .post(`${IMAGE_API_URL}/images/post-image/`, payload, { headers })
      .then((response) => {
        const imageId = response.data.image_id;
        const presignedPutURL = response.data.presigned_url;

        async function uploadFileToS3(file, preSignedUrl) {
          const formData = new FormData();
          formData.append("file", file);

          try {
            fetch(
              preSignedUrl,
              { method: "PUT", body: formData },
              {
                 //       (progressEvent.loaded * 100) / progressEvent.total
                //     );
                //     console.log(`Upload progress: ${percentage}%`);
                //   },//   onUploadProgress: (progressEvent) => {
                //     const percentage = Math.round(
               
              }
            )
              .then(() => console.log("upload first promise"))
              .then(() => alert("uploaded"))
              .catch((err) => console.log(err));

            console.log("File uploaded successfully!");
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }
        uploadFileToS3(file, presignedPutURL)
          .then(() => {
            axios
              .post(`${IMAGE_API_URL}/images/post-image-success`, {
                image_id: imageId,
                headers,
              })
              .then(() => alert("uploaded"))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => alert("Error"));
  };

  return (
    <div style={{ display: "block" }}>
      <Box sx={{ margin: 1 }}>
        <TextField
          type="file"
          label="Select file"
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <Box sx={{ maring: 1 }}>
        <TextField
          type="input"
          label="Caption"
          onChange={(e) => setCaption(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Box>
      <Box sx={{ margin: 1 }}>
        {selectedFile && (
          <Typography variant="caption">Selected: {fileName}</Typography>
        )}
      </Box>
      <Box sx={{ margin: 1 }}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload
        </Button>
      </Box>
    </div>
  );
};

export default ImageUpload;
