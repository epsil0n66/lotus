<script setup>
import { inject, ref } from 'vue'
import { useDisplay } from 'vuetify'

const $api = inject('api')

const { mobile } = useDisplay()


const earningsHistory = ref([])
const earningsPage = ref(1)
const earningsLastPage = ref(1)
const earningsPageSize = ref(10)
const isNextPage = ref(false)
const isPrevPage = ref(false)

const texts = JSON.parse(localStorage.getItem('texts'))

const getEarnings = page => {
  $api.getEarnings(page)
    .then(res => {
      earningsPage.value = page
      earningsHistory.value = res.data.results
      earningsLastPage.value = Math.ceil(res.data.count / earningsPageSize.value)
      isNextPage.value = res.data.next !== null
      isPrevPage.value = res.data.previous !== null
    })
}

getEarnings(earningsPage.value)
</script>

<template>
  <VCard class="pa-6 my-4">
    <span class="lotus-h1 text-black">{{ texts.find(t => t.key === 'history_of_action')?.text || 'История действий' }}</span>
    <div :style="mobile ? 'overflow-x: auto' : ''">
      <table
        :style="mobile ? 'width: 700px;' : 'width: 100%'"
        class="mt-4"
      >
        <thead>
          <tr>
            <th
              class="text-left lotus-text text-black"
              style="border-bottom: 1px solid #e0e0e0;"
            >
              {{ texts.find(t => t.key === 'action')?.text || 'Действие' }}
            </th>
            <th
              class="text-left lotus-text text-black"
              style="border-bottom: 1px solid #e0e0e0;"
            >
              {{ texts.find(t => t.key === 'type')?.text || 'Тип' }}
            </th>
            <th
              class="text-left lotus-text text-black"
              style="border-bottom: 1px solid #e0e0e0;"
            >
              {{ texts.find(t => t.key === 'amount')?.text || 'Сумма' }}
            </th>
            <th
              class="text-left lotus-text text-black"
              style="border-bottom: 1px solid #e0e0e0;"
            >
              {{ texts.find(t => t.key === 'date_action')?.text || 'Дата' }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in earningsHistory"
            :key="item"
          >
            <td>
              {{ item.description }}
            </td>
            <td>
              {{ item.type }}
            </td>
            <td>
              {{ item.amount }}
            </td>
            <td>
              {{ item.date }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <VDivider />
    <VRow class="mt-4">
      <VCol
        cols="12"
        md="6"
      >
        <button
          class="lotus-button2"
          :disabled="!isPrevPage"
          @click="getEarnings(earningsPage - 1)"
        >
          ← {{ texts.find(t => t.key === 'prev_button')?.text || 'Назад' }}
        </button>
        <button
          class="lotus-button2"
          :disabled="!isNextPage"
          style="margin-left: 12px;"
          @click="getEarnings(earningsPage + 1)"
        >
          {{ texts.find(t => t.key === 'next_button')?.text || 'Вперед' }} →
        </button>
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="d-flex justify-end"
      >
        <span>{{ texts.find(t => t.key === 'page')?.text || 'Стр.' }} 
          <input
            v-model="earningsPage"
            class="page mx-2"
            type="text"
            @keypress.enter="getEarnings(earningsPage)"
          > {{ texts.find(t => t.key === 'from_2')?.text || 'из' }} {{ earningsLastPage }}</span>
      </VCol>
    </VRow>
  </VCard>
</template>

<style scoped>
.page {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding-block: 2px;
  padding-inline: 16px;
}
</style>
