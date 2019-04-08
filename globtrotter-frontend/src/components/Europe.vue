<template>
  <div>
    <b-row class="move-left whole-screen">
      <b-col>
        <div class="map-wrapper">
          <europe-map
          :currentCountry="this.currentCountry.alpha2Code"
          >
        </europe-map>
      </div>
      </b-col>

      <b-col class="d-flex flex-column align-items-center">
        <div v-if="answerSubmitted" >
          <Alerts :nameCorrect="nameCorrect" :capitalCorrect="capitalCorrect" :currentCountry="currentCountry" />
        </div>

        <b-form class="w-100 p-3" @submit="onSubmit">
          <b-input v-model="userAnswer.name" placeholder="What country is it?"/>
          <b-input v-model="userAnswer.capital" class="mt-3" placeholder="What is the capital city of this country?"/>
          <b-button class="mt-5" type="submit" variant="primary">{{answerSubmitted ? 'Next' : 'Check my answer'}}</b-button>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios'
import EuropeMap from '@/components/EuropeMap'
import Alerts from '@/components/Alerts'
export default {
  name: 'Europe',
  components: {
    EuropeMap,
    Alerts
  },
  data () {
    return {
      countries: [],
      currentCountry: '',
      userAnswer: {
        name: '',
        capital: ''
      },
      answerSubmitted: false,
      nameCorrect: false,
      capitalCorrect: false
    }
  },
  methods: {
    async fetchCountries () {
      const response = await axios.get('https://restcountries.eu/rest/v2/all')
      this.countries = response.data.filter(country => country.region === 'Europe')
      this.countries = this.countries.filter((el) => !(['AX','IM','FO','GG','GI','JE','SJ','AD','VA','MA','MC','RU','CY','LI','SM','MT'].includes(el.alpha2Code)) )
      this.chooseCountry()
    },
    chooseCountry () {
      this.currentCountry = this.countries[Math.floor(Math.random()*this.countries.length)]
    },
    onSubmit () {
      if (this.answerSubmitted) {
        this.nextRound()
      } else {
        this.nameCorrect = (this.userAnswer.name.toLowerCase() === this.currentCountry.name.toLowerCase()) ? true : false
        this.capitalCorrect = (this.userAnswer.capital.toLowerCase() === this.currentCountry.capital.toLowerCase()) ? true : false
        this.answerSubmitted = true
      }
    },
    nextRound () {
      this.nameCorrect = false
      this.capitalCorrect = false
      this.answerSubmitted = false
      this.userAnswer.name = ''
      this.userAnswer.capital = ''
      this.chooseCountry()
    }
   },
  mounted () {
    this.fetchCountries()
  }
}
</script>

<style scoped>
.whole-screen {
  height: 100vh;
}
.country {
  border: 1px grey solid;
  margin-top: 10px;
}
.map-wrapper {
  width: 1000px;
}
#form {
  height: 100vh;
}
.move-left {
  transform: translateX(-100px);
}
</style>
