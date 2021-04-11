import React from "react";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Grow from "@material-ui/core/Grow";

import DutyCyclePieChart from "./cards/DutyCyclePieChart";

import { makeStyles } from "@material-ui/core/styles";
// import colors from "../../../../utils/colors";
import { common } from "../../../../utils/styles";

const animationDuration = 200;

const useStyles = makeStyles((theme) => common(theme));

export default function PieChartContainer(props) {
  const data = props.dutyCycle;
  const { labels } = props;
  const classes = useStyles();

  return (
    <Tooltip title="Duty Cycle" placement="top">
      <Grid
        container
        alignItems="center"
        justify="center"
        component={Paper}
        className={classes.cardHover}
        style={{ height: "100%" }}
      >
        <Grow
          in={true}
          {...{ timeout: animationDuration + 5 * animationDuration }}
        >
          <Grid item>
            <DutyCyclePieChart data={data} labels={labels} />
          </Grid>
        </Grow>
      </Grid>
    </Tooltip>
  );
}
