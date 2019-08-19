<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12 xl12>
        <div ref="content">
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import showdown from 'showdown'
import aboutText from './About.md'

const converter = new showdown.Converter()

export default {
  mounted () {
    this.$refs.content.innerHTML = converter.makeHtml(aboutText)
  }
}
</script>
