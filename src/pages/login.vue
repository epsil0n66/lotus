<script setup>
import logo from '@images/logo.svg?raw'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const $api = inject('api')

const valid = ref(false)
const isLoading = ref(false)

const form = ref({
  email: null,
  password: null,
})

function login () {
  if (!valid.value) return
  isLoading.value = true
  $api.login(form.value)
    .then(() => {
      router.push('/')
    })
    .catch(e => {
      console.log(e)
    })
    .finally(() => {
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
          Welcome to lotus! 👋🏻
        </h5>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm
          v-model="valid"
          @submit.prevent="login(form)"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                autofocus
                placeholder="johndoe@email.com"
                label="Email"
                type="email"
                :rules="[() => !!form.email || 'Field is required']"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :rules="[() => !!form.password || 'Field is required']"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                />

                <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="javascript:void(0)"
                >
                  Forgot Password?
                </RouterLink>
              </div>

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
                <span v-else>Sign in</span>
              </button>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Create an account
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
