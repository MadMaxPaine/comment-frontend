import React, { useContext, useState } from "react";
import { ctx } from "../store/Context";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import { LOGIN_ROUTE, USER_ROUTE, COMMENTS_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../styles/theme-context";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
const { REACT_APP_API_URL } = require("../utils/consts");
const NavBar = observer(() => {
  const { user } = useContext(ctx);  
  const { toggleTheme, theme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const history = useNavigate();

  const logOut = async () => {
    handleClose();
    await user.logout();
    history(COMMENTS_ROUTE);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
            Comments
          </Typography>

          <Tooltip title="Switch Theme">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Box>
            {user.isAuth ? (
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Tooltip title={user._user.firstName || "Open settings"}>
                  <Box>
                    <Paper
                      sx={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        p: 0.4,
                        borderRadius: "50%",
                      }}
                    >
                      <Avatar
                        sx={{ width: 48, height: 48 }}
                        alt={user._user.userName || "User Avatar"}
                        src={
                          user._user.avatar
                            ? `${REACT_APP_API_URL}/${user._user.avatar}`
                            : ""
                        }
                      />
                    </Paper>
                  </Box>
                </Tooltip>
              </IconButton>
            ) : (
              <IconButton onClick={() => history(LOGIN_ROUTE)} sx={{ p: 0 }}>
                <Tooltip title="Account">
                  <Paper
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      p: 0.4,
                      borderRadius: "50%",
                    }}
                  >
                    <Avatar sx={{ width: 48, height: 48 }} />
                  </Paper>
                </Tooltip>
              </IconButton>
            )}

            {user.isAuth ? (
              <>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      history(USER_ROUTE);
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      history(COMMENTS_ROUTE);
                    }}
                  >
                    Store
                  </MenuItem>                  
                  <MenuItem onClick={handleClose}>Setting</MenuItem>
                  <MenuItem onClick={() => logOut()}>Exit</MenuItem>
                </Menu>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
});

export default NavBar;
