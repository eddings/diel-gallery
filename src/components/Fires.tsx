import * as React from "react";

import { diel } from "../setup";
import { DielComponent, TwoDimSelection, MapChart, ChartType, MapBounds, MapRegion, DielComponentProps } from "diel-ui";

enum ComponentRelations {
  fireSpots = "fireSpots",
  fireMapBounds = "fireMapBounds"
}

export default class Fires extends DielComponent<DielComponentProps> {
  constructor(props: DielComponentProps) {
    super(props);
    this.BindDielOutputs(Object.keys(ComponentRelations));
  }

  render() {
    const handler = (box: TwoDimSelection) => {
      diel.NewInput("panFireItx", {
        latMin: box.minY,
        latMax: box.maxY,
        longMin: box.minX,
        longMax: box.maxX
      });
    };

    const deselectHandler = () => {
      diel.NewInput("panFireItx", {
        latMin: null,
        latMax: null,
        longMin: null,
        longMax: null
      });
    };

    const controlLayout = {
      chartHeight: 150,
      chartWidth: 200,
      marginBottom: 20,
      marginRight: 20,
      marginTop: 20,
      marginLeft: 20,
    };
    const mapBounds = this.state[ComponentRelations.fireMapBounds] ? this.state[ComponentRelations.fireMapBounds][0] : null;
    const chartDiv = this.state[ComponentRelations.fireSpots]
      ? <MapChart
          spec={{
            chartType: ChartType.Map,
            dimension: 2,
            relationName: ComponentRelations.fireSpots,
            xAttribute: "LONGITUDE",
            yAttribute: "LATITUDE",
            data: this.state[ComponentRelations.fireSpots],
          }}
          mapBounds={mapBounds as MapBounds}
          mapRegion={MapRegion.US}
        />
      : null;
    const controlChartDiv = <MapChart
        spec={{
          chartType: ChartType.Map,
          dimension: 2,
          relationName: "_",
          xAttribute: "",
          yAttribute: "_",
          data: []
        }}
        layout={controlLayout}
        mapRegion={MapRegion.US}
        brushHandler={handler}
        deselectHandler={deselectHandler}
      />;
    return <>
      <h2>US WildFires</h2>
      <p>
        We sampled the data from <a href="https://www.kaggle.com/rtatman/188-million-us-wildfires/version/1#">a dataset on kaggle</a>
      </p>
      {chartDiv}
      <br/>
      <p>Brush on the following chart to control the view above.</p>
      {controlChartDiv}
    </>;
  }
}
