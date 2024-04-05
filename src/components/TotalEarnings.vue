<script setup>
import coins from '@images/svg/coins.svg'
import graph from '@images/svg/graph.svg'
import wallet from '@images/svg/wallet.svg'
import { ref } from 'vue'
import NumberAnimation from "vue-number-animation"
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const $api = inject('api')

const programmesShown = ref(false)
const endProgramDialog = ref(false)
const endProgramObject = ref({})

const programmesInfo = ref([])

const totalBalance = ref(0)
const totalInvested = ref(0)
const totalPrograms = ref(0)
const totalEarned = ref(0)

const texts = JSON.parse(localStorage.getItem('texts'))

$api.getTotalBalance()
  .then(res => {
    totalBalance.value = res.data.total_balance
  })
$api.getUserInvestments()
  .then(res => {
    totalPrograms.value = res.data.programs_count
    totalInvested.value = res.data.total_invested
    programmesInfo.value.push(...res.data.tariff_plans)
  })

$api.getEarningsSummary()
  .then(res => {
    totalEarned.value = res.data.total_earnings
  })
    
const interval = setInterval(() => {
  $api.getEarningsSummary()
    .then(res => {
      totalEarned.value = res.data.total_earnings
    })
}, 60000)

onUnmounted(() => clearInterval(interval))

function showProgrammes() {
  programmesShown.value = !programmesShown.value
}
</script>

<template>
  <VDialog
    v-model="endProgramDialog"
    max-width="400"
    @click:outside="investDialog = false"
  >
    <VCard class="pa-8">
      <VBtn
        icon="mdi-close"
        variant="text"
        class="align-self-end mr-n6 mt-n6"
        @click="endProgramDialog = false"
      />
      <span class="lotus-h1 text-black mb-6">
        {{ texts.find(t => t.key === 'programm_small')?.text || 'Программа' }}: {{ endProgramObject.tariff_plan_name }}
      </span>
      <span class="lotus-text text-black text-center mb-6">Нажимая кнопку «Завершить» вы останавливаете процесс программы, тем самым останавливая накопления инвестиционного счёта</span>
      <div class="d-flex justify-center">
        <button
          class="lotus-button2"
          @click="endProgramDialog = false"
        >
          Не завершать
        </button>
        <button
          color="primary"
          class="lotus-button1"
          style="margin-left: 12px;"
          @click="endProgramDialog = false"
        >
          {{ texts.find(t => t.key === 'close_invest')?.text || 'Завершить' }}
        </button>
      </div>
    </VCard>
  </VDialog> 
  <VRow>
    <VCol
      cols="12"
      md="4"
    >
      <VCard>
        <VRow no-gutters>
          <VCol cols="12">
            <div class="px-6 py-4">
              <div class="d-flex align-center justify-space-between pb-4">
                <img :src="wallet">
                <span class="lotus-h1 text-black">
                  <NumberAnimation
                    ref="number3"
                    :from="1"
                    :to="totalInvested"
                    :format="value => value.toLocaleString('ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })"
                    :duration="1"
                    autoplay
                    easing="linear"
                  /> $</span>
              </div>
              <span class="lotus-text">{{ texts.find(t => t.key === 'invested_in')?.text || 'Вложено в' }}: <span @click="showProgrammes">{{ totalPrograms }} {{ texts.find(t => t.key === 'programm')?.text || 'программ' }}</span></span>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <VCol>
      <VCard>
        <VRow no-gutters>
          <VCol cols="12">
            <div class="px-6 py-4">
              <div class="d-flex align-center justify-space-between pb-4">
                <img :src="coins">
                <span class="lotus-h1 text-black">
                  <NumberAnimation
                    ref="number2"
                    :from="1"
                    :to="totalEarned"
                    :format="value => value.toLocaleString('ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })"
                    :duration="1"
                    autoplay
                    easing="linear"
                  /> $</span>
              </div>
              <span class="lotus-text">{{ texts.find(t => t.key === 'earned')?.text || 'Заработано' }}: </span>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <VCol>
      <VCard>
        <VRow no-gutters>
          <VCol cols="12">
            <div class="px-6 py-4">
              <div class="d-flex align-center justify-space-between pb-4">
                <img :src="graph">
                <span class="lotus-h1 text-black">
                  <NumberAnimation
                    ref="number2"
                    :from="1"
                    :to="totalBalance"
                    :format="value => value.toLocaleString('ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })"
                    :duration="1"
                    autoplay
                    easing="linear"
                  /> $</span>
              </div>
              <span class="lotus-text">{{ texts.find(t => t.key === 'total_balance')?.text || 'Общий баланс' }} </span>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>

  <VCard
    v-show="programmesShown"
    class="my-5 pa-6"
  >
    <VRow>
      <VCol cols="12">
        <span class="lotus-h1 text-black">{{ texts.find(t => t.key === 'my_programms')?.text || 'Мои программы' }}</span>
        <div :style="mobile ? 'overflow-x: auto' : ''">
          <table
            :style="mobile ? 'width: 700px;' : 'width: 100%'"
            class="mt-4"
          >
            <thead>
              <tr>
                <th class="text-left lotus-text text-black">
                  {{ texts.find(t => t.key === 'programm_small')?.text || 'Программа' }}
                </th>
                <th class="text-left lotus-text text-black">
                  {{ texts.find(t => t.key === 'investings')?.text || 'Вложения' }}
                </th>
                <th class="text-left lotus-text text-black">
                  {{ texts.find(t => t.key === 'investing_day')?.text || 'Дата инвестиций' }}
                </th>
                <th class="text-left lotus-text text-black">
                  {{ texts.find(t => t.key === 'earned')?.text || 'Заработано' }}
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="programme in programmesInfo"
                :key="programme"
              >
                <td>{{ programme.tariff_plan_name }}</td>
                <td class="text-black">
                  {{ programme.amount }} $
                </td>
                <td>{{ programme.date_investment }}</td>
                <td style="color: #00ce2d;">
                  {{ programme.earned }} $
                </td>
                <td>
                  <button
                    class="lotus-button4"
                    @click="endProgramDialog = true; endProgramObject = programme"
                  >
                    {{ texts.find(t => t.key === 'close_invest')?.text || 'Завершить' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>

