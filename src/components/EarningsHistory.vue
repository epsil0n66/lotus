<script setup>
import { inject, ref } from 'vue'

const $api = inject('api')

const earningsHistory = ref([])

$api.getEarnings()
  .then(res => {
    earningsHistory.value = res.data.results
  })
</script>

<template>
  <VCard class="pa-6 my-4">
    <span class="lotus-h1 text-black">История действий</span>
    <table
      style="width: 100%;"
      class="mt-4"
    >
      <thead>
        <tr>
          <th
            class="text-left lotus-text text-black"
            style="border-bottom: 1px solid #E0E0E0;"
          >
            Действие
          </th>
          <th
            class="text-left lotus-text text-black"
            style="border-bottom: 1px solid #E0E0E0;"
          >
            Тип
          </th>
          <th
            class="text-left lotus-text text-black"
            style="border-bottom: 1px solid #E0E0E0;"
          >
            Сумма
          </th>
          <th
            class="text-left lotus-text text-black"
            style="border-bottom: 1px solid #E0E0E0;"
          >
            Дата
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
    <VDivider />
    <VRow class="mt-4">
      <VCol
        cols="12"
        md="6"
      >
        <button class="lotus-button2">
          ← Назад
        </button>
        <button
          class="lotus-button2"
          style="margin-left: 12px;"
        >
          Вперед →
        </button>
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="d-flex justify-end"
      >
        <span>Стр. <span class="page mx-2"> 1 </span> из 999</span>
      </VCol>
    </VRow>
  </VCard>
</template>

<style scoped>
.page {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 2px 16px 2px 16px;
}
</style>
