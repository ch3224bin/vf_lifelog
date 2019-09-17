<template>
  <v-card>
    <v-card-title>
      {{ $t('title.defaultSettings') }}
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('label.enableLocationSaving') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ $t('msg.enableLocationSavingHint') }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch v-model="enabledLocationSaving"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  mounted () {
    this.enabledLocationSaving = localStorage.getItem('enabledLocationSaving') === 'true'
  },
  watch: {
    enabledLocationSaving () {
      localStorage.setItem('enabledLocationSaving', this.enabledLocationSaving)
    }
  },
  data () {
    return {
      enabledLocationSaving: false
    }
  }
}
</script>
