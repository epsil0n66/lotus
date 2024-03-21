<script setup>
import coins from '@images/svg/coins.svg'
import graph from '@images/svg/graph.svg'
import wallet from '@images/svg/wallet.svg'
import { ref } from 'vue'
import NumberAnimation from "vue-number-animation"

const $api = inject('api')

const programmesShown = ref(false)
const endProgramDialog = ref(false)

const programmesInfo = ref([])

const totalBalance = ref(0)
const totalInvested = ref(0)
const totalPrograms = ref(0)
const totalEarned = ref(0)

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
      <span class="lotus-h1 text-black mb-6">
        Программа: Стабильный рост
      </span>
      <span class="lotus-text text-black text-center mb-6">Нажимая кнопку «Завершить» вы останавливаете процесс программы, тем самым останавливая накопления инвестиционного счёта</span>
      <div class="d-flex justify-center">
        <button class="lotus-button2">
          Не завершать
        </button>
        <button
          color="primary"
          class="lotus-button1"
          style="margin-left: 12px;"
          @click="endProgramDialog = false"
        >
          Завершить
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
              <span class="lotus-text">Вложено в: <span @click="showProgrammes">{{ totalPrograms }} программы</span></span>
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
              <span class="lotus-text">Заработано: </span>
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
              <span class="lotus-text">Общий баланс </span>
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
        <span class="lotus-h1 text-black">Мои программы</span>
        <table
          style="width: 100%;"
          class="mt-4"
        >
          <thead>
            <tr>
              <th class="text-left lotus-text text-black">
                Программа
              </th>
              <th class="text-left lotus-text text-black">
                Вложения
              </th>
              <th class="text-left lotus-text text-black">
                Дата инвестиций
              </th>
              <th class="text-left lotus-text text-black">
                Заработано
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
              <td style="color: #00CE2D;">
                {{ programme.earned }} $
              </td>
              <td>
                <button
                  class="lotus-button4"
                  @click="endProgramDialog = true"
                >
                  Завершить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </VCol>
    </VRow>
  </VCard>
</template>

