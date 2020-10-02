/*
 * Copyright 2017-2018 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Datum } from "plywood";
import * as React from "react";
import { ConcreteSeries } from "../../../../../common/models/series/concrete-series";
import { Stage } from "../../../../../common/models/stage/stage";
import { Nullary } from "../../../../../common/utils/functional/functional";
import { VisMeasureLabel } from "../../../../components/vis-measure-label/vis-measure-label";
import getScale from "../../../../utils/linear-scale/linear-scale";
import { Foreground } from "../foreground/foreground";
import { Interaction } from "../interactions/interaction";
import { BarChartMode } from "../utils/chart-mode";
import { calculateChartStage } from "../utils/layout";
import { xGetter, XScale } from "../utils/x-scale";
import { yExtent } from "../utils/y-extent";
import { Bars } from "./bars";
import "./bars.scss";

interface BarsContainerProps {
  dropHighlight: Nullary<void>;
  acceptHighlight: Nullary<void>;
  interaction?: Interaction;
  series: ConcreteSeries;
  mode: BarChartMode;
  datums: Datum[];
  totals: Datum;
  xScale: XScale;
  stage: Stage;
  scrollLeft: number;
}

const TOTAL_LABEL_OFFSET = 10;

export class BarsContainer extends React.Component<BarsContainerProps> {

  private container = React.createRef<HTMLDivElement>();

  render() {
    const { dropHighlight, acceptHighlight, interaction, mode, stage, scrollLeft, series, totals, datums, xScale } = this.props;
    const hasComparison = mode.hasComparison;
    const chartStage = calculateChartStage(stage);
    const { reference: continuousReference } = mode.continuousSplit;
    const getX = xGetter(continuousReference);
    const extent = yExtent(datums, series, hasComparison);
    const yScale = getScale(extent, chartStage.height);

    return <React.Fragment>
      <div
        ref={this.container}
        className="bar-chart-bars"
        style={stage.getWidthHeight()}>
        <div className="bar-chart-total" style={{ left: scrollLeft + TOTAL_LABEL_OFFSET }}>
          <VisMeasureLabel
            series={series}
            datum={totals}
            showPrevious={hasComparison} />
        </div>
        <Bars
          mode={mode}
          stage={chartStage}
          xScale={xScale}
          getX={getX}
          series={series}
          datums={datums} />
        {interaction && <Foreground
          interaction={interaction}
          container={this.container}
          stage={chartStage}
          dropHighlight={dropHighlight}
          acceptHighlight={acceptHighlight}
          mode={mode}
          xScale={xScale}
          series={series}
          getX={getX}
          yScale={yScale} />}
      </div>
    </React.Fragment>;
  }
}