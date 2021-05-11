import { db } from '~/plugins/firestore'

export const state = () => ({

})

export const actions = {
  async sendComment ({ rootState, commit }, comment) {
    commit('setLoading', true, { root: true })
    // const user = auth.currentUser
    // usersのサブコレクションに格納
    // const userCommentRef = await db.collection(`users/${user.uid}/comments`)
    // userCommentRef.doc(comment.id).set(comment)
    // commentコレクションの作成と格納
    // await db.collection('comments').doc(comment.id).set(comment)
    // headlinesのサブコレクションに格納
    const commentsRef = db.collection(`headlines/${rootState.headlines.headline.slug}/comments`)
    await commentsRef.doc(comment.id).set(comment)
    await commentsRef.orderBy('likes', 'desc')
      .get()
      .then((querySnapshot) => {
        let comments = []
        querySnapshot.forEach((doc) => {
          comments.push(doc.data())
          const updateHeadline = { ...rootState.headlines.headline, comments }
          // mergeされたデータをコミット
          commit('headlines/setHeadline', updateHeadline, { root:true })
        })
      })
    commit('setLoading', false, { root: true })
  },
  async likeComment({ rootState, commit }, commentId) {
    try {
      const commentsRef = db.collection(`headlines/${rootState.headlines.headline.slug}/comments`).orderBy('likes', 'desc')
      // 同じもの
      // const likedCommentRef = db.collection('headlines').doc(rootState.headlines.headline.slug).collection('comments').doc(commentId)
      const likedCommentRef = db.collection(`headlines/${rootState.headlines.headline.slug}/comments`).doc(commentId)

      await likedCommentRef.get().then((doc) => {
        if (doc.exists) {
          const prevLikes = doc.data().likes
          const currentLikes = prevLikes + 1
          likedCommentRef.update({ likes: currentLikes })
        }
      })
      await commentsRef.onSnapshot(querySnapshot => {
        let loadedComments = []
        querySnapshot.forEach(doc => {
          loadedComments.push(doc.data())
          const updatedHeadline = {
            ...rootState.headlines.headline,
            comments: loadedComments
          }
          commit('headlines/setHeadline', updatedHeadline, { root:true })
        })
      })
    } catch(error) {
      console.log(error.message)
      commit('clearError', null, { root:true })
    }
  }
}
