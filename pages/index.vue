<template>
  <div class="md-layout md-alignment-center" style="margin: 4em 0">
    <md-toolbar class="fixed-toolbar" elevation="1">
      <md-button class="md-icon-button" @click="showLeftSidePanel=true">
        <md-icon>menu</md-icon>
      </md-button>
      <nuxt-link class="md-primary md-title" to="/">
        Nuxt News
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <template>
          <md-button />

          <md-button>ログアウト</md-button>
        </template>
        <template>
          <md-button @click="$router.push('/login')">
            Login
          </md-button>
          <md-button @click="$router.push('/register')">
            Register
          </md-button>
        </template>
        <md-button
          class="md-primary"
        >
          Search
        </md-button>
        <md-button @click="showRightSidePanel=true">
          Category
        </md-button>
      </div>
    </md-toolbar>
    <!-- Left Drawer -->
    <md-drawer md-fixed :md-active.sync="showLeftSidePanel">
      <md-toolbar md-title>
        Personal Feed
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate" />
      <md-field>
        <label for="country">Country</label>
        <md-select id="country" name="country" value="country">
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
      <!-- Default Markup (if feed empty) -->
      <md-empty-state
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
        class="md-accent"
        md-icon="bookmark_outline"
        md-label="Feedはありません"
        md-description="ブックマークしたものは、ここに安全に保管されます"
      />
      <!-- Feed Content (if feed not empty) -->
      <md-list
        class="md-triple-line"
      >
        <md-list-item>
          <md-avatar>
            <img src="" alt="">
          </md-avatar>
          <div class="md-list-item-text">
            <span><a href="#" target="_blank">{{ }}</a></span>
            <span>{{ }}</span>
            <span>View Comments</span>
          </div>
          <md-button
            class="md-icon-button md-list-action"
          >
            <md-icon class="md-accent">
              delete
            </md-icon>
          </md-button>
        </md-list-item>
        <md-divider class="md-inset" />
      </md-list>
    </md-drawer>

    <!-- Right Drawer -->
    <md-drawer class="md-right" md-fixed :md-active.sync="showRightSidePanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">News Categories</span>
      </md-toolbar>
      <!-- Progress bar -->
      <md-progress-bar v-if="loading" md-mode="indeterminate" />

      <!-- List in Drawer Start -->
      <md-list>
        <md-subheader class="md-primary">
          Categories
        </md-subheader>
        <md-list-item v-for="(newsCategory, i) in newsCategories" :key="i">
          <md-icon>{{ newsCategory.icon }}</md-icon>
          <span class="md-list-item-text">{{ newsCategory.name }}</span>
        </md-list-item>
      </md-list>
    <!-- list in Drawer End -->
    </md-drawer>

    <div class="md-layout-item md-size-95">
      <md-content class="md-layout md-gutter" style="background:#ddd; padding: 1em;">
        <!-- v-for -->
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
                <div>
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
                  {{ headline.publishedAt }}
                  <md-icon class="small-icon">
                    alarm
                  </md-icon>
                </div>
              </md-card-header>

              <md-card-content>{{ headline.description }}</md-card-content>
              <md-card-actions>
                <md-button class="md-icon-button">
                  <md-icon>bookmark</md-icon>
                </md-button>
                <md-button>
                  <md-icon>message</md-icon>
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
import { mapGetters } from 'vuex'
export default {
  async fetch ({ store }) {
    await store.dispatch('headlines/loadHeadlines', '/api/top-headlines?country=us')
  },
  data () {
    return {
      showRightSidePanel: false,
      showLeftSidePanel: false,
      newsCategories: [
        { name: 'トップヘッドライン', path: '', icon: 'today' },
        { name: 'テクノロジー', path: 'technology', icon: 'keyboard' },
        { name: 'ビジネス', path: 'business', icon: 'business_center' },
        { name: 'エンターテイメント', path: 'enterTainment', icon: 'weekend' },
        { name: 'ヘルス', path: 'health', icon: 'fastfood' },
        { name: 'サイエンス', path: 'science', icon: 'fingerprint' },
        { name: 'スポーツ', path: 'sports', icon: 'golf_course' }
      ]
    }
  },
  computed: {
    ...mapGetters('headlines', ['headlines']),
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    changeCountry () {},
    emitEvent (showLeftSidePanel) {
      if (showLeftSidePanel === true) {
        showLeftSidePanel = false
      } else {
        showLeftSidePanel = true
      }
    }
  }

}
</script>

<style scoped>
.small-icon {
    font-size: 18px !important;
  }
  .fixed-toolbar {
    position: fixed;
    top: 0;
    z-index: 5;
  }

</style>
