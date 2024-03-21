<script setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'

import { inject } from 'vue'

const $api = inject('api')

$api.getTexts('ru')
  .then(res => {
    const texts = localStorage.getItem('texts')
    if (!texts) {
      localStorage.setItem('texts', JSON.stringify(res.data))
    }
  })
</script>

<template>
  <DefaultLayoutWithVerticalNav>
    <RouterView />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
