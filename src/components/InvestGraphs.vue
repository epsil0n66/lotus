<script setup>
import { inject, ref } from 'vue'

const $api = inject('api')

const tariffPlans = ref([])

$api.getTariffPlans()
  .then(res => {
    tariffPlans.value = res.data
  })

const currentTariff = ref({})
const investDialog = ref(false)

const investSum = ref(null)

function confirm () {
  investDialog.value = false

  const data = {
    tariff_plan: currentTariff.value.id,
    amount: investSum.value,
  }

  $api.subscribeToTariffPlan(data)
    .then(res => {
      console.log(res)
    })
}
</script>

<template>
  <VDialog
    v-model="investDialog"
    max-width="600"
    @click:outside="investDialog = false"
  >
    <VCard class="pa-8">
      <span class="lotus-h1 text-black">
        Программа: {{ currentTariff.name }} 
      </span>
      <VTextField
        v-model.number="investSum"
        class="pb-4"
        autofocus
        label="Сумма инвестиции"
        placeholder="2000"
        prefix="$"
        type="number"
      />
      <button
        class="lotus-button1"
        @click="confirm"
      >
        Инвестировать
      </button>
    </VCard>
  </VDialog>   
  <VRow>
    <VCol
      v-for="tariffPlan in tariffPlans"
      :key="tariffPlan.id"
      cols="12"
      md="4"
    >
      <VCard class="px-6 py-4 d-flex flex-row">
        <div>
          <span class="lotus-h1 text-black">{{ tariffPlan.name }}</span>
          <p class="lotus-text text-black">
            Стабильный рост
          </p>
          <p>
            <span class="text-medium-emphasis lotus-text">
              От
            </span>
            <span class="lotus-h1 text-black">2000 $</span>
          </p>
          <button
            class="lotus-button3"
            @click="investDialog = true; currentTariff = tariffPlan"
          >
            Инвестировать
          </button>
        </div>
        <VSpacer />
        <VProgressCircular
          model-value="100"
          :rotate="360"
          :size="150"
          :width="10"
          color="primary"
        >
          <template #default>
            <VRow>
              <VCol
                cols="12"
                class="text-center"
              >
                <span
                  class="lotus-h1"
                  style="font-size: 24px"
                >{{ Number(tariffPlan.rate).toFixed(0) }}%</span>
                <p class="text-medium-emphasis text-caption mb-0">
                  Годовых
                </p>
              </VCol>
            </VRow>
          </template>
        </VProgressCircular>
      </VCard>
    </VCol>
  </VRow>
</template>
