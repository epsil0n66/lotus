<script setup>
import copyIcon from '@images/icons/copy.svg'
import fileload from '@images/icons/fileload.svg'
import verifiedIcon from '@images/icons/verified.svg'

const $api = inject('api')

const accountData = ref({
  first_name: '',
  last_name: '',
  patronymic: '',
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

const saveChanges = () => {
  const data = {
    name: accountData.value.first_name,
    phone: accountData.value.phone,
  }

  $api.updateUser(data)
}

function copyReferralCode () {
  navigator.clipboard.writeText(referralCode.value)
}
const verificationDialog = ref(false)

const countries = [
  'USA',
  'Russia',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'China',
]

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

const verifyUser = () => {

  const data = { ...accountData.value }

  delete data.verified 
  data.first_name = 'Demo'
  data.date_of_birth = '2000-01-01'
  data.country = 1
  data.photo_id = images.first
  data.photo_selfie = images.second
  data.photo_additional = images.third
  
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value)
  }
  $api.verifyUser(formData)
    .then(() => {
      verificationDialog.value = false
      images.first = null
      images.second = null
      images.third = null
    })
}
</script>

<template>
  <VDialog
    v-model="verificationDialog"
    max-width="400"
  >
    <VCard class="pa-6">
      <span class="lotus-h1 text-black">
        Верификация
      </span>
      <p class="lotus-text text-black mt-4">
        Загрузите фото: <br>
        • Паспорта (разворот 1 и 2 стр.) <br>
        • Селфи с открытым документов в руках
      </p>
      <p class="lotus-text text-center mt-4">
        Вставьте фото в форму или нажмите на поле для загрузки файлов
      </p>
      <div class="drop-zone-container mb-4">
        <div
          v-for="zone in ['first', 'second', 'third']"
          :key="zone"
          class="drop-zone mx-2"
          @click="openFileUpload(zone)"
          @dragover.prevent
          @drop.prevent="handleDrop(zone, $event)"
        >
          <input
            ref="fileInput"
            type="file"
            style="display: none"
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
      <button
        class="lotus-button1"
        @click="verifyUser"
      >
        Верифицировать
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
          Настройка аккаунта
        </p>
        <VRow
          v-if="!accountData.verified"  
          style="border: 1px solid #E0E0E0; border-radius: 16px;"
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
              Не верифицирован
            </p>
            <p class="lotus-text">
              Загрузите фото: <br>
              • Паспорта (разворот 1 и 2 стр.)<br>
              • Селфи с открытым документов в руках <br>
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
              Верифицировать
            </button>
          </VCol>
        </VRow>
        <VRow
          v-else
          style="border: 1px solid #00C02D; border-radius: 16px;"
          class="ma-1"
        >
          <VCol cols="12">
            <span
              class="lotus-text"
              style="color: #00CE2D"
            ><img :src="verifiedIcon"> Верифицирован</span>
          </VCol>
        </VRow>
        <span class="lotus-text">Данные пользователя</span>
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="accountData.last_name"
              label="Фамилия"
            />
            <VTextField
              v-model="accountData.first_name"
              label="Имя"
            />
            <VTextField
              v-model="accountData.patronymic"
              label="Отчество"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="accountData.country"
              :items="countries"
              label="Страна"
            />
            <VTextField
              v-model="accountData.phone"
              label="Телефон"
            />
          </VCol>
        </VRow>
        <button
          class="mt-6 lotus-button1"
          @click="saveChanges"
        >
          Сохранить изменения
        </button>
      </VCol>
    </VRow>
  </VCard>
  <VCard class="pa-6 mt-4">
    <VRow>
      <VCol cols="12">
        <p class="lotus-h1 text-black">
          Реферальная программа
        </p>
        <p class="lotus-text">
          Приглашайте друзей и знакомых через реферальную ссылку и получайте дополнительный доход.
        </p>
        <span
          class="text-black"
          style="background-color: #E7E7FF; border-radius: 8px; padding: 8px 12px 8px 12px;"
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
  text-align: center;
  border-radius: 8px;
  width: 80px;
  height: 80px;
}

.drop-zone img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.clear-btn {
  position: absolute;
  right: 0px;
  border: none;
  background: #ff6666;
  color: white;
  cursor: pointer;
  padding: 2px 6px;
}
</style>
