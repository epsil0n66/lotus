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
  letter-spacing: 0;
  line-height: 24px;

  @media screen and (max-width: 600px) {
    font-size: 16px;
  }
}

.lotus-text {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 17px;
}

.lotus-button1 {
  border-radius: 12px;
  background-color: #696cff;
  color: white;
  padding-block: 10px;
  padding-inline: 24px;
}

.lotus-button1:hover {
  background-color: #999bfa;
}

.lotus-button2 {
  border: 1px solid #696cff;
  border-radius: 12px;
  background-color: white;
  color: #696cff;
  padding-block: 10px;
  padding-inline: 24px;
}

.lotus-button3 {
  border: 1px solid black;
  border-radius: 12px;
  background-color: white;
  color: black;
  padding-block: 12px;
  padding-inline: 16px;
}

.lotus-button4 {
  border: 1px solid #e2261a;
  border-radius: 7px;
  color: #e2261a;
  gap: 8px;
  padding-block: 2px 3px;
  padding-inline: 14px;
}
</style>
