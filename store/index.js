// import md5 from 'md5'
import db, { auth } from '@/plugins/firestore'
export const strict = false

export const state = () => ({
  loading: false,
  user: null,
  error: null,
  token: null,
  busy: false,
  jobDone: false
})

export const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  isAuthenticated (state, payload) {
    state.token = payload
  },
  clearError (state) {
    state.error = null
  },
  setBusy (state, payload) {
    state.busy = payload
  },
  setJobDone (state, payload) {
    state.jobDone = payload
  }
}
export const actions = {
  registerUser ({ commit }, payload) {
    commit('setLoading', true)
    commit('setBusy', true)
    commit('clearError')
    let newUser = null
    auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((user) => {
        user = auth.currentUser
        user.updateProfile({ displayName: payload.name })
        const currentUser = {
          email: payload.email,
          password: payload.password,
          displayName: payload.name,
          uid: user.uid,
          createdAt: new Date().toISOString()
        }
        return db.collection('users').doc(user.uid).set(currentUser)
      })
      .then(() => {
        newUser = {
          email: payload.email,
          password: payload.password,
          displayName: payload.name
        }
        commit('setUser', newUser)
        commit('setLoading', false)
      })
      .then(() => {
        commit('setJobDone', true)
        commit('setBusy', false)
      })
      .catch((error) => {
        commit('setBusy', false)
        commit('setError', error)
        commit('setLoading', false)
      })
  },
  async loginUser ({ commit }, payload) {
    try {
      commit('setLoading', true)
      await auth.signInWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          user = auth.currentUser
          const currentUser = {
            email: user.email,
            uid: user.uid,
            name: user.displayName
          }
          // eslint-disable-next-line no-console
          console.log('currentUser', currentUser)
          commit('setUser', currentUser)
        })
    } catch (error) {
      // eslint-disable-next-line no-console
      commit('setError', error)
    }
  }
}
export const getters = {
  loading (state) {
    return state.loading
  },
  user (state) {
    return state.user
  },
  error (state) {
    return state.error
  },
  busy (state) {
    return state.busy
  },
  jobDone (state) {
    return state.jobDone
  }
}
