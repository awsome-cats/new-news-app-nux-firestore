export const state = () => ({
  country: 'jp',
  headlines: []
})

export const mutations = {
  setCountry (state, payload) {
    state.country = payload
  },
  setHeadlines (state, headlines) {
    state.headlines = headlines
  }
}

export const actions = {
  async loadHeadlines ({ commit }, payload) {
    commit('setError', null, { root: true })
    commit('setBusy', true, { root: true })
    commit('setLoading', true, { root: true })
    const { articles } = await this.$axios.$get(payload)
    commit('setLoading', false, { root: true })
    commit('setHeadlines', articles)
  }
}

export const getters = {
  headlines (state) {
    return state.headlines
  }
}
