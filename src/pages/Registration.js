import React, { useState, useContext } from "react";
import Cropper from "react-cropper";
import "cropperjs/src/css/cropper.css";
import "../styles/cropper-avatar-shaper.css";
import { ctx } from "../store/Context";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { COMMENTS_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
const Registration = observer(() => {
  const { user } = useContext(ctx);
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [userName, setUserName] = useState("");
  const [homePage, setHomePage] = useState("");
  const [step, setStep] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState(null);
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropData(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    if (cropper && cropper.getCroppedCanvas) {
      const canvas = cropper.getCroppedCanvas({ width: 150, height: 150 });
      if (canvas) {
        setCropData(canvas.toDataURL("image/png"));
      } else {
        console.error("Failed to get canvas from cropper");
      }
    } else {
      console.error("Cropper is not initialized or invalid");
    }
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setCropData(null);
    setOpen(false);
  };
  function goNextStep() {
    setStep((step) => (+step < 4 ? step + 1 : 1));
  }
  function goPrevStep() {
    setStep((step) => (+step > 1 ? step - 1 : 1));
  }
  const registrate = () => {
    if (password !== passwordConfirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      let regData = new FormData();
      regData.append("email", email);
      regData.append("password", password);
      regData.append("username", userName);
      regData.append("homepage", homePage);
      regData.append("avatar", cropData);
      user.registration(regData).then((regData) => {
        history(COMMENTS_ROUTE);
      });
    } catch (error) {
      alert(error);
    }
  };
  const steps = ["Personal information", "Security data", "Create an account"];
  return (
    <Box
      container="true"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: window.innerHeight - 54,
        maxWidth: "100%",
      }}
    >
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              itemsAlign: "center",
              justifyContent: "center",
              mt: 1,
            }}
            component="h2"
            gutterBottom
          >
            Registration
          </Typography>
          <Divider orientation="horizontal" sx={{ mt: 1 }}></Divider>
          {step === 1 && (
            <>
              <Stack
                direction="column"
                sx={{
                  display: "flex",
                  itemsAlign: "center",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <TextField
                  sx={{ mt: 1 }}
                  size="small"
                  helperText="Please enter you're name"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={"Name"}
                  label="Name"
                />
                <Grid>
                  <TextField
                    fullWidth
                    sx={{ mt: 1 }}
                    size="small"
                    helperText="Please enter you're e-mail"
                    id="deviceName"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={"Enter you're email address..."}
                    label="E-mail"
                  />
                </Grid>

                <TextField
                  sx={{ mt: 1 }}
                  size="small"
                  helperText="Please enter you're homepage"
                  id="gender"
                  value={homePage}
                  onChange={(e) => setHomePage(e.target.value)}
                  placeholder={"Homepage"}
                  label="Homepage"
                />
              </Stack>
            </>
          )}
          {step === 2 && (
            <>
              <form>
                <input
                  type="text"
                  name="username"
                  style={{ display: "none" }}
                  aria-hidden="true"
                  autoComplete="username"
                />
                <Stack
                  direction="column"                  
                  sx={{
                    display: "flex",
                    alignItems: "center", // використовуйте 'alignItems' замість 'itemsAlign'
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  
                  <Grid>
                    <TextField
                      fullWidth
                      sx={{ mt: 1 }}
                      size="small"
                      helperText="Please enter your password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      label="Password"
                      placeholder="Enter your password..."
                      autoComplete="new-password" // Додано autoComplete
                    />
                  </Grid>

                  <Grid>
                    <TextField
                      fullWidth
                      sx={{ mt: 1 }}
                      size="small"
                      helperText="Please confirm your password"
                      id="confirmPassword"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      type="password"
                      label="Confirm password"
                      placeholder="Enter your password again..."
                      autoComplete="new-password" // Додано autoComplete
                    />
                  </Grid>
                </Stack>
              </form>
            </>
          )}
          {step === 3 && (
            <>
              <Grid
                sx={{
                  display: "flex",
                  itemsAlign: "center",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <InputLabel id="file-simple-select">
                  Select you're avatar-image:
                </InputLabel>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  itemsAlign: "center",
                  justifyContent: "center",
                  m: 1,
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleOpen}
                >
                  Select
                </Button>
              </Grid>
              {cropData !== null && open === false && (
                <Grid
                  sx={{
                    display: "flex",
                    itemsAlign: "center",
                    justifyContent: "center",
                    m: 1,
                  }}
                >
                  <Avatar
                    alt="cropped"
                    src={cropData}
                    sx={{ width: 150, height: 150 }}
                  />
                </Grid>
              )}
              <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Please edit you're future look:"}
                </DialogTitle>
                <DialogContent>
                  <Grid
                    container="true"
                    direction="column"
                    alignItems="center"
                    sx={{
                      display: "flex",
                      itemsAlign: "center",
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    <Grid>
                      <Button variant="contained" component="label">
                        Upload
                        <input
                          hidden
                          accept="image/*"
                          multiple
                          type="file"
                          onChange={onChange}
                        />
                      </Button>
                    </Grid>
                    <Grid sx={{ mt: 1 }}>
                      <Cropper
                        zoomable={true}
                        scalable={true}
                        aspectRatio={1}
                        initialAspectRatio={1}
                        preview=""
                        src={cropData}
                        viewMode={1}
                        minCropBoxHeight={"100"}
                        minCropBoxWidth={"100"}
                        background={false}
                        responsive={false}
                        autoCropArea={0}
                        dragMode="crop"
                        checkOrientation={false}
                        onInitialized={(instance) => {
                          setCropper(instance);
                        }}
                        guides={true}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={getCropData} autoFocus>
                    Accept
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          <Divider orientation="horizontal"></Divider>
          <Box
            sx={{
              display: "flex",
              itemsAlign: "center",
              justifyContent: "center",
              width: "100%",
              mt: 1,
            }}
          >
            <Stepper activeStep={step - 1} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          {step !== 3 && (
            <>
              {step !== 1 && (
                <>
                  <Button
                    variant="contained"
                    sx={{ justifyContent: "flex-end" }}
                    onClick={goPrevStep}
                  >
                    Prev
                  </Button>
                </>
              )}
              <Button
                variant="contained"
                sx={{ justifyContent: "flex-end" }}
                onClick={goNextStep}
              >
                Next
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button
                variant="contained"
                sx={{ justifyContent: "flex-end" }}
                onClick={goPrevStep}
              >
                Prev
              </Button>
              <Button
                variant="contained"
                sx={{ itemsAlign: "center", justifyContent: "center" }}
                onClick={registrate}
              >
                Create account
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    </Box>
  );
});
export default Registration;
