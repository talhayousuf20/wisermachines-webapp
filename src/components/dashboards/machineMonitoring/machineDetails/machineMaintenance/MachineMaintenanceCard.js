import React from "react";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core/styles";
import { smallCard, common } from "../../../../../utils/styles";
import colors from "../../../../../utils/colors";

import { useSelector, useDispatch } from "react-redux";
import { getMachineMaintenanceConfig } from "../../../../../redux/actions/machineMonitoring/machineDetailsActions";

const useStyles = makeStyles((theme) => common(theme));

const set = "set";
const update = "update";
const reset = "reset";

export default function MachineMaintenanceCard(props) {
  const { icon, values, disabled } = props.data;
  const { ID } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  // Menu
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Dialog
  const [openSetDialog, setOpenSetDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [openResetDialog, setOpenResetDialog] = React.useState(false);

  const handleClickOpenDialog = (e, type) => {
    if (type === set) {
      setOpenSetDialog(true);
    }
    if (type === update) {
      setOpenUpdateDialog(true);
    }
    if (type === reset) {
      setOpenResetDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseDialog = (e, type) => {
    if (type === set) {
      setOpenSetDialog(false);
    }
    if (type === update) {
      setOpenUpdateDialog(false);
    }
    if (type === reset) {
      setOpenResetDialog(false);
    }
  };

  const renderSetDialog = (
    <Dialog open={openSetDialog} onClose={(e) => handleCloseDialog(e, set)}>
      {/* <DialogTitle>{set}</DialogTitle> */}
      <DialogContent>
        <DialogContentText>
          Set configration for machine maintenance
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={(e) => handleCloseDialog(e, set)}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={(e) => handleCloseDialog(e, set)}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  React.useEffect(() => {
    getMachineMaintenanceConfig(dispatch, ID);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ButtonBase onClick={(e) => handleMenuClick(e)} style={{ width: "100%" }}>
        <Grid
          container
          component={Paper}
          direction="row"
          justify="center"
          alignItems="center"
          elevation={2}
          style={{
            padding: 12,
            height: "100%",
            backgroundColor: disabled ? colors.GREY[300] : "white",
          }}
          className={disabled ? "" : classes.cardHover}
        >
          <Grid item xs={2}>
            <Paper style={smallCard.iconPaper} elevation={0}>
              {icon}
            </Paper>
          </Grid>
          <Grid item xs={10}>
            <Paper style={smallCard.textPaper} elevation={0}>
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
              >
                <Grid item xs={"auto"}>
                  <Typography
                    align="center"
                    variant="h6"
                    style={{ color: colors.BLUEGREY[600] }}
                  >
                    {values.primary}
                  </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <Typography
                    align="center"
                    variant="body1"
                    style={{ color: colors.BLUEGREY[500] }}
                  >
                    {values.secondary}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </ButtonBase>
      <Menu
        id="simple-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={(e) => handleClickOpenDialog(e, set)}>Set</MenuItem>
        {/* <MenuItem onClick={(e) => handleClickOpenDialog(e, update)}>
        Update
      </MenuItem>
      <MenuItem onClick={(e) => handleClickOpenDialog(e, reset)}>
        Reset
      </MenuItem> */}
      </Menu>
      {renderSetDialog}
      {/* {renderResetDialog}
      {renderUpdateDialog} */}
    </div>
  );
}
