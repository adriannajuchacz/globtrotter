<template>
  <div id="chartdiv"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core"
import * as am4maps from "@amcharts/amcharts4/maps"
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow"
import series_json from '@/json/series.json'
import axios from 'axios'

export default {
  data() {
    return {
      map: null,
      series_json: series_json,
      countries: null
    }
  },
  mounted() {
    // Create map instance
    this.map = am4core.create("chartdiv", am4maps.MapChart)
    // Set map definition
    this.map.geodata = am4geodata_worldLow
    this.map.projection = new am4maps.projections.Miller()
    this.map.mouseWheelBehavior = "none"

    // Create base map polygon series
    let polygonSeries = this.map.series.push(new am4maps.MapPolygonSeries())
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    this.fetchCountries()
  },
  beforeDestroy() {
    if (this.map) {
      this.map.dispose()
    }
  },
  methods: {
    async fetchCountries () {
      const response = await axios.get('https://restcountries.eu/rest/v2/all')
      this.countries = response.data
      this.groupCountries()
    },
    groupCountries() {
      this.series_json.continents.forEach(ct => {
        //select countries from particular continent
        let cont2C = this.countries.filter(cn => (cn.region === ct.name || cn.subregion === ct.name) )
        .map(el => el.alpha2Code)

        //Russia should be in Asia
        if(ct.name == 'Europe') {
          cont2C = cont2C.filter((el) => !(['RU'].includes(el.alpha2Code)))
        } else if (ct.name == 'Asia') {
          cont2C.push("RU")
        }
        this.createSeries(ct.name, cont2C, ct.color, ct.hoverColor);
      });
    },
    createSeries(name, include, color, hoverColor) {
      console.log(hoverColor)
      var series = this.map.series.push(new am4maps.MapPolygonSeries());
      series.name = name;
      series.useGeodata = true;
      series.include = include;
      series.mapPolygons.template.fill = am4core.color(color);
      series.mapPolygons.template.tooltipText = name;
      series.events.on("over", this.over);
      series.events.on("out", this.out);

      var hover = series.mapPolygons.template.states.create("highlight");
      hover.properties.fill = am4core.color(hoverColor);
    },
    over(ev) {
      ev.target.mapPolygons.each(function(polygon) {
      polygon.setState("highlight");
      })
    },
    out(ev) {
      ev.target.mapPolygons.each(function(polygon) {
        polygon.setState("default");
      })
    }
  }
}
</script>
<style scoped>
#chartdiv {
  width: 90vw;
  height: 90vh;
}
</style>