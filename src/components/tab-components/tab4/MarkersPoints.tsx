import React, { useState } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import {
  africaData,
  asiaData,
  europeData,
  northAmericaData,
  oceaniaData,
  southAmericaData,
} from "./data";
import "ag-charts-enterprise";

export const MarkersPoints = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    topology: "https://www.ag-grid.com/example-assets/world-topo.json",
    series: [
      {
        type: "map-shape-background",
        topology: "https://www.ag-grid.com/example-assets/world-topo.json",
      },
      {
        type: "map-marker",
        topology: "https://www.ag-grid.com/example-assets/world-topo.json",
        data: [
          ...europeData,
          ...asiaData,
          ...africaData,
          ...northAmericaData,
          ...southAmericaData,
          ...oceaniaData,
        ],
        title: "Population",
        idKey: "name",
        idName: "Country",
        sizeKey: "pop_est",
        sizeName: "Population Estimate",
        topologyIdKey: "NAME_ENGL",
        size: 5,
        maxSize: 60,
        labelKey: "name",
        showInLegend: false,
      },
    ],
  });

  return <AgCharts options={options} />;
};
