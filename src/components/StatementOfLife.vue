<template>
  <v-layout row wrap>
    <v-flex
      v-for="item in items"
      :key="item.name"
      xs12
      sm12
      md12
      lg6
      xl6>
      <v-card>
        <v-card-title><h4>{{ item.name }}</h4></v-card-title>
        <v-card-text class="text-right">
          {{ $t('label.total') }}: {{ getTotal(item) }}
        </v-card-text>
        <v-expansion-panels>
          <v-expansion-panel v-for="subItem in item.subItems" :key="subItem.name">
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col cols="8">
                  {{ subItem.name }}
                </v-col>
                <v-col cols="4">
                  {{ getMinString(subItem.val) }}
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-html="mdToHtml(subItem.description)"></div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { dateFormatMixin } from '../mixins/dateformat'

export default {
  props: [ 'items' ],
  mixins: [dateFormatMixin],
  methods: {
    mdToHtml (text) {
      return this.$sdConverter.makeHtml(text)
    }
  }
}
</script>
