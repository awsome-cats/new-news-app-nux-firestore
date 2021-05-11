import slugify from 'slugify'
import { db } from '~/plugins/firestore'
import defaultImage from '@/assets/default-image.jpg'

export const state = () => ({

  country: 'jp',
  category: '',
  headlines: [],
  headline: null

})

export const mutations = {
  setCountry (state, country) {
    state.country = country
  },
  setHeadlines (state, headlines) {
    state.headlines = headlines
  },
  setHeadline (state, payload) {
    state.headline = payload
  },
  setCategory (state, category) {
    state.category = category
  }
}

export const actions = {
  // 前ニュースの取得
  async loadHeadlines ({ commit }, apiUrl) {
    commit('setError', null, { root: true })
    commit('setBusy', true, { root: true })
    commit('setLoading', true, { root: true })

    const { articles } = await this.$axios.$get(apiUrl)
    const headlines = articles.map((article) => {
      const slug = slugify(article.title, {
        replacement: '-',
        remove: /[^a-zA-Z0-9 -]/g,
        lower: true
      })
      if (!article.urlToImage) {
        article.urlToImage = defaultImage
      }
      const headline = { ...article, slug }
      return headline
    })
    commit('setLoading', false, { root: true })
    commit('setHeadlines', headlines)
  },
  /*
  Single ニュースを dynamic routeで取得
  条件: auth !=null
  機能
  dynamic routeでheadlineを取得できる時はcommentの送信や取得なども可能.
  であればheadlineとcommentを含むloadedHeadlineというオブジェクトを作成する。
  まずhealinesコレクションのデータをloadedHeadlineに格納するがその時にデータが存在するかチェックする方法としてdoc.existsを使用。
  あればcommentsの参照を取得して、空ならそのloadedHeadlineをcommitする
  コメントが存在するならloadedHeadlineの中にcomments配列を作成し、そこに
  コメンツのfield等を下格納する。
  */
  async loadHeadline ({ commit }, payload) {
    const headlineRef = db.collection('headlines').doc(payload)
    // 後で変更するかも
    const commentsRef = db.collection(`headlines/${payload}/comments`).orderBy('likes', 'desc')

    // commentsRefとheadlineRefのどちらも取得したい時
    let loadedHeadline = {}
    await headlineRef.get().then(async (doc) => {
      if (doc.exists) {
        loadedHeadline = doc.data()
        await commentsRef.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            commit('setHeadline', loadedHeadline)
          }
          let loadedComments = []
          querySnapshot.forEach((doc) => {
            loadedComments.push(doc.data())
            loadedHeadline['comments'] = loadedComments
            commit('setHeadline', loadedHeadline)
          })
        })
      }
    })
    // headlineのみ取得する時はこちら
    // await headlineRef.get().then((doc) => {
    //   if (doc.exists) {
    //     const headline = doc.data()
    //     commit('setHeadline', headline)
    //   }
    // })
  },
  // クリックしたニュースをdatabaseに格納するには
  async saveHeadline ({ commit }, headline) {
    const headlineRef = await db.collection('headlines').doc(headline.slug)
    // console.log('headlineRef', headlineRef)
    // 同じニュースを格納しないようにするため
    // ユニークIdにすると同じニュースを格納してしまう
    let headlineId
    await headlineRef.get().then((doc) => {
      if (doc.exists) {
        headlineId = doc.id
      }
    })
    if (!headlineId) {
      await headlineRef.set(headline)
    }
  },
  /**
   * comments.jsに移動
   * ニュースにコメントをつける
   * 格納先1:headlines/headlineId/comments/commentId/comment
     検討中:格納先2:comments/commentId/comment
     検討中: 格納先3: users/userId/comments/commentId/comment

     sendComment
     headlines/headline.slug/comments以下に送信されたコメントを格納し、commentsRefとして取得する。
     このとき取得されるデータは送信されたコメント。
     stateのhealineとcommentsをマージして、updateHeadlineに格納する
     この時setHeadlineはupdateHeadlineである
     データを取得したが表示はまだである
    のちにcommentsのsnapshotを取得すればいいのに、stateのheadlineとマージさせているのに注意
   */
  // async sendComment ({ state, commit }, comment) {
  //   commit('setLoading', true, { root: true })

  //   // const user = auth.currentUser

  //   // usersのサブコレクションに格納
  //   // const userCommentRef = await db.collection(`users/${user.uid}/comments`)
  //   // userCommentRef.doc(comment.id).set(comment)

  //   // commentコレクションの作成と格納
  //   // await db.collection('comments').doc(comment.id).set(comment)
  //   // headlinesのサブコレクションに格納
  //   const commentsRef = db.collection(`headlines/${state.headline.slug}/comments`)

  //   await commentsRef.doc(comment.id).set(comment)

  //   await commentsRef.orderBy('likes', 'desc')
  //     .get()
  //     .then((querySnapshot) => {
  //       let comments = []
  //       querySnapshot.forEach((doc) => {
  //         comments.push(doc.data())
  //         // console.log('comments', comments)
  //         const updateHeadline = { ...state.headline, comments }
  //         // mergeされたデータを出力
  //         console.log('updateHeadline', updateHeadline)
  //         commit('setHeadline', updateHeadline)
  //       })
  //     })
  //   commit('setLoading', false, { root: true })
  // }
}
export const getters = {
  headlines (state) {
    return state.headlines
  },
  headline (state) {
    return state.headline
  },
  country (state) {
    return state.country
  },
  category (state) {
    return state.category
  }
}
