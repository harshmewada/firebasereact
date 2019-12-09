import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Button,
  CircularProgress,
  TextField,
  Card
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Firebase from "../../firebase";
import Checkbox from "@material-ui/core/Checkbox";
const storage = Firebase.storage();
const firestore = Firebase.firestore();
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));
const ImageUplad = () => {
  const classes = useStyles();
  const [image, setImage] = useState();
  const [thumb, setThumb] = useState();
  const [imgurl, setImgurl] = useState();
  const [thumburl, setThumburl] = useState();
  const [upload, setUpload] = useState(false);
  const [uploadprogress, setuploadprogress] = useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [amoled, setAmoled] = useState(false);
  const [artist, setArtist] = useState();
  const [artistUrl, setArtistUrl] = useState();
  const [platform, setPlatform] = useState();
  const [platformUrl, setPlatformUrl] = useState();
  const [downloadCount, setDownloadCount] = useState();
  const [saveVisible, setSaveVisible] = useState(false);
  const [amoledArray, setAmoledArray] = useState([]);

  const ImgChange = e => {
    if (e.target.files[0]) {
      const Image = e.target.files[0];

      setImage(Image);
    }
  };
  const ThumbChange = e => {
    if (e.target.files[0]) {
      const Image = e.target.files[0];

      setThumb(Image);
    }
  };

  const AristChange = e => {
    setArtist(e.target.value);
  };
  const AristUrlChange = e => {
    setArtistUrl(e.target.value);
  };
  const platformChange = e => {
    setPlatform(e.target.value);
  };
  const platformUrlChange = e => {
    setPlatformUrl(e.target.value);
  };
  const DownloadCountChange = e => {
    const count = e.target.value;
    setDownloadCount(count);
  };
  const handleUpload = () => {
    setUpload(true);

    const UploadTask = storage.ref(`images/${image.name}`).put(image);
    UploadTask.on("state_changed", snapshot => {
      // progress function ...
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setuploadprogress(progress);
    });
    const ThumbTask = storage.ref(`images/${thumb.name}`).put(image);
    ThumbTask.on("state_changed", snapshot => {
      // progress function ...
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setuploadprogress(progress);
    });

    setUpload(false);
  };
  const getUrl = () => {
    storage
      .ref(`images/${image.name}`)

      .getDownloadURL()
      .then(url => {
        setImgurl(url);
      });
    storage
      .ref(`images/${thumb.name}`)

      .getDownloadURL()
      .then(url => {
        setThumburl(url);
      });
  };
  const FirestoredataUpload = () => {
    setSaveVisible(true);
    firestore
      .collection("wallpapers")
      .add({
        name: image.name,
        imageUrl: imgurl,
        thumb: thumb.name,
        thumbUrl: thumburl,
        artistName: artist ? artist : null,
        artistUrl: artistUrl ? artistUrl : null,
        platform: platform ? platform : null,
        platformUrl: platformUrl ? platformUrl : null,
        downloads: downloadCount ? Number(downloadCount) : null,
        amoled: amoled != true ? [] : ["true"],
        date: Number(new Date())
      })
      .then(setDialogOpen(true), setSaveVisible(false))
      .then(() => Empty())
      .catch(err => alert("Error", err));
  };
  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  const Empty = () => {
    setImage();
    setImgurl();
    setThumb();
    setImgurl();
    setArtist();
    setArtistUrl();
    setPlatform();
    setPlatformUrl();
    setDownloadCount();
    setuploadprogress(0);
  };
  return (
    <div className={classes.root}>
      {console.log(
        "Image:",
        image,
        "\n",
        "Thumb:",
        thumb,
        "\n",
        "IMageUrl:",
        imgurl,
        "\n",
        "thumburl:",
        thumburl,
        "\n",
        "artist:",
        artist,
        "\n",
        "artistUrl:",
        artistUrl,
        "\n",
        "platform:",
        platform,
        "\n",
        "platform Url:",
        platformUrl
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "auto"
        }}
      >
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">{"Upload"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span style={{ color: "#5aaf76" }}>Upload Sucessful</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Grid
          container
          justify="flex-start"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item lg={4} xs={12}>
            <Card style={{ padding: "15px" }}>
              <Grid container direction="row" spacing={3}>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  style={{ display: "flex", alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      textAlign: "left",
                      color: "#898080",
                      fontSize: "30px"
                    }}
                  >
                    Upload Images
                  </span>
                </Grid>
                <Grid item xs={6} lg={6}>
                  <label
                    style={{
                      padding: "1vh 2vh",
                      // backgroundColor: "#0b2643",
                      border: "2px solid #ffc828",

                      borderRadius: "10px",
                      display: "flex",
                      color: "black",
                      justifySelf: "flex-start",
                      alignSelf: "flex-start",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <input type="file" hidden onChange={e => ImgChange(e)} />
                    Image
                  </label>
                </Grid>
                <Grid
                  item
                  xs={6}
                  lg={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <span style={{ color: "#808080" }}>File Name</span>
                </Grid>
                <Grid item xs={6} lg={6}>
                  <label
                    style={{
                      padding: "1vh 0.5vh",
                      // backgroundColor: "#0b2643",
                      border: "2px solid #ffc828",

                      borderRadius: "10px",
                      display: "flex",
                      color: "black",
                      justifySelf: "flex-start",
                      alignSelf: "flex-start",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <input type="file" hidden onChange={e => ThumbChange(e)} />
                    Thumbnail
                  </label>
                </Grid>
                <Grid
                  item
                  xs={6}
                  lg={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <span style={{ color: "#808080" }}>File Name</span>
                </Grid>
                <Grid
                  item
                  xs={8}
                  lg={6}
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center"
                  }}
                >
                  {uploadprogress === 100 ? (
                    <span style={{ color: "#5aaf76" }}>Success</span>
                  ) : (
                    <CircularProgress
                      size={20}
                      variant="static"
                      value={uploadprogress}
                    />
                  )}
                </Grid>

                <Grid
                  item
                  xs={4}
                  lg={6}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ textTransform: "none" }}
                    onClick={() => handleUpload()}
                  >
                    Upload
                  </Button>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    placeholder="Image Url"
                    value={imgurl}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    placeholder="Thumbnail Url"
                    value={thumburl}
                    disabled
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => getUrl()}
                  >
                    Get Urls
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card style={{ padding: "15px" }}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  style={{ display: "flex", alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      textAlign: "left",
                      color: "#898080",
                      fontSize: "30px"
                    }}
                  >
                    Artist Info
                  </span>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Artist Name"
                    value={artist}
                    variant="outlined"
                    onChange={e => AristChange(e)}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Artist Link"
                    value={artistUrl}
                    variant="outlined"
                    onChange={e => AristUrlChange(e)}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Platform Name"
                    variant="outlined"
                    value={platform}
                    onChange={e => platformChange(e)}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Platform Link"
                    variant="outlined"
                    value={platformUrl}
                    onChange={e => platformUrlChange(e)}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card style={{ padding: "15px" }}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  style={{ display: "flex", alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      textAlign: "left",
                      color: "#898080",
                      fontSize: "30px"
                    }}
                  >
                    Miscellenous
                  </span>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Download Count"
                    variant="outlined"
                    onChange={e => DownloadCountChange(e)}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  style={{
                    display: "flex",
                    alignItems: "flexStart",
                    alignItems: "center"
                  }}
                >
                  <Checkbox
                    placeholder="Amoled"
                    checked={amoled}
                    onChange={() => setAmoled(!amoled)}
                  />
                  <span> Amoled</span>
                </Grid>
                <Grid
                  item
                  xs={6}
                  lg={8}
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center"
                  }}
                >
                  {saveVisible ? (
                    <div>
                      <CircularProgress size={20} />
                      Saving Data
                    </div>
                  ) : null}
                </Grid>
                <Grid
                  item
                  xs={6}
                  lg={4}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => FirestoredataUpload()}
                  >
                    Save Data
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default ImageUplad;
