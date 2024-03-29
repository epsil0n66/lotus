<script setup>
import InvestGraphs from '@/components/InvestGraphs.vue'
import TotalEarnings from '@/components/TotalEarnings.vue'

const $api = inject('api')
const user = ref({})
const texts = JSON.parse(localStorage.getItem('texts'))

$api.getUser()
  .then(res => {
    user.value = res.data
  })
</script>

<template>
  <VRow>
    <!-- 👉 Приветствие -->

    <VCol
      cols="12"
      md="12"
    >
      <VCard class="text-center text-sm-start">
        <VRow no-gutters>
          <VCol
            cols="12"
            sm="8"
            order="2"
            order-sm="1"
          >
            <VCardItem>
              <span
                v-if="texts"
                class="lotus-h1 text-black"
              >
                {{ texts.find(t => t.key === 'welcome').text }}, {{ user.name }}
              </span>
            </VCardItem>

            <VCardText>
              <span class="lotus-text text-black">
                Управление вашими финансами и вложениями в удобном формате
              </span>
              <br>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>
  <!-- 👉 Плитки с информацией о балансе -->
  <TotalEarnings />

  <!-- 👉 Графики доходности -->
  <InvestGraphs />
</template>
