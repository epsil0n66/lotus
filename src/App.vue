<script setup>
import { hexToRgb } from '@layouts/utils'
import { useTheme } from 'vuetify'

const { global } = useTheme()
</script>

<template>
  <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
    <RouterView />
  </VApp>
</template>

<style>
.lotus-h1 {
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
}
.lotus-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
}
.lotus-button1 {
  padding: 10px 24px 10px 24px;
  color: white;
  background-color: #696CFF;
  border-radius: 12px;
}
.lotus-button1:hover {
  background-color: #999bfa;
}
.lotus-button2 {
  padding: 10px 24px 10px 24px;
  color: #696CFF;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #696CFF;
}
.lotus-button3 {
  padding: 12px 16px 12px 16px;
  color: black;
  background-color: white;
  border-radius: 12px;
  border: 1px solid black;
}
.lotus-button4 {
  padding: 2px 14px 3px 14px;
  gap: 8px;
  border-radius: 7px;   
  border: 1px solid #E2261A;
  color: #E2261A;
}
</style>
