import React from "react";

import {
  // ToastContainer,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import OpacityIcon from "@material-ui/icons/Opacity";
import SpeedIcon from "@material-ui/icons/Speed";

import { common } from "../../utils/styles";
import { makeStyles } from "@material-ui/core/styles";
import colors from "../../utils/colors";

import keys from "../../utils/keys";
import io from "socket.io-client";
const client = io(keys.server, {
  transports: ["websocket"],
});

const useStyles = makeStyles((theme) => common(theme));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const lowColor = colors.BLUE[600];
const highColor = colors.RED[600];

const temperatureUnit = " \u00B0C";
const humidityUnit = " %RH";

const styles = {
  selectedButton: {
    color: "white",
    backgroundColor: colors.TEAL[700],
    // width: 130,
  },
  unSelectedButton: {
    color: colors.BLUEGREY[500],
    backgroundColor: colors.BLUEGREY[100],
    // width: 130,
  },
  dialogBoxContainer: {
    backgroundColor: colors.BLUEGREY[100],
    padding: 20,
    minWidth: "30vw",
  },
  dialogBox: {
    backgroundColor: "rgb(0,0,0,0)",
  },
  cardsContainer: {
    // width: "100%",
    height: "80vh",
    margin: 5,
  },
  card: { paddingBottom: 10 },
  cardContentContainer: {
    padding: 5,
  },
  lowStyle: { color: lowColor },
  highStyle: { color: highColor },
  icon: { width: 20 },
};

const temperatureIcon = (
  <SpeedIcon style={{ ...styles.icon, color: colors.BLUEGREY[400] }} />
);
const humidityIcon = (
  <OpacityIcon style={{ ...styles.icon, color: colors.BLUEGREY[400] }} />
);

const lowIcon = (
  <ArrowDownwardIcon style={{ ...styles.icon, color: lowColor }} />
);
const highIcon = (
  <ArrowUpwardIcon style={{ ...styles.icon, color: highColor }} />
);

const lowHumidityMsg = "Low humidity threshold crossed";
const highHumidityMsg = "High humidity threshold crossed";
const lowTemperatureMsg = "Low temperature threshold crossed";
const highTemperatureMsg = "High temperature threshold crossed";

export default function AlertsPopover(props) {
  const classes = useStyles();

  // const {
  //   humidity,
  //   humidityAlerts,
  //   temperature,
  //   temperatureAlerts,
  //   timestamps,
  // } = props.data;

  const [selectedOption, setSelectedOption] = React.useState({
    all: true,
    temperature: false,
    humidity: false,
  });

  const [alertsListState, setAlertsList] = React.useState({});

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDialogButton = (e) => {
    setOpenDialog(!openDialog);
  };

  const handleButtonGroup = (e) => {
    if (e.currentTarget.id === "temperature") {
      setSelectedOption({
        all: false,
        temperature: true,
        humidity: false,
      });
    }
    if (e.currentTarget.id === "humidity") {
      setSelectedOption({
        all: false,
        temperature: false,
        humidity: true,
      });
    }
    if (e.currentTarget.id === "all") {
      setSelectedOption({
        all: true,
        temperature: false,
        humidity: false,
      });
    }
  };

  React.useEffect(() => {
    client.emit("send-data-alert", { _id: props.ID });

    client.on(`data-alert-${props.ID}`, (msg) => {
      try {
        setAlertsList(msg);
      } catch (e) {
        console.log(e);
      }
    });
  }, [props.ID]);

  const alertsListTemp = alertsListState.alerts;
  const alertsListInit =
    alertsListTemp && alertsListTemp instanceof Array ? alertsListTemp : [];

  // console.log(alertsListInit);

  // eslint-disable-next-line
  const alertsList = alertsListInit.map((alert) => {
    const { timestamp, alert_level, alert_type, parameter_value } = alert;

    const dateTime = new Date(timestamp);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString();

    const isHumidityAlert = alert_type === "humidity";
    const isTemperatureALert = alert_type === "temperature";

    const lowHumidity = isHumidityAlert && alert_level === -1;
    const highHumidity = isHumidityAlert && alert_level === 1;
    const lowTemperature = isTemperatureALert && alert_level === -1;
    const highTemperature = isTemperatureALert && alert_level === 1;

    const alertObjInit = {
      dateTime,
      value: parameter_value,
      time: time,
      date: date,
    };

    const lowTemperatureObj = {
      alert: lowTemperatureMsg,
      icon: lowIcon,
      color: lowColor,
      unit: temperatureUnit,
      type: "temperature",
      icon2: temperatureIcon,
      ...alertObjInit,
    };

    const highTemperatureObj = {
      alert: highTemperatureMsg,

      icon: highIcon,
      color: highColor,
      unit: temperatureUnit,
      type: "temperature",
      icon2: temperatureIcon,
      ...alertObjInit,
    };

    const lowHumidityObj = {
      alert: lowHumidityMsg,

      icon: lowIcon,
      color: lowColor,
      unit: humidityUnit,
      type: "humidity",
      icon2: humidityIcon,
      ...alertObjInit,
    };

    const highHumidityObj = {
      alert: highHumidityMsg,
      icon: highIcon,
      color: highColor,
      unit: humidityUnit,
      type: "humidity",
      icon2: humidityIcon,
      ...alertObjInit,
    };

    if (lowHumidity) {
      return lowHumidityObj;
    }
    if (highHumidity) {
      return highHumidityObj;
    }
    if (lowTemperature) {
      return lowTemperatureObj;
    }
    if (highTemperature) {
      return highTemperatureObj;
    }
  });

  // alertsList.reverse(); // sort by newest?
  // let alertsList_OLD = [];
  // timestamps.map((timestamp, i) => {
  //   const dateTime = new Date(timestamp);
  //   const date = dateTime.toLocaleDateString();
  //   const time = dateTime.toLocaleTimeString();

  //   const lowHumidityMsg = "Low humidity threshold crossed";
  //   const highHumidityMsg = "High humidity threshold crossed";
  //   const lowTemperatureMsg = "Low temperature threshold crossed";
  //   const highTemperatureMsg = "High temperature threshold crossed";

  //   const lowHumidity = humidityAlerts[i] === -1;
  //   const highHumidity = humidityAlerts[i] === 1;
  //   const lowTemperature = temperatureAlerts[i] === -1;
  //   const highTemperature = temperatureAlerts[i] === 1;

  //   const isHumidityAlert = lowHumidity || highHumidity;
  //   const isTemperatureALert = lowTemperature || highTemperature;

  //   const isAlert = isHumidityAlert || isTemperatureALert;
  //   const isBothAlert = isHumidityAlert && isTemperatureALert;

  //   const lowTemperatureObj = {
  //     alert: lowTemperatureMsg,
  //     value: temperature[i],
  //     time: time,
  //     date: date,
  //     icon: lowIcon,
  //     color: lowColor,
  //     unit: temperatureUnit,
  //     type: "temperature",
  //     icon2: temperatureIcon,
  //   };

  //   const highTemperatureObj = {
  //     alert: highTemperatureMsg,
  //     value: temperature[i],
  //     time: time,
  //     date: date,
  //     icon: highIcon,
  //     color: highColor,
  //     unit: temperatureUnit,
  //     type: "temperature",
  //     icon2: temperatureIcon,
  //   };

  //   const lowHumidityObj = {
  //     alert: lowHumidityMsg,
  //     value: humidity[i],
  //     time: time,
  //     date: date,
  //     icon: lowIcon,
  //     color: lowColor,
  //     unit: humidityUnit,
  //     type: "humidity",
  //     icon2: humidityIcon,
  //   };

  //   const highHumidityObj = {
  //     alert: highHumidityMsg,
  //     value: humidity[i],
  //     time: time,
  //     date: date,
  //     icon: highIcon,
  //     color: highColor,
  //     unit: humidityUnit,
  //     type: "humidity",
  //     icon2: humidityIcon,
  //   };

  //   if (isAlert) {
  //     if (isBothAlert) {
  //       if (lowTemperature) {
  //         alertsList_OLD.push(lowTemperatureObj);
  //       }
  //       if (highTemperature) {
  //         alertsList_OLD.push(highTemperatureObj);
  //       }
  //       if (lowHumidity) {
  //         alertsList_OLD.push(lowHumidityObj);
  //       }
  //       if (highHumidity) {
  //         alertsList_OLD.push(highHumidityObj);
  //       }
  //     } else {
  //       if (lowHumidity) {
  //         alertsList_OLD.push(lowHumidityObj);
  //       }
  //       if (highHumidity) {
  //         alertsList_OLD.push(highHumidityObj);
  //       }
  //       if (lowTemperature) {
  //         alertsList_OLD.push(lowTemperatureObj);
  //       }
  //       if (highTemperature) {
  //         alertsList_OLD.push(highTemperatureObj);
  //       }
  //     }
  //   } else {
  //     // no alert, do nothing
  //   }

  //   return i;
  // });
  // alertsList_OLD.reverse(); // sort by newest

  const renderButtonGroup = (
    <Grid
      container
      spacing={1}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12} md={4}>
        <Button
          id="all"
          variant="text"
          fullWidth
          onClick={(e) => handleButtonGroup(e)}
          // disableRipple
          style={
            selectedOption.all ? styles.selectedButton : styles.unSelectedButton
          }
        >
          <Typography variant="caption">All</Typography>
        </Button>
      </Grid>
      <Grid item xs={12} md={4}>
        <Button
          id="temperature"
          variant="text"
          fullWidth
          onClick={(e) => handleButtonGroup(e)}
          // disableRipple
          style={
            selectedOption.temperature
              ? styles.selectedButton
              : styles.unSelectedButton
          }
        >
          <Typography variant="caption">{temperatureUnit}</Typography>
        </Button>
      </Grid>
      <Grid item xs={12} md={4}>
        <Button
          variant="text"
          id="humidity"
          fullWidth
          onClick={(e) => handleButtonGroup(e)}
          // disableRipple
          style={
            selectedOption.humidity
              ? styles.selectedButton
              : styles.unSelectedButton
          }
        >
          <Typography variant="caption">{humidityUnit}</Typography>
        </Button>
      </Grid>
    </Grid>
  );

  const renderNoAlerts = (
    <Grid item xs={12} style={styles.card}>
      <Button
        variant="contained"
        style={{ backgroundColor: "white", color: colors.BLUEGREY[500] }}
        fullWidth
      >
        <Typography variant="caption">No Alerts</Typography>
      </Button>
    </Grid>
  );

  const filterBy = (array, filter) => {
    let result = array.map((item, index) =>
      item.type === filter ? (
        <Card item={item} index={index} key={index} />
      ) : null
    );

    if (result.filter((x) => x).length > 0) {
      return result;
    } else {
      return renderNoAlerts;
    }
  };

  const renderAllCards = (
    <Grid container direction="column" justify="center" alignItems="stretch">
      {selectedOption.all
        ? alertsList.length > 0
          ? alertsList.map((item, index) => (
              <Card item={item} index={index} key={index} />
            ))
          : renderNoAlerts
        : null}

      {selectedOption.humidity ? filterBy(alertsList, "humidity") : null}

      {selectedOption.temperature ? filterBy(alertsList, "temperature") : null}
    </Grid>
  );

  // const toastsContainer = !openDialog ? (
  //   <ToastContainer
  //     position="bottom-left"
  //     autoClose={false}
  //     hideProgressBar={true}
  //     newestOnTop={true}
  //     closeOnClick
  //     rtl={false}
  //     pauseOnFocusLoss
  //     draggable
  //     pauseOnHover
  //     enableMultiContainer
  //     containerId={"ContainerDetails"}
  //     limit={1}
  //   />
  // ) : null;

  const notifyLow = (msg) =>
    toast.info(msg, { containerId: "ContainerDetails" });

  const notifyHigh = (msg) =>
    toast.error(msg, { containerId: "ContainerDetails" });

  const toastContent = (value, unit, time) => {
    return (
      <div>
        <div>
          <Typography align="left" variant="button">
            {value}
            {unit}
          </Typography>
        </div>

        <div>
          <Typography variant="caption" align="left">
            {time}
          </Typography>
        </div>
      </div>
    );
  };

  const now = new Date();

  alertsList.map((item) => {
    const { dateTime, value, time, color, unit } = item;

    if (dateTime.getHours() === now.getHours()) {
      if (color === lowColor) {
        notifyLow(toastContent(value, unit, time));
      }
      if (color === highColor) {
        notifyHigh(toastContent(value, unit, time));
      }
    }

    return null;
  });

  return (
    <>
      <Tooltip placement="top" title="Alerts">
        <Button
          className={classes.button}
          variant="contained"
          onClick={(e) => handleDialogButton(e)}
        >
          <Badge badgeContent={alertsListInit.length} color="secondary">
            <NotificationsNoneOutlinedIcon
              className={classes.iconInsideButton}
              style={{ color: colors.TEAL[700] }}
            />
          </Badge>
        </Button>
      </Tooltip>

      {/* {toastsContainer} */}

      <Dialog
        open={openDialog}
        onBackdropClick={(e) => setOpenDialog(false)}
        style={styles.dialogBox}
        scroll="paper"
        TransitionComponent={Transition}
      >
        <DialogTitle>{renderButtonGroup}</DialogTitle>
        <DialogContent dividers={true} style={styles.dialogBoxContainer}>
          <div style={styles.cardsContainer}>{renderAllCards}</div>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="text"
            onClick={(e) => handleDialogButton(e)}
          >
            <Typography variant="body2">Close</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const Card = (props) => {
  const { item, index } = props;

  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <Grid item xs={12} key={index} style={styles.card}>
      <Button
        variant="contained"
        style={{ backgroundColor: "white", textTransform: "none" }}
        fullWidth
        startIcon={item.icon2}
        endIcon={item.icon}
        onClick={(e) => setShowDetails(!showDetails)}
      >
        {showDetails ? (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={styles.cardContentContainer}
          >
            <Grid item xs={12}>
              <Typography
                variant="body1"
                align="left"
                gutterBottom
                style={{ color: colors.BLUEGREY[600] }}
              >
                {item.value}
                {item.unit}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                align="left"
                style={{
                  color: colors.BLUEGREY[400],
                  // fontStretch: "ultra-condensed",
                }}
              >
                {item.time}
                {" - "}
                {item.date}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Tooltip placement="top" title={"Click to expand"}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={styles.cardContentContainer}
            >
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  align="left"
                  style={{ color: colors.BLUEGREY[600] }}
                >
                  {item.alert}
                </Typography>
              </Grid>
            </Grid>
          </Tooltip>
        )}
      </Button>
    </Grid>
  );
};
