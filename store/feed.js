import { db } from '@/plugins/firestore'

export const state = () => ({
  feed: [],
  source: ''
})
export const mutations = {
  setFeed (state, headlines) {
    state.feed = headlines
  },
  clearFeed (state) {
    state.feed = []
  },
  setSource (state, payload) {
    state.source = payload
  }
}
export const actions = {
  async addHeadlineToFeed ({ rootState }, headline) {
    const updateHeadline = {
      author: headline.author,
      content: headline.content,
      description: headline.description,
      publishedAt: headline.publishedAt,
      slug: headline.slug,
      source: headline.source,
      title: headline.title,
      url: headline.url,
      urlToImage: headline.urlToImage,
      updated_at: new Date().toISOString()
    }
    const userDoc = rootState.auth.user.uid
    const feedRef = db.collection(`users/${userDoc}/feed`).doc(headline.title)
    await feedRef.set(updateHeadline)
  },
  async removeHeadlineFromFeed ({ rootState }, headline) {
    try {
      const headlineRef = db.collection(`users/${rootState.auth.user.uid}/feed`).doc(headline.title)
      await headlineRef.delete()
    } catch (error) {
      console.log(error.message)
    }
  },
  loadUserFeed ({ rootState, commit }) {
    try {
      if (rootState.auth.user) {
        const feedRef = db.collection(`users/${rootState.auth.user.uid}/feed`).orderBy('updated_at', 'desc')
        feedRef.onSnapshot((querySnapshot) => {
          const headlines = []
          querySnapshot.forEach((doc) => {
            headlines.push(doc.data())
          })
          commit('feed/setFeed', headlines, { root: true })
        })
      } else {
        commit('clearError', null, { root: true })
      }
    } catch (error) {
      console.log(error.message)
      commit('clearError', null, { root: true })
    }
  }
}
export const getters = {
  feed (state) {
    return state.feed
  },
  source (state) {
    return state.source
  }
}
