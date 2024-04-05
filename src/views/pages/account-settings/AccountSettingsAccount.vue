<script setup>
import copyIcon from '@images/icons/copy.svg'
import fileload from '@images/icons/fileload.svg'
import verifiedIcon from '@images/icons/verified.svg'

const $api = inject('api')

const texts = JSON.parse(localStorage.getItem('texts'))

const accountData = ref({
  first_name: '',
  last_name: '',
  verified: false,
  phone: '',
  date_of_birth: '',
  country: '',
})

$api.getVerificationStatus()
  .then(res => {
    accountData.value = { ...res.data }
  })

const referralCode = ref('')

$api.getReferralCode()
  .then(res => {
    referralCode.value = res.data.referral_code
  })

$api.getUser()

$api.getCountries()
  .then(res => {
    console.log(res.data.results)
    countries.value = res.data.results
  })
  

function copyReferralCode () {
  navigator.clipboard.writeText(referralCode.value)
}
const verificationDialog = ref(false)

const countries = ref([])

const images = reactive({
  first: null,
  second: null,
  third: null,
})

const handleDrop = (zone, event) => {
  const files = event.dataTransfer.files
  if (files.length) {
    const file = files[0] // Only consider the first file
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onload = e => {
        images[zone] = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}

const fileInput = ref(null)

const openFileUpload = zone => {
  if (zone === 'first') {
    fileInput.value[0].click()
  } else if (zone === 'second') {
    fileInput.value[1].click()
  } else {
    fileInput.value[2].click()
  }
  
}

const uploadFile = (zone, event) => {
  const file = event.target.files[0]
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()

    reader.onload = e => {
      images[zone] = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = zone => {
  images[zone] = null
}

const validUser = ref(false)
const isLoadingVerification = ref(false)

const verifyUser = () => {

  const data = { ...accountData.value }

  delete data.verified 

  if (fileInput.value) {
    data.photo_id = fileInput.value[0].files[0]
    data.photo_selfie = fileInput.value[1].files[0]
    data.photo_additional = fileInput.value[2].files[0]
  }
  
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value)
  }
  isLoadingVerification.value = true

  $api.verifyUser(formData)
    .then(async () => {
      isLoadingVerification.value = false
      verificationDialog.value = false
      images.first = null
      images.second = null
      images.third = null

      const res = await $api.getTextsAdmin()

      localStorage.setItem('texts', JSON.stringify(res.data))
      texts.value = JSON.parse(localStorage.getItem('texts'))
      window.location.reload()

    })
    .catch(e => {
      isLoadingVerification.value = false
    })
}
</script>

<template>
  <VDialog
    v-model="verificationDialog"
    max-width="400"
  >
    <VCard class="pa-8">
      <VBtn
        icon="mdi-close"
        variant="text"
        class="align-self-end mr-n6 mt-n6"
        @click="verificationDialog = false"
      />
      <span class="lotus-h1 text-black">
        {{ texts.find(t => t.key === 'verification')?.text || 'Верификация' }}
      </span>
      <p class="lotus-text text-black mt-4 mb-2">
        {{ texts.find(t => t.key === 'verification_data')?.text || 'Необходимо верифицировать аккаунт' }}
      </p>
      <div class="drop-zone-container mb-4">
        <div
          v-for="zone in ['first', 'second', 'third']"
          :key="zone"
          class="drop-zone mx-2 cursor-pointer"
          @click="openFileUpload(zone)"
          @dragover.prevent
          @drop.prevent="handleDrop(zone, $event)"
        >
          <input
            ref="fileInput"
            type="file"
            style="display: none;"
            @change="uploadFile(zone, $event)"
          >
          <button
            v-if="images[zone]"
            class="clear-btn"
            @click.stop="clearImage(zone)"
          >
            X
          </button>

          <img
            v-if="!images[zone]"
            class="mt-6"
            :src="fileload"
          >
          <img
            v-else
            style="width: 100%; height: 100%; object-fit: cover;"
            :src="images[zone]"
            :alt="`${zone} zone image`"
          >
        </div>
      </div>
      <p class="lotus-text text-center mt-4">
        {{ texts.find(t => t.key === 'verification_popup')?.text || 'После загрузки фото нажмите кнопку «Верифицировать»' }}
      </p>
      <button
        class="lotus-button1"
        :disabled="isLoadingVerification"
        :class="{ 'loading': isLoadingVerification }"
        @click="verifyUser"
      >
        <span
          v-if="isLoadingVerification"
          class="loader"
        />
        <span v-else>
          {{ texts.find(t => t.key === 'verification_button')?.text || 'Верифицировать' }}
        </span>
      </button>
    </VCard>
  </VDialog>
  <VCard class="pa-5">
    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <p class="lotus-h1 text-black">
          {{ texts.find(t => t.key === 'account_setting')?.text || 'Настройка аккаунта' }}
        </p>
        <VRow
          v-if="!accountData.verified"  
          style="border: 1px solid #e0e0e0; border-radius: 16px;"
          class="ma-1"
        >
          <VCol
            cols="12"
            md="6"
          >
            <p
              class="lotus-text"
              style="color: red;"
            >
              {{ texts.find(t => t.key === 'not_verified')?.text || 'Не верифицирован' }}
            </p>
            <p class="lotus-text">
              {{ texts.find(t => t.key === 'verification_data')?.text || 'Необходимо верифицировать аккаунт' }}
            </p>
          </VCol>
          <VCol
            class="d-flex justify-end align-center"
            cols="12"
            md="6"
          >
            <button
              class="lotus-button3"
              @click="verificationDialog = true"
            >
              {{ texts.find(t => t.key === 'verification_button')?.text || 'Верифицировать' }}
            </button>
          </VCol>
        </VRow>
        <VRow
          v-else
          style="border: 1px solid #00c02d; border-radius: 16px;"
          class="ma-1"
        >
          <VCol cols="12">
            <span
              class="lotus-text"
              style="color: #00ce2d;"
            ><img :src="verifiedIcon">{{ texts.find(t => t.key === 'verified')?.text || 'Верифицирован' }}</span>
          </VCol>
        </VRow>
        <p class="lotus-text mb-2 mt-6">
          {{ texts.find(t => t.key === 'user_data')?.text || 'Данные пользователя' }}
        </p>
        
        <VForm
          v-model="validUser"
          @submit.prevent="verifyUser"
        >
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="accountData.last_name"
                class="mb-4"
                :label="texts.find(t => t.key === 'surname')?.text || 'Фамилия'"
              />
              <VTextField
                v-model="accountData.first_name"
                class="mb-4"
                :label="texts.find(t => t.key === 'name')?.text || 'Имя'"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="accountData.country"
                class="mb-4"
                :items="countries"
                item-title="name"
                item-value="id"
                :label="texts.find(t => t.key === 'country')?.text || 'Страна'"
              >
                <template #selection="{ item }">
                  <div style="color: black;">
                    {{ item.raw.name }}
                  </div>
                </template>
              </VSelect>
              <VTextField
                v-model="accountData.phone"
                :label="texts.find(t => t.key === 'phone')?.text || 'Телефон'"
              />
            </VCol>
          </VRow>
          <button
            class="mt-4 mb-2 lotus-button1"
            :disabled="isLoadingVerification"
            :class="{ 'loading': isLoadingVerification }"
          > 
            <span
              v-if="isLoadingVerification"
              class="loader"
            />
            <span v-else>{{ texts.find(t => t.key === 'save_verification_button')?.text || 'Сохранить изменения' }}</span>
          </button>
        </VForm>
      </VCol>
    </VRow>
  </VCard>
  <VCard class="pa-6 mt-4">
    <VRow>
      <VCol cols="12">
        <p class="lotus-h1 text-black">
          {{ texts.find(t => t.key === 'invite_code')?.text || 'Реферальная ссылка' }}
        </p>
        <p class="lotus-text">
          {{ texts.find(t => t.key === 'ref_text')?.text || 'Ссылка для приглашения друзей' }}
        </p>
        <span
          class="text-black"
          style=" padding: 8px 12px; border-radius: 8px;background-color: #e7e7ff;"
        >
          {{ referralCode }} <img
            :src="copyIcon"
            style="cursor: pointer;"
            @click="copyReferralCode"
          >
        </span>
      </VCol>
    </VRow>
  </VCard>
</template>

<style scoped>
.drop-zone-container {
  display: flex;
  justify-content: center;
}

.drop-zone {
  position: relative;
  border: 2px dashed #ccc;
  border-radius: 8px;
  block-size: 80px;
  inline-size: 80px;
  text-align: center;
}

.drop-zone img {
  max-block-size: 100%;
  max-inline-size: 100%;
  object-fit: cover;
}

.clear-btn {
  position: absolute;
  border: none;
  background: #f66;
  color: white;
  cursor: pointer;
  inset-inline-end: 0;
  padding-block: 2px;
  padding-inline: 6px;
}
</style>
