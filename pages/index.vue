
<template>
  <div class="md-layout md-alignment-center">
    <!-- toolbar -->

    <md-toolbar class="fixed" elevation="1">
      <md-button class="md-icon-button" @click="showLeftSidePanel = true">
        <md-icon>menu</md-icon>
      </md-button>
      <nuxt-link class="md-primary md-title" to="/">
        New Nuxt News
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <template v-if="user">
          <md-button @click="$router.push(`/profile/${user.uid}`)">
            {{ user.email }}
          </md-button>
          <md-button @click="logout">
            ログアウト
          </md-button>
        </template>
        <template v-else>
          <md-button @click="$router.push('/login')">
            ログイン
          </md-button>
          <md-button @click="$router.push('/register')">
            登録
          </md-button>
        </template>

        <md-button
          class="md-primary"
          @click="openSearchDialog()"
        >
          検索
        </md-button>
        <md-button @click="showRightSidePanel=true">
          カテゴリー
        </md-button>
      </div>
    </md-toolbar>

    <!-- 検索モーダル -->
    <search-modal
      ref="dialog"
      @inputQuery="searchHeadlines"
    />

    <!-- left-drawer -->

    <md-drawer md-fixed :md-active.sync="showLeftSidePanel">
      <md-toolbar md-title>
        Personal Feed
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate" />
      <md-field>
        <label for="country">Country</label>
        <md-select id="country" name="country" :value="country" @input="changeCountry">
          <md-option value="jp">
            日本
          </md-option>
          <md-option value="us">
            アメリカ
          </md-option>
          <md-option value="de">
            カナダ
          </md-option>
          <md-option value="ca">
            ドイツ
          </md-option>
        </md-select>
      </md-field>

      <md-empty-state
        v-if="feed.length === 0 && !user"
        class="md-primary"
        md-icon="bookmarks"
        md-label="Feedはありません"
        md-description="ブックマークするにはログインして下さい"
      >
        <md-button
          class="md-primary md-raised"
          @click="$router.push('/login')"
        >
          ログイン
        </md-button>
      </md-empty-state>

      <md-empty-state
        v-else-if="feed.length === 0"
        class="md-accent"
        md-icon="bookmark_outline"
        md-label="Feedはありません"
        md-description="ブックマークしたものは、ここに安全に保管されます"
      />

      <md-list
        v-for="headline in feed"
        v-else
        :key="headline.id"
        class="md-triple-line"
      >
        <md-list-item>
          <md-avatar>
            <img :src="headline.urlToImage" :alt="headline.title">
          </md-avatar>
          <div class="md-list-item-text">
            <span><a :href="headline.url" target="_blank">{{ headline.title }}</a></span>
            <span>{{ headline.source.name }}</span>
            <span @click="viewComments(headline.slug)">View Comments</span>
          </div>
          <md-button
            class="md-icon-button md-list-action"
            @click="removeHeadlineFromFeed(headline)"
          >
            <md-icon class="md-accent">
              delete
            </md-icon>
          </md-button>
        </md-list-item>
        <md-divider class="md-inset" />
      </md-list>
    </md-drawer>

    <!-- feed お気に入り -->
    <!-- left-drawer -->

    <!-- right-drawer -->
    <md-drawer class="md-right" md-fixed :md-active.sync="showRightSidePanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">News Categories</span>
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate" />

      <md-list>
        <md-subheader class="md-primary">
          カテゴリー
        </md-subheader>
        <md-list-item
          v-for="(newsCategory, i) in newsCategories"
          :key="i"
          @click="loadCategory(newsCategory.path)"
        >
          <md-icon :class="newsCategory.path === category ? 'md-primary': ''">
            {{ newsCategory.icon }}
          </md-icon>
          <span class="md-list-item-text">{{ newsCategory.name }}</span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <!-- right-drawer -->

    <div class="md-layout-item md-size-95">
      <md-content class="md-layout md-gutter" style="background:#ddd; padding: 1em;">
        <ul v-for="headline in headlines" :key="headline.id" class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card style="margin-top: 1em;" md-with-hover>
            <md-ripple>
              <md-card-media md-ratio="16:9">
                <img :src="headline.urlToImage" :alt="headline.title">
              </md-card-media>

              <md-card-header>
                <div class="md-title">
                  <a :href="headline.url" target="_blank">
                    {{ headline.title }}
                  </a>
                </div>
                <div @click="loadSource(headline.source.id)">
                  {{ headline.source.name }}
                  <md-icon class="small-icon">
                    book
                  </md-icon>
                </div>

                <div v-if="headline.author" class="md-subhead">
                  {{ headline.author }}
                  <md-icon class="small-icon">
                    face
                  </md-icon>
                </div>
                <div class="md-subhead">
                  {{ headline.publishedAt | publishedTimeToNow }}
                  <md-icon class="small-icon">
                    alarm
                  </md-icon>
                </div>
              </md-card-header>

              <md-card-content>{{ headline.description }}</md-card-content>
              <md-card-actions>
                <md-button
                  class="md-icon-button"
                  :class="isinFeed(headline.title)"
                  @click="addHeadlineToFeed(headline)"
                >
                  <md-icon>bookmark</md-icon>
                </md-button>
                <md-button @click="saveHeadlines(headline)">
                  <md-icon>
                    message
                  </md-icon>
                </md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>
        </ul>
      </md-content>
    </div>
  </div>
</template>
<script>
import SearchModal from '@/components/SearchModal'
// import LeftSidePanelDrawer from '@/components/LeftSidePanelDrawer'
// import FeedList from '@/components/FeedList'

export default {
  components: {
    SearchModal
    // LeftSidePanelDrawer
    // FeedList
  },
  async fetch ({ store }) {
    await store.dispatch('headlines/loadHeadlines', `/api/top-headlines?country=${store.state.headlines.country}&category=${store.state.headlines.category}`)
    await store.dispatch('feed/loadUserFeed')
  },
  data () {
    return {
      showRightSidePanel: false,
      showLeftSidePanel: false,
      showSearchDialog: false,
      newsCategories: [
        { name: 'トップヘッドライン', path: '', icon: 'today' },
        { name: 'テクノロジー', path: 'technology', icon: 'keyboard' },
        { name: 'ビジネス', path: 'business', icon: 'business_center' },
        { name: 'エンターテイメント', path: 'enterTainment', icon: 'weekend' },
        { name: 'ヘルス', path: 'health', icon: 'fastfood' },
        { name: 'サイエンス', path: 'science', icon: 'fingerprint' },
        { name: 'スポーツ', path: 'sports', icon: 'golf_course' }
      ],
      query: '',
      fromDate: '',
      toDate: '',
      sortBy: ''
    }
  },
  computed: {
    dateFormat: {
      get () {
        return this.$material.locale.dateFormat
      },
      set (val) {
        this.$material.locale.dateFormat = val
      }
    },
    headlines () {
      return this.$store.getters['headlines/headlines']
    },
    country () {
      return this.$store.getters['headlines/country']
    },
    category () {
      return this.$store.getters['headlines/category']
    },
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters['auth/user']
    },
    feed () {
      return this.$store.getters['feed/feed']
    },
    isAuthenticated () {
      return this.$store.getters['auth/loginStatus']
    },
    source () {
      return this.$store.getters['feed/source']
    }
  },
  watch: {
    async country () {
      await this.$store.dispatch('headlines/loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
    }
  },
  methods: {
    // モーダルの開閉
    openSearchDialog () {
      this.$refs.dialog.open()
    },
    async searchHeadlines (query, fromDate, toDate, sortBy) {
      console.log(fromDate)
      await this.$store.dispatch('headlines/loadHeadlines', `/api/everything?q=${query}&from=${this.dateToISOString(fromDate)}&to=${this.dateToISOString(toDate)}&sortBy=${sortBy}`)
      this.$refs.dialog.close()
    },
    dateToISOString (date) {
      if (date) {
        return new Date(date).toISOString()
      }
    },
    leftSideDrawer () {
      this.$refs.leftDrawer.openLeftSideDrawer()
    },
    async loadCategory (category) {
      this.$store.commit('headlines/setCategory', category)
      await this.$store.dispatch('headlines/loadHeadlines', `/api/top-headlines?country=jp&category=${this.category}`)
    },
    changeCountry (country) {
      this.$store.commit('headlines/setCountry', country)
    },
    async removeHeadlineFromFeed (headline) {
      await this.$store.dispatch('feed/removeHeadlineFromFeed', headline)
    },
    emitEvent (showLeftSidePanel) {
      if (showLeftSidePanel === true) {
        showLeftSidePanel = false
      } else {
        showLeftSidePanel = true
      }
    },
    saveHeadlines (headline) {
      this.$store.dispatch('headlines/saveHeadline', headline)
        .then(() => {
          this.$router.push(`/headlines/${headline.slug}`)
        })
    },
    // logout() {
    //   this.$refs.dialog.logout()
    // },
    logout () {
      this.$store.dispatch('auth/logout')
    },
    async addHeadlineToFeed (headline) {
      if (this.user) {
        await this.$store.dispatch('feed/addHeadlineToFeed', headline)
      }
    },
    isinFeed (title) {
      const inFeed = this.feed.findIndex(headline => headline.title === title) > -1
      return inFeed ? 'md-primary' : ''
    },
    loadSource (sourceId) {
      if (sourceId) {
        console.log(sourceId)
        this.$store.commit('feed/setSource', sourceId)
        this.$store.dispatch('headlines/loadHeadlines', `/api/topheadlines?sources=${this.source}`)
      }
    },
    // async searchHeadlines () {
    //   console.log('search', this.query, this.fromDate, this.toDate, this.sortBy)
    //   await this.$store.dispatch('headlines/loadHeadlines', `/api/everything?q=${this.query}&from=${this.dateToISOString(this.fromDate)}&to=${this.dateToISOString(this.toDate)}&sortBy=${this.sortBy}`)
    //   this.showSearchDialog=false
    // },
    // dateToISOString(date) {
    //   if (date) {
    //     return new Date(date).toISOString()
    //   }
    // },
    viewComments (id) {
      this.$router.push(`headlines/${id}`)
    }
  }
}
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9
}
</style>
