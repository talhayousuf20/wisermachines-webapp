import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import PowerOutlinedIcon from "@material-ui/icons/PowerOutlined";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import SpeedIcon from "@material-ui/icons/Speed";
import OpacityIcon from "@material-ui/icons/Opacity";
import UpdateIcon from "@material-ui/icons/Update";
import colors from "../utils/colors";

const getStatusNumber = (value) => {
  switch (value) {
    case "OFF":
      return 0;
    case "IDLE":
      return 1;
    case "ON":
      return 2;
    default:
      return 0;
  }
};

export const parseZoneSummaryData = (data) => {
  console.log(data);
  const iconStyle = {
    width: 30,
  };

  // const example = {
  //   zoneSummary: {
  //     humidity: 0,
  //     temperature: 0,
  //     min_humidity: 0,
  //     max_humidity: 0,
  //     min_temperature: 0,
  //     max_temperature: 0,
  //     total_machines: 0,
  //     // Additions
  //     currently_active_machines: 0,
  //     avg_utilization: 0,
  //     total_units: 0,
  //   },
  // };

  const dateTime = new Date();
  const dateTimeString =
    dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();

  const lastUpdated = {
    icon: <UpdateIcon style={iconStyle} />,
    values: {
      primary: "Last Updated",
      secondary: dateTimeString,
      color: colors.CYAN[700],
    },
  };

  const CurrentlyActiveTotal = 0;
  const CurrentlyActive = 0;
  const statusTotal = {
    icon: <CheckCircleOutlineRoundedIcon style={iconStyle} />,
    values: {
      primary: "Active",
      secondary: CurrentlyActive + "/" + CurrentlyActiveTotal,
      color: colors.BLUE[700],
    },
  };

  const utilization = 0;
  const utilizationAverage = {
    icon: <TrendingUpIcon style={iconStyle} />,
    values: {
      primary: "Utilization",
      secondary: utilization + " %",
      color: colors.GREEN[700],
    },
  };

  const units = 0;
  const unitsTotal = {
    icon: <PowerOutlinedIcon style={iconStyle} />,
    values: {
      primary: "Units",
      secondary: units + " kWh",
      color: colors.INDIGO[700],
    },
  };

  const temperature = 0;
  const TemperatureAverage = {
    icon: <SpeedIcon style={iconStyle} />,
    values: {
      primary: "Temperature",
      secondary: temperature + " \u00B0C",
      color: colors.ORANGE[700],
    },
  };

  const humidity = 0;
  const HumidityAvarage = {
    icon: <OpacityIcon style={iconStyle} />,
    values: {
      primary: "Humidity",
      secondary: humidity + " %RH",
      color: colors.PURPLE[700],
    },
  };

  return [
    lastUpdated,
    statusTotal,
    utilizationAverage,
    unitsTotal,
    TemperatureAverage,
    HumidityAvarage,
  ];
};

const iconStyle = {
  width: 15,
  paddingRight: 3,
};

const getStatusIcon = (valueInt) => {
  switch (valueInt) {
    case 0:
      return <CancelIcon style={iconStyle} />;
    case 1:
      return <PauseCircleFilledIcon style={iconStyle} />;
    case 2:
      return <PlayCircleFilledIcon style={iconStyle} />;
    default:
      return <CancelIcon style={iconStyle} />;
  }
};

export const parseZoneDetailsData = (data) => {
  let defaultData = {
    _id: "",
    machine_name: "",
    state_instant: "",
    state_instant_duration: 0,
    uptime: 0,
    downtime: 0,
    utilization_percent: 0,
    units: 0,
  };

  Object.keys(defaultData).map((key) => {
    if (data[key] !== null || data[key] !== undefined) {
      defaultData = { ...defaultData, [key]: data[key] };
    }
    return key;
  });

  const {
    machine_name,
    _id,
    state_instant,
    state_instant_duration,
    uptime,
    downtime,
    utilization_percent,
    units,
  } = defaultData;

  const name = machine_name;
  const ID = _id;

  const status = () => {
    const statusName = state_instant;
    const statusChange = getStatusNumber(statusName);

    const statusValueMilliSeconds = state_instant_duration * 1000;
    const statusValue = timeDifference(statusValueMilliSeconds, 0);

    const statusIcon = getStatusIcon(statusChange);

    const statusThresholds = {
      high: 1.5,
      low: 1,
    };

    return {
      name: statusName,
      change: statusChange,
      value: statusValue,
      icon: statusIcon,
      thresholds: statusThresholds,
    };
  };

  const maximumTime = 60; // minutes

  const info1 = () => {
    const info1Name = "Uptime";
    const info1Change = uptime / 60; //seconds into minutes
    const info1Value = timeDifference(uptime * 1000, 0);
    const info1Icon = <ArrowUpwardIcon style={iconStyle} />;

    const info1Thresholds = {
      high: maximumTime * 66,
      low: maximumTime * 33,
    };

    return {
      name: info1Name,
      change: info1Change,
      value: info1Value,
      icon: info1Icon,
      thresholds: info1Thresholds,
    };
  };

  const info2 = () => {
    const info2Name = "Downtime";
    const info2Change = downtime / 60;
    const info2Value = timeDifference(downtime * 1000, 0);
    const info2Icon = <ArrowDownwardIcon style={iconStyle} />;

    const info2Thresholds = {
      high: maximumTime * 66,
      low: maximumTime * 33,
    };

    return {
      name: info2Name,
      change: info2Change,
      value: info2Value,
      icon: info2Icon,
      thresholds: info2Thresholds,
    };
  };

  const gaugeItem1 = () => {
    const gaugeItem1Name = "Utilization";
    const gaugeItem1Value = utilization_percent;
    const gaugeItem1Suffix = "%";
    const gaugeItem1Icon = <TrendingUpIcon style={iconStyle} />;
    const gaugeItem1Thresholds = { high: 66, low: 33 };

    return {
      name: gaugeItem1Name,
      value: gaugeItem1Value,
      suffix: gaugeItem1Suffix,
      thresholds: gaugeItem1Thresholds,
      icon: gaugeItem1Icon,
      yMax: 100,
    };
  };

  const gaugeItem2 = () => {
    const gaugeItem2Name = "Units";
    const gaugeItem2Value = units;
    const gaugeItem2Suffix = "KWh";
    const gaugeItem2Icon = <PowerOutlinedIcon style={iconStyle} />;
    const gaugeItem2Thresholds = { high: 66, low: 33 };

    return {
      name: gaugeItem2Name,
      value: gaugeItem2Value,
      suffix: gaugeItem2Suffix,
      thresholds: gaugeItem2Thresholds,
      icon: gaugeItem2Icon,
      yMax: 100,
    };
  };

  return {
    name,
    ID,
    mapping: true,
    status: status(),
    info1: info1(),
    info2: info2(),
    gaugeItem1: gaugeItem1(),
    gaugeItem2: gaugeItem2(),
  };
};

export const parseEnviromentDataFromSSN_OLD = (data) => {
  const packets = data instanceof Array && data.length > 0 ? data : null;

  // Time
  let timestamps = [];
  let timestampEnd = 0;
  let timestampStart = 0;

  // Temperature
  let temperature = [];
  let temperatureNow = 0;
  let temperatureMax = 0;
  let temperatureMin = 0;
  let temperatureAlerts = [];
  let temperatureAlertNow = 0;

  // Humidity
  let humidity = [];
  let humidityNow = 0;
  let humidityMax = 0;
  let humidityMin = 0;
  let humidityAlerts = [];
  let humidityAlertNow = 0;

  if (packets) {
    try {
      const latest = packets.slice(-1)[0];

      // Time
      timestamps = packets.map((packet) => Date.parse(packet.timestamp));
      timestampStart = timestamps[0];
      timestampEnd = timestamps.slice(-1)[0];

      // Temperature
      temperature = packets.map((packet) => {
        return packet.temperature;
      });

      temperatureAlerts = packets.map((packet) => {
        return packet.temperature_alert;
      });

      temperatureNow = latest.temperature;
      temperatureAlertNow = latest.temperature_alert;
      temperatureMax = Math.max(...temperature);
      temperatureMin = Math.min(...temperature);

      // Humidity
      humidity = packets.map((packet) => {
        return packet.humidity;
      });

      humidityAlerts = packets.map((packet) => {
        return packet.humidity_alert;
      });

      humidityNow = latest.humidity;
      humidityAlertNow = latest.humidity_alert;
      humidityMax = Math.max(...humidity);
      humidityMin = Math.min(...humidity);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    // Time
    timestamps,
    timestampEnd,
    timestampStart,

    // Temperature
    temperature,
    temperatureAlerts,
    temperatureNow,
    temperatureMax,
    temperatureMin,
    temperatureAlertNow,

    // Humidity
    humidity,
    humidityAlerts,
    humidityNow,
    humidityMax,
    humidityMin,
    humidityAlertNow,
  };
};

export const parseEnviromentDataFromSSN = (data) => {
  // Time
  let timestamps = [];
  let timestampEnd = 0;
  let timestampStart = 0;

  // Temperature
  let temperature = [];
  let temperatureNow = 0;
  let temperatureMax = 0;
  let temperatureMin = 0;
  let temperatureAlerts = [];
  let temperatureAlertNow = 0;

  // Humidity
  let humidity = [];
  let humidityNow = 0;
  let humidityMax = 0;
  let humidityMin = 0;
  let humidityAlerts = [];
  let humidityAlertNow = 0;

  if (data) {
    try {
      // Time
      timestamps = data.timestamp.map((timestampStr) =>
        Date.parse(timestampStr)
      );
      timestampStart = timestamps[0];
      timestampEnd = timestamps.slice(-1)[0];

      // Temperature
      temperature = data.temperature;
      temperatureMax = Math.max(...temperature);
      temperatureMin = Math.min(...temperature);

      temperatureAlerts = data.temperature_alert;
      temperatureNow = temperature.slice(-1)[0];
      temperatureAlertNow = temperatureAlerts.slice(-1)[0];

      // Humidity
      humidity = data.humidity;
      humidityMax = Math.max(...humidity);
      humidityMin = Math.min(...humidity);

      humidityAlerts = data.humidity_alert;
      humidityNow = humidity.slice(-1)[0];
      humidityAlertNow = humidityAlerts.slice(-1)[0];
    } catch (error) {
      console.log(error);
    }
  }

  return {
    // Time
    timestamps,
    timestampEnd,
    timestampStart,

    // Temperature
    temperature,
    temperatureAlerts,
    temperatureNow,
    temperatureMax,
    temperatureMin,
    temperatureAlertNow,

    // Humidity
    humidity,
    humidityAlerts,
    humidityNow,
    humidityMax,
    humidityMin,
    humidityAlertNow,
  };
};

export const parseDataFromSSN_OLD = (data, timeFilterIndex) => {
  const numOfHours =
    timeFilterIndex === 0
      ? 1
      : timeFilterIndex === 1
      ? 12
      : timeFilterIndex === 2
      ? 24
      : 1;

  const packets = data instanceof Array && data.length > 0 ? data : null;

  // Time
  let timestamps = [];
  let timestampEnd = 0;
  let timestampStart = 0;
  let timestampStartFilter = 0;

  // Enviroment
  let temperature = [];
  let temperatureNow = 0;
  let temperatureMax = 0;
  let temperatureMin = 0;
  let humidity = [];
  let humidityNow = 0;
  let humidityMax = 0;
  let humidityMin = 0;

  // Current
  let loadCurrent = [];
  let currentNow = 0;

  // Power
  let instantPower = [];
  let unitsConsumed = 0;

  //State
  let machineStateStr = [];
  let machineState = [];
  let stateNowDuration = "Unknown";
  let stateNow = "Unknown";

  // Utilization
  let utilization = 0;
  let uptime = "Unknown";
  let downtime = "Unknown";
  let operationCount = 0; // no of times state went from ON to OFF/IDLE

  // Duty Cycle
  let onLoadHours = 0;
  let offLoadHours = 0;
  let shutdownHours = 0;

  if (packets) {
    try {
      const latest = packets.slice(-1)[0];

      // Time
      timestamps = packets.map((packet) => Date.parse(packet.timestamp));
      timestampStart = timestamps[0];
      timestampEnd = timestamps.slice(-1)[0];
      timestampStartFilter = subtractHours(numOfHours, timestampEnd);

      const NumberOfPacketsFilteredByTime = timestamps.map((timestamp) => {
        if (timestamp > timestampStartFilter) {
          return timestamp;
        } else {
          return null;
        }
      });
      const timeFilter = NumberOfPacketsFilteredByTime.filter((x) => x).length;

      // Environment
      temperature = packets.map((packet) => {
        return packet.temperature;
      });
      const temperatureInGivenInterval = temperature.slice(-timeFilter);
      temperatureNow = latest.temperature;
      temperatureMax = Math.max(...temperatureInGivenInterval);
      temperatureMin = Math.min(...temperatureInGivenInterval);

      humidity = packets.map((packet) => {
        return packet.humidity;
      });
      const humidityInGivenInterval = humidity.slice(-timeFilter);
      humidityNow = latest.humidity;
      humidityMax = Math.max(...humidityInGivenInterval);
      humidityMin = Math.min(...humidityInGivenInterval);

      // Load Current
      loadCurrent = packets.map((packet) => {
        return packet.load_current;
      });
      currentNow = latest.load_current;

      //Power
      instantPower = loadCurrent.map((current) => {
        return 1.732 * 0.95 * 400 * current;
      });
      const powerInGivenInterval = instantPower.slice(-timeFilter);
      unitsConsumed = Math.round(
        (arrayAverage(powerInGivenInterval) / 1000) * numOfHours
      );

      // State
      machineStateStr = packets.map((packet) => {
        return packet.status;
      });
      machineState = machineStateStr.map((state) => {
        if (state === "OFF") {
          return 0;
        } else if (state === "IDLE") {
          return 1;
        } else if (state === "ON") {
          return 2;
        } else return 0;
      });
      stateNow = latest.status;
      stateNowDuration = timeDifference(
        latest.machine_state_duration * 1000,
        0
      );
      const statesInGivenInterval = machineState.slice(-timeFilter);

      // Utilization
      const interval = 5;
      let onCount = 0;
      let idleCount = 0;
      let offCount = 0;

      statesInGivenInterval.map((state, i) => {
        if (state === 2) {
          if (
            statesInGivenInterval[i + 1] === 1 ||
            statesInGivenInterval[i + 1] === 0
          )
            operationCount++;

          onCount++;
        } else if (state === 1) idleCount++;
        else if (state === 0) offCount++;

        return i;
      });
      utilization = Math.round((onCount / statesInGivenInterval.length) * 100);

      const minutesFromCount = (count) => {
        return Math.round((count * interval) / 60);
      };

      uptime = minutesToHours(minutesFromCount(onCount));
      downtime = minutesToHours(minutesFromCount(idleCount + offCount));

      //Duty Cycle
      const trimHours = (value) => parseFloat(value.toFixed(2));
      onLoadHours = trimHours(minutesFromCount(onCount) / 60);
      offLoadHours = trimHours(minutesFromCount(idleCount) / 60);
      shutdownHours = trimHours(minutesFromCount(offCount) / 60);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    // Time
    timestamps,
    timestampEnd,
    timestampStart,
    timestampStartFilter,

    // Enviroment
    temperature,
    temperatureNow,
    temperatureMax,
    temperatureMin,
    humidity,
    humidityNow,
    humidityMax,
    humidityMin,

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
    utilization,
    uptime,
    downtime,
    operationCount,

    //Duty Cycle
    dutyCycle: { shutdownHours, offLoadHours, onLoadHours },
  };
};

export const parseDataFromSSN = (data, timeFilterIndex) => {
  const numOfHours =
    timeFilterIndex === 0
      ? 1
      : timeFilterIndex === 1
      ? 12
      : timeFilterIndex === 2
      ? 24
      : 1;

  // Time
  let timestamps = [];
  let timestampEnd = 0;
  let timestampStart = 0;
  let timestampStartFilter = 0;

  // Enviroment
  let temperature = [];
  let temperatureNow = 0;
  let temperatureMax = 0;
  let temperatureMin = 0;
  let humidity = [];
  let humidityNow = 0;
  let humidityMax = 0;
  let humidityMin = 0;

  // Current
  let loadCurrent = [];
  let currentNow = 0;

  // Power
  let instantPower = [];
  let unitsConsumed = 0;

  //State
  let machineStateStr = [];
  let machineState = [];
  let stateNowDuration = "Unknown";
  let stateNow = "Unknown";

  // Utilization
  let utilization = 0;
  let uptime = "Unknown";
  let downtime = "Unknown";
  let operationCount = 0; // no of times state went from ON to OFF/IDLE

  // Duty Cycle
  let onLoadHours = 0;
  let offLoadHours = 0;
  let shutdownHours = 0;

  if (data) {
    try {
      // Time
      timestamps = data.timestamp.map((timestampStr) =>
        Date.parse(timestampStr)
      );
      timestampStart = timestamps[0];
      timestampEnd = timestamps.slice(-1)[0];
      timestampStartFilter = subtractHours(numOfHours, timestampEnd);

      const NumberOfPacketsFilteredByTime = timestamps.map((timestamp) => {
        if (timestamp > timestampStartFilter) {
          return timestamp;
        } else {
          return null;
        }
      });

      const timeFilter = NumberOfPacketsFilteredByTime.filter((x) => x).length;

      // Environment
      temperature = data.temperature;
      const temperatureInGivenInterval = temperature.slice(-timeFilter);
      temperatureNow = temperature.slice(-1)[0];
      temperatureMax = Math.max(...temperatureInGivenInterval);
      temperatureMin = Math.min(...temperatureInGivenInterval);

      humidity = data.humidity;
      const humidityInGivenInterval = humidity.slice(-timeFilter);
      humidityNow = humidity.slice(-1)[0];
      humidityMax = Math.max(...humidityInGivenInterval);
      humidityMin = Math.min(...humidityInGivenInterval);

      // Load Current
      loadCurrent = data.load_current;
      currentNow = loadCurrent.slice(-1)[0];

      //Power
      instantPower = loadCurrent.map((current) => {
        return 1.732 * 0.95 * 400 * current;
      });
      const powerInGivenInterval = instantPower.slice(-timeFilter);
      unitsConsumed = Math.round(
        (arrayAverage(powerInGivenInterval) / 1000) * numOfHours
      );

      // State
      machineStateStr = data.status;
      machineState = machineStateStr.map((state) => {
        if (state === "OFF") {
          return 0;
        } else if (state === "IDLE") {
          return 1;
        } else if (state === "ON") {
          return 2;
        } else return 0;
      });

      const machineStates = ["Off", "Offload", "Onload"];

      const renameState = (state) => {
        if (state === "OFF") {
          return machineStates[0];
        } else if (state === "IDLE") {
          return machineStates[1];
        } else if (state === "ON") {
          return machineStates[2];
        } else return "Unknown";
      };

      stateNow = renameState(machineStateStr.slice(-1)[0]);
      stateNowDuration = timeDifference(
        data.machine_state_duration.slice(-1)[0] * 1000,
        0
      );
      const statesInGivenInterval = machineState.slice(-timeFilter);

      // Utilization
      const interval = 5;
      let onCount = 0;
      let idleCount = 0;
      let offCount = 0;

      statesInGivenInterval.map((state, i) => {
        if (state === 2) {
          if (
            statesInGivenInterval[i + 1] === 1 ||
            statesInGivenInterval[i + 1] === 0
          )
            operationCount++;

          onCount++;
        } else if (state === 1) idleCount++;
        else if (state === 0) offCount++;

        return i;
      });
      utilization = Math.round((onCount / statesInGivenInterval.length) * 100);

      const minutesFromCount = (count) => {
        return Math.round((count * interval) / 60);
      };

      uptime = minutesToHours(minutesFromCount(onCount));
      downtime = minutesToHours(minutesFromCount(idleCount + offCount));

      //Duty Cycle
      const trimHours = (value) => parseFloat(value.toFixed(2));
      onLoadHours = trimHours(minutesFromCount(onCount) / 60);
      offLoadHours = trimHours(minutesFromCount(idleCount) / 60);
      shutdownHours = trimHours(minutesFromCount(offCount) / 60);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    // Time
    timestamps,
    timestampEnd,
    timestampStart,
    timestampStartFilter,

    // Enviroment
    temperature,
    temperatureNow,
    temperatureMax,
    temperatureMin,
    humidity,
    humidityNow,
    humidityMax,
    humidityMin,

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
    utilization,
    uptime,
    downtime,
    operationCount,

    //Duty Cycle
    dutyCycle: { shutdownHours, offLoadHours, onLoadHours },
  };
};

const minutesToHours = (minutes) => {
  if (minutes <= 60) {
    return `00:${pad(minutes, 2)}`;
  } else {
    const hh = Math.floor(minutes / 60);
    const mm = minutes - hh * 60;
    return `${pad(hh, 2)}:${pad(mm, 2)}`;
  }
};

const pad = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

export const arrayAverage = (arr) => {
  try {
    const average = arr.reduce((sume, el) => sume + el, 0) / arr.length;
    return average;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const timeDifference = (date1, date2) => {
  let difference = date1 - date2;

  let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  let minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  let secondsDifference = Math.floor(difference / 1000);

  let days = daysDifference > 0 ? daysDifference + "d " : "";
  let hours = hoursDifference > 0 ? hoursDifference + "h " : "";
  let minutes = minutesDifference > 0 ? minutesDifference + "m " : "";
  let seconds = secondsDifference > 0 ? secondsDifference + "s" : "";

  let result = String(days + hours + minutes + seconds);

  if (result.length === 0) {
    result = "0s";
  }

  return result;
};

const subtractHours = (h, reference) => {
  const referenceDateObj = new Date(reference);
  return referenceDateObj.getTime() - h * 60 * 60 * 1000;
};
