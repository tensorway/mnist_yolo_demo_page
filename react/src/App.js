import './App.css';
import React from 'react'
import { Button, AppBar, Toolbar, Typography, LinearProgress, Card, withStyles, Grid, Container } from '@material-ui/core'
import Box from '@material-ui/core/Box';
import CanvasDraw from "react-canvas-draw";
import back from "./imgs/background.jpg"


const useStyles = (theme) => ({
  root: {
    height: "100%",
    background: "url(" + { back } + ")",
    flex: 1,
  },
  main_card: {
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(8),
  },
  main_cont: {
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    width: "100%",
  }
});


class App extends React.Component {
  constructor() {
    super();
    this.canvas_height = 200;
    this.canvas_width = 1000;
    this.saveableCanvas = 0;
    this.api = "http://backend:5000/";
  }

  state = {
    load: false,
    sent_request: false,
    toggle: false,
    img_name: 'error.jpg',
  }

  post_json() {
    this.setState({ load: !this.state.load })

    let x = this.saveableCanvas.getSaveData();
    fetch('http://18.191.201.204/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: x,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  process_img() {
    this.setState({ load: true })

    let x = this.saveableCanvas.getSaveData();
    fetch('http://18.191.201.204/api/yolo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: x,
    })
      .then(response => {console.log(response); return response})
      .then(response => response.json())
      .then(data => {
        this.setState({sent_request: true, img_name:data.img_name ,load:false});
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  load() {
    if (this.state.load === true)
      return <LinearProgress color="primary" />
    return <LinearProgress variant="determinate" value={100} />
  }

  return_img(){
    if (this.state.sent_request === true){
      let nes = "get_image?key="+this.state.img_name;
      return <img src={'api/'+nes} alt="Loading"/> 
    }
    return <Box> </Box>
  }

  render() {
    const { classes } = this.props;
    return (
      <Box >
        <AppBar position="static" color="primary">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              MNIST Yolo
            </Typography>
          </Toolbar>
        </AppBar>

        <Container className={classes.main_cont}>
          <Card variant='elevation' className={classes.main_card} maxwidth="md">
            <Grid container direction='column' spacing={10} justify='center' alignItems='center'>
              <Grid item xs={11} sm={6} spacing={5} >
                <Card variant='elevation'>
                  <Typography variant='h6' align='center'>
                    Draw digits on provided canvas and press 'RUN MODEL'. You do not need to write big digits (e.g. the digit that covers 100% of the available height). The model should recognize digits and mark them using bounding boxes.
                    This is a mix of different Yolo versions, it is fully convolutional and has residual layers.
                    The model is trained on a generated dataset of MNIST digits.
                </Typography>
                </Card>
              </Grid>

              <Grid container justify='center' alignItems='center' spacing={10}>
                <Grid item>
                  {this.load()}
                  <CanvasDraw
                    canvasHeight={this.canvas_height}
                    canvasWidth={this.canvas_width}
                    ref={canvasDraw => (this.saveableCanvas = canvasDraw)} />
                  {this.load()}

                </Grid>

                <Grid container direction='row' spacing={5} justify='center' alignItems='center'>
                  <Grid item>
                    <Button variant="outlined" size='large' color="primary" onClick={() => {this.saveableCanvas.clear(); this.setState({sent_request:false})}} >
                      Clear
                  </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" size='large' color="primary" onClick={() => this.saveableCanvas.undo()} >
                      Undo
                  </Button>
                  </Grid>
                </Grid>
                <Grid item>
                  <Button variant="outlined" size='large' color='secondary' onClick={() => this.process_img()}>
                    run Model
                  </Button>
                </Grid>
              </Grid>

              <Grid item>
                {this.return_img()}
              </Grid>
            </Grid>

          </Card>
        </Container>
      </Box>
    );
  }
}

export default withStyles(useStyles)(App);
