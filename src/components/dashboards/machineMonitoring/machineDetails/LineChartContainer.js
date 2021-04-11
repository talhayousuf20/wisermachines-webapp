import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Grow from "@material-ui/core/Grow";

import LineChart from "../../../common/LineChart";

import { makeStyles } from "@material-ui/core/styles";
import colors from "../../../../utils/colors";
import { common } from "../../../../utils/styles";

const animationDuration = 200;

const useStyles = makeStyles((theme) => common(theme));

export default function LineChartContainer(props) {
  const classes = useStyles();
  const {
    machineCurrent,
    machineState,
    machinePower,
    temperature,
    // humidity,
  } = props.lineCharts;

  const [buttonIndex, setButtonIndex] = useState(0);

  const chartsList = [
    machineCurrent,
    machineState,
    machinePower,
    temperature,
    // humidity,
  ];

  const chartNamesList = [
    "Current (A)",
    "State",
    "Power (W)",
    "Temperature (C)",
    // "Humidity (%RH)",
  ];

  const chartButtons = chartsList.map((chart, chartIndex) => {
    const selectedBackground = chart.color;
    const selected = "white";

    const unselectedBackground = colors.BLUEGREY[200];
    const unselected = colors.BLUEGREY[500];

    const color = chartIndex === buttonIndex ? selected : unselected;
    const backgroundColor =
      chartIndex === buttonIndex ? selectedBackground : unselectedBackground;

    return (
      <Grid item lg={2} md={4} sm={6} xs={12} key={chartIndex}>
        <Tooltip title="Switch Between Charts" placement="top">
          <Button
            fullWidth
            style={{ color, backgroundColor, padding: 0 }}
            onClick={(e) => setButtonIndex(chartIndex)}
          >
            <Typography variant="caption" style={{ padding: 3, color: color }}>
              {chartNamesList[chartIndex]}
            </Typography>
          </Button>
        </Tooltip>
      </Grid>
    );
  });

  const chartRenders = chartsList.map((chart, chartIndex) => (
    <LineChart chartData={chart} />
  ));

  return (
    <Grow in={true} {...{ timeout: animationDuration + 5 * animationDuration }}>
      <Grid
        container
        justify="center"
        alignItems="center"
        component={Paper}
        elevation={2}
        className={classes.cardHover}
      >
        <Grid
          item
          xs={12}
          style={{
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 30,
          }}
        >
          <Grid container spacing={1} justify="center" alignItems="center">
            {chartButtons}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {chartRenders[buttonIndex]}
        </Grid>
      </Grid>
    </Grow>
  );
}
