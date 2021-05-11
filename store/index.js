import JWTDecode from 'jwt-decode'
import cookieParser from 'cookieParser'
// mutate errorを防ぐ
export const strict = false

export const state = () => ({
  loading: false,
  error: null,
  busy: null
})

export const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  setBusy (state, payload) {
    state.busy = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  clearError (state) {
    state.error = null
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (process.server && process.static) { return }
    if (!req.headers.cookie) { return }
    const parsed = cookieParser.parse(req.headers.cookie)

    const accessTokenCookie = parsed.access_token

    if (!accessTokenCookie) { return }
    const decoded = JWTDecode(accessTokenCookie)
    // console.log('decoded', decoded)
    if (decoded) {
      commit('auth/setUser', {
        uid: decoded.user_id,
        email: decoded.email

      })
    }
  }
}
export const getters = {
  loading (state) {
    return state.loading
  },
  busy (state) {
    return state.busy
  },
  error (state) {
    return state.error
  }
}
