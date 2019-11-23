import React, { useState } from "react";
import Firebase from "../firebase";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid, Button, TextField } from "@material-ui/core";
const Uppy = require('@uppy/core')
const ThumbnailGenerator = require('@uppy/thumbnail-generator')
 


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  btnWrapper: {
    padding: "20px"
  }
}));
const storage = Firebase.storage();
const firestore = Firebase.firestore();

const ImageUpload = () => {
  const classes = useStyles();
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [thumb,setThumb] =useState()
  const [artist,setArtist] = useState()
  const [artistUrl,setArtistUrl] = useState()
  const [platform,setPlatform] = useState()
  const [downloadCount,setDownloadCount] = useState()

  
   
  
  
  const handleChange = e => {
    if (e.target.files[0]) {
      const Image = e.target.files[0];

      setImage(Image);
     

    }
  };
 
  const handleUpload = () => {
    setVisible(true);

    const UploadTask = storage.ref(`images/${image.name}`).put(image);
    UploadTask.on("state_changed", snapshot => {
      // progress function ...
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress(progress);

    });

    setVisible(false);
  };
  const getUrl = () => {
    storage
      .ref(`images/${image.name}`)

      .getDownloadURL()
      .then(url => {
        setUrl(url);
      });
  };
  const dataUpload = () => {
    firestore
      .collection("wallpapers")
      .add({
        name: image.name,
        url: url,
        date: new Date(),
        artist:artist,
        medium:medium
      })
      .then(setVisible(false));
  };
  return (
    <div className="center">
      <Grid container>
        <Grid item lg={6}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{ height: "90vh" }}
          >
            <Grid item>
              <h3>DarkPapers Image Uploader</h3>
            </Grid>
            <Grid item>
              <input
                type="file"
                onChange={e => handleChange(e)}
                name="Choose"
                style={{ border: "2px solid gray" }}
                placeholder="choose"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpload()}
              >
                Upload
              </Button>
            </Grid>

            {progress == 100 ? (
              "Uploaded"
            ) : (
              <Grid item>
                <CircularProgress variant="determinate" value={progress} />
              </Grid>
            )}

            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  getUrl();
                }}
              >
                Get Url
              </Button>
            </Grid>
            <Grid item>
              <TextField
                id="outlined-basic"
                style={{ width: 500 }}
                multiline
                rowsMax={6}
                label="Url"
                variant="standard"
                value={url}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6}>
          <Grid
            container
            justify="center"
            alignItems="center"
            spacing={2}
            direction="column"
            style={{ height: "90vh" }}
          >
            <Grid item>
              <Grid
                container
                justify="flex-start"
                alignItems="center"
                direction="column"
                spacing={2}
              >
                <Grid item>
                  <h3>Add Image to Collection</h3>
                </Grid>
                <Grid item>
                  <Grid item>
                  {/* <TextField
          id="standard-basic"
          className={classes.textField}
          label="Artist Name"
          margin="normal"
          onChange={(e)=>setArtist(e)}
        />
             <TextField
          id="standard-basic"
          className={classes.textField}
          label="Uploaded On"
          margin="normal"
          onChange={(e)=>setMedium(e)}
        /> */}
                  </Grid>
                  <h5>Image Name</h5>

                  <TextField
                    variant="standard"
                    disabled
                    multiline
                    rowsMax={4}
                    value={image ? image.name : ""}
                  />
                </Grid>

                <Grid item>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      dataUpload();
                    }}
                  >
                    Add to Database
                  </Button>
                </Grid>
                <Grid item>
                  {!visible ? null : (
                    <Button variant="contained" color="primary">
                      "Success"
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ImageUpload;
