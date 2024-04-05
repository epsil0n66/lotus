<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import router from '@/router'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import NumberAnimation from "vue-number-animation"
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())
const $api = inject('api')

const redeemDialog = ref(false)
const redeemSum = ref('')
const redeemWallet = ref('')
const redeemStatus = ref('idle')
const redeemDialogTitle = ref('Вывод средств')

const valid = ref(false)

const isAuth = ref(localStorage.getItem('token') !== null)

const logout = () => {
  localStorage.removeItem('token')
  isAuth.value = false
  router.push('/login')
}

const texts = ref([])

;(async () => {

  const res = await $api.getTextsAdmin()
  const noTexts = localStorage.getItem('texts') === null

  localStorage.setItem('texts', JSON.stringify(res.data))

  texts.value = JSON.parse(localStorage.getItem('texts'))
  if (noTexts) {
    //refresh window
    window.location.reload()
  }
})()



const balance = ref(0)



$api.getBalance()
  .then(res => {
    balance.value = res.data.available_balance
  })

const interval = setInterval(() => {
  $api.getBalance()
    .then(res => {
      balance.value = res.data.available_balance
    })
}, 60000)


onUnmounted(() => clearInterval(interval))

const theFormat = value => {
  return value.toFixed(2)
}

function onInput(event) {
  let value = event.target.value.replace(/[^\d.]/g, '')
  value = value.replace(/(\..*)\./g, '$1')
  redeemSum.value = value
}
function startRedeem() {
  if (!valid.value) return
  redeemStatus.value = 'pending'
  redeemDialogTitle.value = texts.find(t => t.key === 'request_processing').text
  $api.withdraw({
    amount: redeemSum.value,
    wallet_address: redeemWallet.value,
  }).then(() => {
    redeemStatus.value = 'success'
    redeemDialogTitle.value = texts.find(t => t.key === 'withdraw_accepted').text
    redeemSum.value = ''
    redeemWallet.value = ''
  })
}
</script>

<template>
  <VDialog
    v-model="redeemDialog"
    max-width="400"
  >
    <VCard class="pa-8">
      <VBtn
        icon="mdi-close"
        variant="text"
        class="align-self-end mr-n6 mt-n6"
        @click="redeemDialog = false"
      />
      <span class="lotus-h1 text-black mb-4">
        {{ redeemDialogTitle }}
      </span>
      <div v-if="redeemStatus === 'idle'">
        <VForm
          v-model="valid"
          @submit.prevent="startRedeem"
        >
          <VTextField
            v-model.number="redeemSum"
            label="Сумма для вывода"
            prefix="$" 
            type="number"
            min="0"
            :rules="[(v) => !!v || 'Field is required', (v) => v >= 100 || 'Must be greater than 100']"
            @input="onInput"
          />
          <VTextField
            v-model="redeemWallet"
            class="mb-4"
            :rules="[(v) => !!v || 'Field is required']"
            label="Номер кошелька в сети Trc20"
          />
          <div class="d-flex justify-center">
            <button class="lotus-button1">
              Подтвердить вывод
            </button>
          </div>
        </VForm>
      </div>
      <div v-else-if="redeemStatus === 'pending'">
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </div>
      <div v-else-if="redeemStatus === 'success'">
        <span class="lotus-text text-black">
          {{ texts.find(t => t.key === 'withdraw_accepted_text')?.text }}
        </span>
        <div class="d-flex justify-center mt-6">
          <button
            class="lotus-button1"
            @click="redeemDialog = false; redeemStatus = 'idle'; redeemDialogTitle = 'Вывод средств'"
          >
            ОК
          </button>
        </div>
      </div>
      <div v-else-if="redeemStatus === 'error'">
        <span class="lotus-text">
          Произошла ошибка
        </span>
      </div>
    </VCard>
  </VDialog>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->

        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <span
          v-if="display.mdAndUp"
          class="lotus-h1 text-black"
        >{{ texts.find(t => t.key === 'available_balance')?.text || 'Balance' }}</span>
        <span
          v-else
          class="lotus-h1 text-black"
        >{{ texts.find(t => t.key === 'available_balance')?.text || 'Balance' }}</span>
        <VSpacer />
        <span
          v-if="balance < 100 && display.mdAndUp"
          class="lotus-text"
          style=" padding: 3px 16px 4px;border-radius: 8px; background-color: #ffab0033;"
        >{{ texts.find(t => t.key === 'withdrawals_available')?.text }} <span
          class="lotus=text"
          style="color: #ffab00;"
        >100$</span> </span>
        <VSpacer />

        <span class="mx-3 lotus-h1 text-black">
          <NumberAnimation
            ref="number1"
            :from="100"
            :to="balance"
            :format="theFormat"
            :duration="1"
            autoplay
            easing="linear"
          /> $</span>
        <button
          class="lotus-button1"
          :disabled="balance < 100"
          @click="redeemDialog = true"
        >
          {{ texts.find(t => t.key === 'withdraw_button')?.text || 'Вывести средства' }}
        </button>

        <!-- <NavbarThemeSwitcher class="me-2" /> -->

        <!-- <UserProfile /> -->
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: texts.find(t => t.key === 'menu_1')?.text || 'Главная',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      />
      <VerticalNavLink
        :item="{
          title: texts.find(t => t.key === 'menu_2')?.text || 'Финансы',
          icon: 'mdi-wallet',
          to: '/wallet',
        }"
      />
      <VerticalNavLink
        :item="{
          title: texts.find(t => t.key === 'menu_3')?.text || 'Аккаунт',
          icon: 'mdi-account-cog-outline',
          to: '/account-settings',
        }"
      />

      <!-- 👉 Pages -->
      <VerticalNavSectionTitle
        :item="{
          heading: texts.find(t => t.key === 'logout')?.text || 'Выйти',
        }"
      />
      <VerticalNavLink
        v-if="!isAuth"
        :item="{
          title: 'Login',
          icon: 'bx-log-in',
          to: '/login',
        }"
      />
      <VerticalNavLink
        v-if="!isAuth"
        :item="{
          title: 'Register',
          icon: 'bx-user-plus',
          to: '/register',
        }"
      />
      <VerticalNavLink
        v-if="isAuth"
        :item="{
          title: texts.find(t => t.key === 'logout')?.text || 'Выйти',
          icon: 'bx-error',
        }"
        @click="logout"
      />
    </template>

    <!-- 👉 Pages -->
    <slot />
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
