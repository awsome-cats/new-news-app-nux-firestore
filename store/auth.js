import Cookie from 'js-cookie'
import { auth, db } from '@/plugins/firestore'

export const state = () => ({
  user: null,
  error: null,
  jobDone: false
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setJobDone (state, payload) {
    state.jobDone = payload
  }
}
export const actions = {
  registerUser ({ commit }, payload) {
    commit('clearError', null, { root: true })
    commit('setLoading', true, { root: true })
    commit('setBusy', true, { root: true })
    let newUser = null
    auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((user) => {
        user = auth.currentUser
        user.updateProfile({ displayName: payload.name })
        console.log('user', user)
        const currentUser = {
          email: payload.email,
          password: payload.password,
          displayName: payload.name,
          uid: user.uid,
          createdat: new Date()
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
        commit('setLoading', false, { root: true })
      })
      .then(() => {
        commit('setJobDone', false)
        commit('setBusy', false, { root: true })
      })
      .catch((error) => {
        console.log(error)
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
        commit('setLoading', false, { root: true })
      })
  },
  async loginUser ({ commit }, payload) {
    try {
      commit('setLoading', true, { root: true })
      commit('setBusy', true, { root: true })
      await auth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(async (user) => {
          const token = await auth.currentUser.getIdToken()
          Cookie.set('access_token', token)
          user = auth.currentUser
          const loginRef = db.collection('users').doc(user.uid)
          const loggedInUser = await (await loginRef.get()).data()
          commit('setUser', loggedInUser)
          commit('setLoading', false, { root: true })
          commit('setBusy', false, { root: true })
        })
    } catch (error) {
      commit('setLoading', false, { root: true })
      commit('setBusy', false, { root: true })
      commit('setError', error, { root: true })
    }
  },
  setAuthStatus ({ commit }) {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // user.getIdTokenResult()
        //   .then((idTokenResult) => {
        //     console.log('idTokenResult', idTokenResult)
        //   })
        const loginRef = db.collection('users').doc(user.uid)
        const loggedInUser = await (await loginRef.get()).data()
        const authUser = {
          createdAt: loggedInUser.createdAt,
          displayName: loggedInUser.displayName,
          email: loggedInUser.email,
          uid: loggedInUser.uid
        }
        commit('setUser', authUser)
      }
    })
  },
  logout ({ commit }) {
    auth.signOut()
    Cookie.remove('access_token')
    commit('setUser', null)
    commit('clearError', null, { root: true })
    commit('feed/clearFeed', [], { root: true })
  }
}
export const getters = {
  user (state) {
    return state.user
  },
  isAuthenticated (state) {
    return !!state.user
  },
  loginStatus (state) {
    return state.user !== null && state.user !== undefined
  },
  jobDone (state) {
    return state.jobDone
  }
}
