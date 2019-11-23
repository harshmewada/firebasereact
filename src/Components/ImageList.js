import React, { useEffect, useState,} from "react";
import { Grid, GridList, GridListTile, Container, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../firebase";

const useStyles = makeStyles(theme => ({
root:{

},

}));
const firestore = firebase.firestore();

export default function ImageList() {
  const classes = useStyles();
  const [array, setarray] = useState([]);
 
  // const getExlore = ()=>{
    //Explore Working
  //   firestore
  //   .collection("wallpapers")
  //   .orderBy("date",'desc')
  //   .get()
  //   .then(querySnapshot => {
  //     const data = querySnapshot.docs.map(doc => doc.data());
  //     console.log(data);
  //     setarray(data);
  //   });
  // }
  const getExlore = ()=>{
    firestore
    .collection("wallpapers")
    .orderBy("downloads",'asc')
    .where('downloads','>=',500)
  
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      console.log(data);
      setarray(data);
    });
  }
  useEffect(() => {
    getExlore()
     }, [])
  return (
   
    <div className={classes.root}>
      <Grid container spacing={2} >
      <Grid item xs={12} lg={12}>
        <span style={{color:'#808080',textAlign:'center'}}>Image List</span>
        </Grid>
        {array.map(tile=><Grid item xs={6} lg={2} key={tile.date.seconds}>
         
         <img src={tile.imageUrl} style={{width:'100%',border:'5px solid #e8eae7',boxShadow:'0px 3px 3px -2px'}}/>
        
        </Grid>)}
      </Grid>
       
     
     
    </div>
  );
}
