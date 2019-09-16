<template>
  <v-card>
    <v-card-title>
      일반 설정
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>위치 저장</v-list-item-title>
            <v-list-item-subtitle>
              활동 기록시 위치정보를 구글캘린더에 같이 저장합니다.
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
}
</script>
