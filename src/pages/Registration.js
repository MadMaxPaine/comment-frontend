import React, { useState, useContext, useEffect, useRef } from "react";
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
  const cropperRef = useRef(null);
  const [cropData, setCropData] = useState(null);
  //const [cropper, setCropper] = useState(null);
  const [image, setImage] = useState(null); // <-- Сюди йде FileReader result

  // Стани для перевірки завершення кроків
  const [isStep1Complete, setIsStep1Complete] = useState(false);
  const [isStep2Complete, setIsStep2Complete] = useState(false);
  const [isStep3Complete, setIsStep3Complete] = useState(false);
  // Валідація кроку 1
  useEffect(() => {
    if (
      userName &&
      email &&
      /^[a-zA-Z0-9]+$/.test(userName) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setIsStep1Complete(true);
    } else {
      setIsStep1Complete(false);
    }
  }, [userName, email]);
  // Валідація кроку 2
  useEffect(() => {
    if (password && passwordConfirm && password === passwordConfirm) {
      setIsStep2Complete(true);
    } else {
      setIsStep2Complete(false);
    }
  }, [password, passwordConfirm]);
  // Валідація кроку 3
  useEffect(() => {
    if (cropData) {
      setIsStep3Complete(true);
    } else {
      setIsStep3Complete(false);
    }
  }, [cropData]);

  // Функція для переходу на наступний крок
  function goNextStep() {
    if (step === 1 && isStep1Complete) {
      setStep(step + 1);
    } else if (step === 2 && isStep2Complete) {
      setStep(step + 1);
    } else if (step === 3 && isStep3Complete) {
      setStep(step + 1);
    } else {
      alert("Please complete the current step before proceeding.");
    }
  }
  // Функція для повернення на попередній крок
  function goPrevStep() {
    setStep(step - 1);
  }
  const onChange = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // base64 string
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const getCropData = () => {   
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      console.error("Cropper is not initialized yet.");
      return;
    }
  
    if (!image) {
      console.error("No image loaded for cropping.");
      return;
    }
    
    const canvas = cropper.getCroppedCanvas({ width: 150, height: 150 });
    
    if (!canvas) {
      console.error("Failed to get cropped canvas.");
      return;
    }
  
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to convert canvas to blob.");
        return;
      }
  
      const file = new File([blob], "avatar.png", { type: "image/png" });
      setCropData(file);
      setOpen(false); // Закриваємо діалог після обрізки
    }, "image/png");
  };
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setCropData(null);
    setOpen(false);
  };
  /*
  function goNextStep() {
    setStep((step) => (+step < 4 ? step + 1 : 1));
  }
  function goPrevStep() {
    setStep((step) => (+step > 1 ? step - 1 : 1));
  }
    */
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
                  id="userName"
                  inputProps={{
                    pattern: "^[a-zA-Z0-9]+$",
                    title: "Allowed only latin letters and numbers",
                  }}
                  error={!!userName && !/^[a-zA-Z0-9]+$/.test(userName)}
                  helperText={
                    userName && !/^[a-zA-Z0-9]+$/.test(userName)
                      ? "Allowed only latin letters and numbers"
                      : ""
                  }
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={"Name"}
                  label="Name"
                  required
                />
                <Grid>
                  <TextField
                    fullWidth
                    sx={{ mt: 1 }}
                    size="small"
                    error={!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                    helperText={
                      email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ? "Incorrect format for email"
                        : ""
                    }
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={"Enter you're email address..."}
                    label="E-mail"
                    required
                  />
                </Grid>

                <TextField
                  sx={{ mt: 1 }}
                  size="small"
                  error={
                    !!homePage &&
                    !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)
                  } // Валідація URL
                  helperText={
                    homePage &&
                    !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)
                      ? "Incorrect format for URL"
                      : ""
                  }
                  id="homepage"
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
                <Stack
                  direction="column"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  {/* Hidden username field for accessibility */}
                  <input
                    type="text"
                    style={{ display: "none" }}
                    name="username"
                    aria-hidden="true"
                    autoComplete="username"
                  />
                  <Grid>
                    <TextField
                      fullWidth
                      sx={{ mt: 1 }}
                      size="small"
                      helperText="Please enter your password"
                      id="password"
                      value={password}
                      error={password === ""}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      label="Password"
                      placeholder="Enter your password..."
                      autoComplete="new-password" // Додано autoComplete
                      required
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      sx={{ mt: 1 }}
                      size="small"
                      helperText={
                        password !== passwordConfirm
                          ? "Passwords do not match"
                          : "Please confirm your password"
                      }
                      error={password !== passwordConfirm} // Помилка, якщо паролі не співпадають
                      id="confirmPassword"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      type="password"
                      label="Confirm password"
                      placeholder="Enter your password again..."
                      autoComplete="new-password" // Додано autoComplete
                      required
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
              {image !== null && open === false && (
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
                    src={image}
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
                        src={image} // <-- саме image, не cropData
                        viewMode={1}
                        minCropBoxHeight={100}
                        minCropBoxWidth={100}
                        background={false}
                        responsive={false}
                        autoCropArea={0}
                        dragMode="crop"
                        ref={cropperRef}
                        checkOrientation={false}
                        onInitialized={(instance) => {
                          console.log(instance);
                          
                          //setCropper(instance);
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
