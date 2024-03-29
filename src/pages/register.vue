<script setup>
import logo from '@images/logo.svg?raw'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const $api = inject('api')

const form = ref({
  email: null,
  name: null,
  phone: null,
  password: null,
  referral_code: null,
})


const valid = ref(false)
const isLoading = ref(false)
function register () {
  if (!valid.value) return
  isLoading.value = true
  $api.register(form.value)
    .then(() => {
      isLoading.value = false
      localStorage.setItem('registered', 'true')
      router.push('/login')
    })
    .catch(e => {
      console.log(e)
      isLoading.value = false
    })
}
const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div
              class="d-flex text-primary"
              v-html="logo"
            />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          lotus
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Adventure starts here 🚀
        </h5>
      </VCardText>

      <VCardText>
        <VForm
          v-model="valid"
          @submit.prevent="register"
        >
          <VRow>
            <!-- Name -->
            <VCol cols="12">
              <VTextField
                v-model="form.name"
                autofocus
                label="Name"
                :rules="[(v) => !!v || 'Field is required']"
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                :rules="[(v) => !!v || 'Field is required']"
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.phone"
                label="Phone"
                type="phone"
                :rules="[(v) => !!v || 'Field is required']"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.referral_code"
                label="Referral code"
                :rules="[(v) => !!v || 'Field is required']"
              />
            </VCol>
            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                :rules="[(v) => !!v || 'Field is required']"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <button
                class="lotus-button1 mt-6 w-100 text-white"
                type="submit"
                :class="{ 'loading': isLoading }"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="loader"
                />
                <span v-else>Sign up</span>
              </button>
            </VCol>

            <!-- login instead -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Already have an account?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/login"
              >
                Sign in instead
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
