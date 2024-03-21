<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import NumberAnimation from "vue-number-animation"

const $api = inject('api')

const redeemDialog = ref(false)
const redeemSum = ref('')
const redeemWallet = ref('')
const redeemStatus = ref('idle')
const redeemDialogTitle = ref('Вывод средств')

const isAuth = ref(localStorage.getItem('token') !== null)

const logout = () => {
  localStorage.removeItem('token')
  isAuth.value = false
  window.location.reload()
}

const balance = ref(0)

const texts = JSON.parse(localStorage.getItem('texts'))

$api.getBalance()
  .then(res => {
    balance.value = res.data.available_balance
  })

const theFormat = value => {
  return value.toFixed(2)
}

function onInput(event) {
  let value = event.target.value.replace(/[^\d.]/g, '')
  value = value.replace(/(\..*)\./g, '$1')
  redeemSum.value = value
}
function startRedeem() {
  redeemStatus.value = 'pending'
  redeemDialogTitle.value = 'Обработка запроса'
  $api.withdraw({
    amount: redeemSum.value,
    wallet_address: redeemWallet.value,
  }).then(() => {
    redeemStatus.value = 'success'
    redeemDialogTitle.value = 'Перевод одобрен'
    redeemSum.value = ''
  })
}
</script>

<template>
  <VDialog
    v-model="redeemDialog"
    max-width="400"
  >
    <VCard class="pa-8">
      <span class="lotus-h1 text-black mb-4">
        {{ redeemDialogTitle }}
      </span>
      <div v-if="redeemStatus === 'idle'">
        <VTextField
          v-model.number="redeemSum"
          label="Сумма для вывода"
          prefix="$" 
          type="number"
          min="0"
          @input="onInput"
        />
        <VTextField
          v-model="redeemWallet"
          class="mb-4"
          label="Номер кошелька в сети Trc20"
        />
        <div class="d-flex justify-center">
          <button
            class="lotus-button1"
            @click="startRedeem"
          >
            Подтвердить вывод
          </button>
        </div>
      </div>
      <div v-else-if="redeemStatus === 'pending'">
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </div>
      <div v-else-if="redeemStatus === 'success'">
        <span class="lotus-text text-black">
          Ваш запрос на вывод средств одобрен, наш менеджер свяжется с вами в ближайшее время.
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
        <span class="lotus-h1 text-black">Мой баланс к выводу</span>

        <VSpacer />
        <span
          v-if="balance < 100"
          class="lotus-text"
          style="border-radius: 8px; background-color: #FFAB0033; padding: 3px 16px 4px 16px;"
        >Вывод средств доступен от <span
          class="lotus=text"
          style="color: #FFAB00;"
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
          Вывести
        </button>

        <!-- <NavbarThemeSwitcher class="me-2" /> -->

        <!-- <UserProfile /> -->
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Главная',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Финансы',
          icon: 'mdi-wallet',
          to: '/wallet',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Аккаунт',
          icon: 'mdi-account-cog-outline',
          to: '/account-settings',
        }"
      />

      <!-- 👉 Pages -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Pages',
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
          title: 'Logout',
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
