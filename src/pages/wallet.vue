<script setup>
import EarningsHistory from '@/components/EarningsHistory.vue'
import TotalEarnings from '@/components/TotalEarnings.vue'

const $api = inject('api')

const wallet = ref('')

const qr = ref('')

const verified = ref(false)

const texts = JSON.parse(localStorage.getItem('texts'))
function loadWallet() {
  $api.getWallet()
    .then(res => {
      wallet.value = res.data.address
      qr.value = res.data.qr_code
      verified.value = res.data.verification
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
        <p
          v-if="!verified"
          class="lotus-h1"
          style="color: #c00;"
        >
          {{ texts.find(t => t.key === 'wallet_verification_false')?.text || 'Верификация не пройдена' }}
        </p><p class="lotus-text">
          {{ wallet }}
        </p>
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="d-flex justify-end"
      >
        <div
          style=" border: 1px solid #696cff;border-radius: 12px;"
          v-html="qr"
        />
      </VCol>
    </VRow>
  </VCard>
  <EarningsHistory />
</template>
