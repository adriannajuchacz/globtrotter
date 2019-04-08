<template>
  <div>
    <b-alert v-if="nameCorrect && capitalCorrect" show variant="success">
      Correct! {{currentCountry.name}} with capital city in {{currentCountry.capital}}
    </b-alert>
    <b-alert v-else-if="nameCorrect && !capitalCorrect" show variant="warning">
      You were right with {{currentCountry.name}}, but the capital is: {{currentCountry.capital}}
    </b-alert>
    <b-alert v-else-if="!nameCorrect && capitalCorrect" show variant="warning">
      You were right with {{currentCountry.capital}}, but the name of the country is: {{currentCountry.name}}
    </b-alert>
    <b-alert v-else show variant="danger">
      Incorrect! This is {{currentCountry.name}} with capital city in {{currentCountry.capital}}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'Alerts',
  props: ['nameCorrect', 'capitalCorrect', 'currentCountry']
}
</script>

<style lang="css">
</style>
