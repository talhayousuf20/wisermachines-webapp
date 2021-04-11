import React, { useEffect, useState } from "react";

// Utils
import keys from "../../../../utils/keys";
import { isNotEmpty } from "../../../../utils/validation";
import { parseDataFromSSN } from "../../../../utils/parse";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  getMachineDataByIDAction,
  getMachineProfileByIDAction,
} from "../../../../redux/actions/machineMonitoring/machineDetailsActions";
import { common } from "../../../../redux/actions/actionTypes";

// Styling
import { common as styles } from "../../../../utils/styles";
import colors from "../../../../utils/colors";

// MUI
import Grid from "@material-ui/core/Grid";
import HistoryIcon from "@material-ui/icons/History";
import { makeStyles } from "@material-ui/core/Styles";

// Custom Components
import CardsContainer, { CardsContainerRow1 } from "./CardsContainer";
import PieChartContainer from "./PieChartContainer";
import LineChartContainer from "./LineChartContainer";

// Common Components
import BreadcrumbsNav from "../../../common/Breadcrumbs";
import FilterAndSortMenu from "../../../common/FilterAndSortMenu";
import AlertCard from "../../../common/AlertCard";
import Loader from "../../../common/Loader";
import AlertsPopover from "../../../common/Alerts";

// Web-socket
import io from "socket.io-client";
const client = io(keys.server, {
  transports: ["websocket"],
});

const chartColors = {
  machineCurrent: colors.GREEN[500],
  machineState: colors.PURPLE[500],
  machinePower: colors.YELLOW[500],
  temperature: colors.ORANGE[500],
  humidity: colors.BLUE[500],
};

const timeFiltersList = ["Last Hour", "Last 12 Hours", "Last Day"];

const machineStates = ["Off", "Offload", "Onload"];

const useStyles = makeStyles((theme) => styles(theme));

export default function MachineDetails(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { machineID, zoneID } = props.match.params;

  const [timeFilter, settimeFilter] = useState(timeFiltersList[0]);
  const [liveData, setLiveData] = useState(null);
  const [liveDataArr, setLiveDataArr] = useState([]);

  const loading = useSelector((state) => state.machineDetails.machineLoading);
  const timeFilterSelected = useSelector((state) => state.common.timeFilter);
  const storedData = useSelector((state) => state.machineDetails.data);
  const machineProfile = useSelector((state) => state.machineDetails.profile);

  const noData = useSelector(
    (state) => state.machineDetails.noStoredMachineDataResponse
  );

  useEffect(() => {
    getMachineDataByIDAction(dispatch, machineID);
    getMachineProfileByIDAction(dispatch, machineID);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    settimeFilter(timeFilterSelected);
  }, [timeFilterSelected]);

  useEffect(() => {
    if (!keys.showMockData) {
      client.emit("send-data-demo-machine", { _id: machineID });
    }

    if (!keys.showMockData) {
      client.on(`data-demo-machine-${machineID}`, (msg) => {
        try {
          if (isNotEmpty(msg)) {
            setLiveData(msg);

            setLiveDataArr((prevItems) => [...prevItems, msg]);
          }
        } catch (error) {
          setLiveData(null);
          console.log(error);
        }
      });
    } else {
      // Mock live data generator
      //   setInterval(() => {
      //     const msg = liveMachineData();
      //     setLiveData(msg);
      //     setLiveDataArr((prevItems) => [...prevItems, msg]);
      //   }, 5000);
    }
    // eslint-disable-next-line
  }, [machineID]);

  const keys = [
    "humidity",
    "load_current",
    "machine_state_duration",
    "status",
    "temperature",
    "timestamp",
  ];

  // Merge historical and live data
  const allData = JSON.parse(JSON.stringify(storedData));

  // eslint-disable-next-line
  keys.map((key) => {
    try {
      // eslint-disable-next-line
      liveDataArr.map((packet) => {
        allData[key].push(packet[key]);
      });
    } catch (e) {
      console.log(e);
    }
  });

  const debugDataMerger = (enable) => {
    if (enable) {
      try {
        console.log("live data (should increment by 1):", liveDataArr.length);

        console.log(
          "original stored data (should stay the same):",
          storedData[keys[1]].length
        );

        console.log(
          "diff (should be equal to original):",
          allData[keys[1]].length - liveDataArr.length
        );

        console.log(
          "merged data (should increment by 1):",
          allData[keys[1]].length
        );

        console.log(
          "sum (should be equal to merged data):",
          storedData[keys[1]].length + liveDataArr.length
        );

        console.log("");
      } catch (e) {}
    }
  };

  // set to true to log in console
  debugDataMerger(false);

  const parsedMachineData = parseDataFromSSN(
    allData,
    timeFiltersList.indexOf(timeFilter)
  );

  const {
    // Time
    timestamps,
    timestampEnd,
    // timestampStart,
    // timestampStartFilter,

    // Enviroment
    temperature,
    temperatureNow,
    // temperatureMax,
    // temperatureMin,
    humidity,
    // humidityNow,
    // humidityMax,
    // humidityMin,

    // Current
    loadCurrent,
    currentNow,

    // Power
    instantPower,
    unitsConsumed,

    // State
    machineState,
    stateNowDuration,
    stateNow,

    // Utilization
    // utilization,
    // uptime,
    // downtime,
    // operationCount,

    dutyCycle,
  } = parsedMachineData;

  const lastUpdateTimestamp = new Date(timestampEnd).toLocaleTimeString(
    "en-US"
  );

  // ******** Props ********
  const lineChartsProps = {
    machineState: {
      series: machineState,
      timestamps: timestamps,
      name: "State",
      color: chartColors.machineState,
      yLabels: machineStates,
      yMax: 3,
      type: "line",
      step: "center",
    },
    machinePower: {
      series: instantPower,
      timestamps: timestamps,
      name: "Power",
      color: chartColors.machinePower,
    },
    machineCurrent: {
      series: loadCurrent,
      timestamps: timestamps,
      name: "Current",
      color: chartColors.machineCurrent,
    },
    temperature: {
      series: temperature,
      timestamps: timestamps,
      name: "Temperature",
      color: chartColors.temperature,
    },
    humidity: {
      series: humidity,
      timestamps: timestamps,
      name: "Humidity",
      color: chartColors.humidity,
    },
  };

  const navbar = (
    <Grid container justify="space-between" alignItems="center" spacing={2}>
      <Grid item xs={12} md={"auto"}>
        <BreadcrumbsNav list={props.navigationList} />
      </Grid>
      <Grid item xs={12} md={"auto"}>
        <Grid container spacing={1} justify="flex-start" alignItems="center">
          <Grid item>
            <FilterAndSortMenu
              width={100}
              options={timeFiltersList}
              selected={timeFilter}
              type={common.filterByTime}
              icon={
                <HistoryIcon
                  className={classes.iconInsideButton}
                  style={{ color: colors.TEAL[700] }}
                />
              }
            />
          </Grid>
          <Grid item>
            <AlertsPopover ID={zoneID} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderLoading = (
    <Grid container justify="center" alignItems="center" spacing={2}>
      <Grid item xs={12}>
        {navbar}
      </Grid>

      <Loader color={colors.BLUE[600]} />

      <div>
        <AlertCard message={"Your Data is Being Loaded."} />
      </div>
    </Grid>
  );

  const renderLoaded = (
    <Grid container justify="center" alignItems="stretch" spacing={2}>
      <Grid item xs={12}>
        {navbar}
      </Grid>
      <Grid item xs={12}>
        <CardsContainerRow1
          data={{
            liveData,
            lastUpdateTimestamp,
            unitsConsumed,
            timeFilter,
          }}
        />
      </Grid>
      <Grid item md={9} xs={12}>
        <CardsContainer
          data={{
            liveData,
            lastUpdateTimestamp,
            currentNow,
            stateNow,
            stateNowDuration,
            machineStates,
            // unitsConsumed,
            // humidityNow,
            temperatureNow,
            offLoadHours: dutyCycle.offLoadHours,
            onLoadHours: dutyCycle.onLoadHours,
            machineProfile,
            timeFilter,
          }}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <PieChartContainer dutyCycle={dutyCycle} labels={machineStates} />
      </Grid>

      {/* 
      ****** Do need uncomment or delete ******  

      <Grid item xs={12}>
        <CardsWithGaugeContainer
          data={{
            operationCount,
            utilization,
            uptime,
            downtime,
            temperatureNow,
            temperatureMax,
            temperatureMin,
            humidityNow,
            humidityMax,
            humidityMin,
          }}
        />
      </Grid> */}

      <Grid item xs={12}>
        <LineChartContainer lineCharts={lineChartsProps} />
      </Grid>
    </Grid>
  );

  const renderNoData = (
    <Grid container justify="center" alignItems="center" spacing={2}>
      <Grid item xs={12}>
        {navbar}
      </Grid>

      <Grid item>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ height: "70vh" }}
          spacing={4}
        >
          <AlertCard message={"Couldn't find anything"} />
        </Grid>
      </Grid>
    </Grid>
  );

  return loading
    ? renderLoading
    : noData !== null
    ? renderNoData
    : renderLoaded;
}
