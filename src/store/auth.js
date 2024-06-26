import axios from 'axios'

const env = import.meta.env

const authModules = {
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null
  },

  getters: {
    admin: (state) => state.user.data,
    getAccessToken: (state) => {
      return state.user.tokens.access
    },
    getRefreshToken: (state) => state.user.tokens.refresh
  },

  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setAccessToken(state, token) {
      localStorage.setItem('accessToken', JSON.stringify(token))
    },
    setRefreshToken(state, token) {
      localStorage.setItem('refreshToken', JSON.stringify(token))
    }
  },
  actions: {
    async loginUser({ commit }, form) {
      try {
        commit('setAlertData', {
          message: 'Logging in...',
          type: 'info',
          isLoading: false
        })
        const response = await axios.post(`${env.VITE_API_BASE_URL}/auth/login`, form)
        commit('setUser', response.data)
        response.status === 200
          ? commit('setAlertData', {
              message: response.data.message,
              type: 'success',
              isLoading: false
            })
          : commit('setAlertData', {
              message: response.data.message,
              type: 'error',
              isLoading: false
            })
        // Simpan user dan token ke dalam state Vuex dan local storage
        commit('setAccessToken', response.data.tokens.access)
        commit('setRefreshToken', response.data.tokens.refresh) // assuming the response has a 'user' field
        return response.data // returning data if needed
      } catch (error) {
        return error.response
      }
    },

    async registerUser(state, form) {
      try {
        const response = await axios.post(`${env.VITE_API_BASE_URL}/auth/register`, form)
        return response.data
      } catch (error) {
        return error.message
      }
    }
  }
}

export default authModules
