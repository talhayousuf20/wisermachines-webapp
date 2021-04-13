import React from "react";

import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import DashboardSummaryCard, {
  DashboardSummaryCardListViewVersion,
} from "../../../common/DashboardSummaryCard";
import Card from "../../../common/Card";
import Grow from "@material-ui/core/Grow";

import {
  parseZoneDetailsData,
  // parseZoneSummaryData,
} from "../../../../utils/parse";

import {
  status,
  info1,
  info2,
  gaugeItem1,
  gaugeItem2,
} from "../../../../data/machineSummaryCard";
import { summaryHeader } from "../../../../data/summaryHeader";

import keys from "../../../../utils/keys";

const animationDuration = 200;

export default function MachineCards(props) {
  // const zoneSummary = useSelector((state) => state.machines.zoneSummary);

  const unfilteredList = props.allMachinesInAZone;
  const mapping = useSelector((state) => state.nodes.allNodesInAZone);

  let listOfMachineIDs = [];
  Object.values(mapping).map((node, i) => {
    node.map((machine, j) => {
      listOfMachineIDs.push(machine._id);
      return j;
    });
    return i;
  });

  let filteredList = [];
  listOfMachineIDs.map((item) => {
    for (let i = 0; i < unfilteredList.length; i++) {
      if (unfilteredList[i]._id === item) {
        filteredList.push(unfilteredList[i]);
        break;
      }
    }
    return item;
  });

  // const renderCards = (item) =>
  //   keys.minimalMachineSummaryCards ? (
  //     <DashboardSummaryCardListViewVersion
  //       data={{ name: item.name, ID: item._id }}
  //     />
  //   ) : (
  //     <DashboardSummaryCard
  //       compact={props.compact}
  //       data={parseZoneDetailsData(item)}
  //     />
  //   );

  return (
    <Grid container spacing={2}>
      {
        keys.showMockData ? (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {summaryHeader().map((item, index) => {
                return (
                  <Grow
                    key={index}
                    in={true}
                    {...{
                      timeout: animationDuration + index * animationDuration,
                    }}
                  >
                    <Grid item key={index} lg={2} md={4} sm={6} xs={12}>
                      <Card data={item} />
                    </Grid>
                  </Grow>
                );
              })}
            </Grid>
          </Grid>
        ) : null
        // <Grid item xs={12}>
        //   <Grid container spacing={2}>
        //     {parseZoneSummaryData(zoneSummary).map((item, index) => {
        //       return (
        //         <Grow
        //           key={index}
        //           in={true}
        //           {...{
        //             timeout: animationDuration + index * animationDuration,
        //           }}
        //         >
        //           <Grid item key={index} lg={2} md={4} sm={6} xs={12}>
        //             <Card data={item} />
        //           </Grid>
        //         </Grow>
        //       );
        //     })}
        //   </Grid>
        // </Grid>
      }
      <Grid item xs={12}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          {filteredList.map((item, index) => (
            <Grow
              key={index}
              in={true}
              {...{ timeout: animationDuration + index * animationDuration }}
            >
              <Grid key={index} item md={3} sm={6} xs={12}>
                <DashboardSummaryCard
                  compact={props.compact}
                  data={{
                    name: item.name,
                    ID: item._id,
                    mapping: true,
                    status: status(),
                    info1: info1(),
                    info2: info2(),
                    gaugeItem1: gaugeItem1(),
                    gaugeItem2: gaugeItem2(),
                  }}
                />
              </Grid>
            </Grow>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
