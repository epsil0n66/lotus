// eslint-disable-next-line regex/invalid
import axios from 'axios'
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"


const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
})

api.interceptors.request.use(async config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}, function (error) {
  return Promise.reject(error)
},
)

api.interceptors.response.use(response => {
  return response
}, function (error) {
  if (error.response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    window.location.href = '/login'
  } else {
    toast(`Error: ${error.response.status} \n ${error?.response?.data?.error}`, {
      "theme": "auto",
      "type": "error",
      "dangerouslyHTMLString": true,
    })
  }
  
  return Promise.reject(error)
},
)

export default {
  async register(data) {
    const response = await api.post(`https://lotusinvest.world/api/register/`, data)
    
    return await response
  },

  async login(data) {
    const response = await api.post(`https://lotusinvest.world/api/login/`, data)

    localStorage.setItem('token', response.data.access)
    localStorage.setItem('refresh', response.data.refresh)
    if (response.status === 200) {
      toast(`Autheticated successfully`, {
        "theme": "auto",
        "type": "success",
      })
    }
    
    return response
  },
  async getBalance() {
    const response = await api.get(`https://lotusinvest.world/api/balance/`)
    
    return await response
  },
  async getVerificationStatus() {
    const response = await api.get(`https://lotusinvest.world/api/verification-status/`)
    
    return await response
  },
  async verifyUser(data) {
    const response = await api.post(`https://lotusinvest.world/api/verify-user/`, data)
    
    if (response.status === 201) {
      toast(`Verification request sent`, {
        "theme": "auto",
        "type": "success",
      })
    }

    return await response
  },
  async getUser() {
    return await api.get(`https://lotusinvest.world/api/user/`)
  },
  async updateUser(data) {

    const response = await api.put(`https://lotusinvest.world/api/user/`, data)
    
    if (response.status === 200) {
      toast(`Updated successfully`, {
        "theme": "auto",
        "type": "success",
      })
    }

    return await response
  },
  async getReferralCode() {
    const response = await api.get(`https://lotusinvest.world/api/user/referral-code/`)
    
    return await response
  },
  async getEarnings(page) {
    let response
    if (page) {
      response = await api.get(`https://lotusinvest.world/api/earnings-history/?page=${page}`)
      
      return await response
    } else {
      response = await api.get(`https://lotusinvest.world/api/earnings-history/`)
    }
    
    return await response
  },
  async getEarningsSummary() {
    const response = await api.get(`https://lotusinvest.world/api/earnings-summary/`)
    
    return await response
  },
  async getLanguages() {
    const response = await api.get(`https://lotusinvest.world/api/languages/`)
    
    return await response
  },
  async getCountries() {
    const response = await api.get(`https://lotusinvest.world/api/countries/`)
    
    return await response
  },
  async getTextsAdmin() {
    const response = await api.get(`https://lotusinvest.world/api/textsadmin/`)
    
    return await response
  },
  async getUserInvestments() {
    const response = await api.get(`https://lotusinvest.world/api/user-investments/`)
    
    return await response
  },
  async getTotalBalance() {
    const response = await api.get(`https://lotusinvest.world/api/total-balance/`)
    
    return await response
  },
  async getUserSubscriptions() {
    const response = await api.get(`https://lotusinvest.world/api/user-subscriptions/`)
    
    return await response
  },

  async getWallet() {
    const response = await api.get(`https://lotusinvest.world/api/request-wallet/`)

    return await response
  },
  async getTariffPlans() {
    const response = await api.get(`https://lotusinvest.world/api/tariff-plans`)
    
    return await response
  },
  async subscribeToTariffPlan(data) {
    const response = await api.post(`https://lotusinvest.world/api/user-tariff-plan/`, data)
    
    if (response.status === 201) {
      toast(`Subscribed successfully`, {
        "theme": "auto",
        "type": "success",
      })
    }
    

    return await response
  },
  async withdraw(data) {
    const response = await api.post(`https://lotusinvest.world/api/withdraw/`, data)

    if (response.status === 201) {
      toast(`Withdrawal requested successfully`, {
        "theme": "auto",
        "type": "success",
      })
    }
    
    return await response
  },


  // Add more endpoint functions as needed
}
