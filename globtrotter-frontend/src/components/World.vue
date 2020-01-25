<template>
  <div>
    <button type="button" class="btn btn-dark">Dark</button>
    <div id="chartdiv"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core"
import * as am4maps from "@amcharts/amcharts4/maps"
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow"
import data from '@/json/series.json'
import axios from 'axios'

export default {
  data() {
    return {
      data: data,
      map: null,
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

    this.map.events.on("ready", ev => {
      console.log(this.map.series)
    });

    this.fetchCountries()
  },
  methods: {
    async fetchCountries () {
      const response = await axios.get('https://restcountries.eu/rest/v2/all')
      this.countries = response.data
      this.groupCountries()
    },
    groupCountries() {
      this.data.continents.forEach(ct => {
        //select countries from particular continent
        let cont2C = this.countries.filter(cn => (cn.region === ct.name || cn.subregion === ct.name) )
        .map(el => el.alpha2Code)

        //Russia should be in Asia
        cont2C = this.moveRussiaToAsia(cont2C, ct.name)

        //create series for each continent
        this.createSeries(ct.name, cont2C, ct.color, ct.hoverColor, ct.ex);
      });
    },
    createSeries(name, include, color, hoverColor, ex) {
      let series = this.map.series.push(new am4maps.MapPolygonSeries());
      series.name = name;
      series.useGeodata = true;
      series.include = include;

      let polygonTemplate = series.mapPolygons.template;
      polygonTemplate.fill = am4core.color(color);
      polygonTemplate.tooltipText = name;

      //zoom to continent on click
      /*
      polygonTemplate.events.on("hit", function(ev) {
        ev.target.series.chart.zoomToRectangle(ex.north, ex.east, ex.south, ex.west, 1, true);
      })
      */

      polygonTemplate.events.on("hit", function(ev) {
        console.log(ev.target)
        ev.target.fill = am4core.color(color);
        ev.target.series.chart.zoomToMapObject(ev.target);
      })

      // highlight on hover
      series.events.on("over",  ev => {
        ev.target.mapPolygons.each(polygon => {
          polygon.setState("highlight");
        })      
      });

      var hover = polygonTemplate.states.create("highlight");
      hover.properties.fill = am4core.color(hoverColor);

      // default on no hover
      series.events.on("out", ev => {
        ev.target.mapPolygons.each(polygon => {
          polygon.setState("default");
        })      
      });
    },
    moveRussiaToAsia (countries, contName ) {
        if(contName == 'Europe') {
          countries = countries.filter((el) => !(['RU'].includes(el.alpha2Code)))
        } else if (contName == 'Asia') {
          countries.push("RU")
        }
        return countries
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