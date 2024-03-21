<script setup>
import { inject, ref } from 'vue'

const $api = inject('api')

const tariffPlans = ref([])

$api.getTariffPlans()
  .then(res => {
    const data = res.data

    data[0].color = '#696CFF'
    data[0].threshold = 2000
    data[1].color = '#00CE2D'
    data[1].threshold = 5000
    data[2].color = '#FFAB00'
    data[2].threshold = 15000
    tariffPlans.value = data
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
        Программа: <span :style="`color: ${currentTariff.color}`">{{ currentTariff.name }}</span>
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
          <span
            class="lotus-h1"
            :style="`color: ${tariffPlan.color}`"
          >{{ tariffPlan.name }}</span>
          <p class="lotus-text text-black">
            Стабильный рост
          </p>
          <p>
            <span class="text-medium-emphasis lotus-text">
              От
            </span>
            <span class="lotus-h1 text-black">{{ tariffPlan.threshold }} $</span>
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
          :style="`color: ${tariffPlan.color} !important`"
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
