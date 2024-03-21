<script setup>
import EarningsHistory from '@/components/EarningsHistory.vue'
import TotalEarnings from '@/components/TotalEarnings.vue'

const $api = inject('api')

const wallet = ref('')

const qr = ref('')
function loadWallet() {
  $api.getWallet()
    .then(res => {
      wallet.value = res.data.address
      qr.value = res.data.qr_code
    })
}
loadWallet()
</script>

<template>
  <TotalEarnings />
  <VCard class="mt-4 pa-6">
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <p class="lotus-h1 text-black">
          Генерация ссылки USDT
        </p>
        <p class="lotus-text">
          Адрес
        </p>
        <p class="lotus-text">
          {{ wallet }}
        </p>
        <span
          class="lotus-text text-primary"
          style="cursor: pointer"
          @click="loadWallet"
        >Обновить</span>
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="d-flex justify-end"
      >
        <div
          style="border-radius: 12px; border: 1px solid #696CFF;"
          v-html="qr"
        />
      </VCol>
    </VRow>
  </VCard>
  <EarningsHistory />
</template>
