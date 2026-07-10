import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const username = ref('')
  const realName = ref('')
  const roles = ref([])

  const login = async (data) => {
    console.log('API login called with:', data)
    const res = await api.auth.login(data)
    console.log('API login response:', res)
    if (res.code === 200) {
      token.value = res.data.token
      username.value = res.data.username
      realName.value = res.data.realName
      roles.value = res.data.roles || []
      localStorage.setItem('token', res.data.token)
      console.log('Token saved:', res.data.token)
    }
    return res
  }

  const logout = () => {
    token.value = ''
    username.value = ''
    realName.value = ''
    roles.value = []
    localStorage.removeItem('token')
  }

  return {
    token,
    username,
    realName,
    roles,
    login,
    logout
  }
})