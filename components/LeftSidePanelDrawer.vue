<template>
  <md-drawer md-fixed :md-active.sync="leftDrawer">
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

    <!-- feed お気に入り -->
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
</template>

<script>
export default {
  async fetch ({ store }) {
    await store.dispatch('headlines/loadHeadlines', `/api/top-headlines?country=${store.state.headlines.country}&category=${store.state.headlines.category}`)
    await store.dispatch('feed/loadUserFeed')
  },

  data () {
    return {
      leftDrawer: false
    }
  },
  computed: {
    feed () {
      return this.$store.getters['feed/feed']
    },
    country () {
      return this.$store.getters['headlines/country']
    },
    user () {
      return this.$store.getters['auth/user']
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    async country () {
      await this.$store.dispatch('headlines/loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
    }
  },
  changeCountry (country) {
    this.$store.commit('headlines/setCountry', country)
  },
  methods: {
    openLeftSideDrawer () {
      this.leftDrawer = true
    },
    closeLeftSideDrawer () {
      this.leftDrawer = false
    },
    async removeHeadlineFromFeed (headline) {
      await this.$store.dispatch('feed/removeHeadlineFromFeed', headline)
    }
  }
}
</script>
