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

const tariffOnHover = ref(null)

const valid = ref(false)
const isLoading = ref(false)

const texts = JSON.parse(localStorage.getItem('texts'))

function confirm () {
  if (!valid.value) return

  isLoading.value = true

  const data = {
    tariff_plan: currentTariff.value.id,
    amount: investSum.value,
  }

  $api.subscribeToTariffPlan(data)
    .then(() => {
      isLoading.value = false
      investDialog.value = false
    })
    .catch(e => {
      console.log(e)
      isLoading.value = false
    })
    .finally(() => {
      investDialog.value = false
      investSum.value = null
    })
}
</script>

<template>
  <VDialog
    v-model="tariffOnHover"
    width="400"
  >
    <VRow v-if="tariffOnHover">
      <VCol
        cols="12"
        md="12"
      >
        <VCard class="text-center text-sm-start">
          <VRow no-gutters>
            <VCol cols="12">
              <VBtn
                icon="mdi-close"
                style=" z-index: 1;float: inline-end;"
                variant="text"
                @click="tariffOnHover = false"
              />
              <VCardItem>
                <span class="lotus-h1 text-black">
                  {{ tariffOnHover.name }}
                </span>
              </VCardItem>

              <VCardText>
                <span class="lotus-text text-black">
                  {{ tariffOnHover.description.full_description }}
                </span> 
             
                <br>
              </VCardText>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </VDialog>
  <VDialog
    v-model="investDialog"
    max-width="400"
    @click:outside="investDialog = false"
  >
    <VCard class="pa-8">
      <span class="lotus-h1 text-black">
        Программа: <span :style="`color: ${currentTariff.color}`">{{ currentTariff.name }}</span>
      </span>
      <VForm
        v-model="valid"
        @submit.prevent="confirm"
      >
        <VTextField
          v-model.number="investSum"
          class="my-6"
          autofocus
          label="Сумма инвестиции"
          :placeholder="currentTariff.threshold"
          prefix="$"
          type="number"
          :rules="[(v) => !!v || 'Field is required', (v) => v >= currentTariff.threshold || `Must be greater than ${currentTariff.threshold}`]"
        />
        <button
          class="lotus-button1"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="loader"
          />
          <span v-else>{{ texts.find(t => t.key === 'invest_button')?.text || 'Инвестировать' }}</span>
        </button>
      </VForm>
    </VCard>
  </VDialog>   
  <VRow>
    <VCol
      v-for="tariffPlan in tariffPlans"
      :key="tariffPlan.id"
      cols="12"
      md="4"
      class="cursor-pointer"
      @click="tariffOnHover = tariffPlan"
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
            <span class="text-medium-emphasis lotus-text mr-2">
              {{ texts.find(t => t.key === 'from')?.text || 'От' }}
            </span>
            <span class="lotus-h1 text-black">{{ tariffPlan.threshold }} $</span>
          </p>
          <button
            class="lotus-button3"
            @click.stop="investDialog = true; currentTariff = tariffPlan"
          >
            {{ texts.find(t => t.key === 'invest_button')?.text || 'Инвестировать' }}
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
                  style="font-size: 24px;"
                >{{ Number(tariffPlan.rate).toFixed(0) }}%</span>
                <p class="text-medium-emphasis text-caption mb-0">
                  {{ texts.find(t => t.key === 'yearly')?.text || 'Годовых' }}
                </p>
              </VCol>
            </VRow>
          </template>
        </VProgressCircular>
      </VCard>
    </VCol>
  </VRow>
</template>
