<template>
  <md-toolbar class="fixed-toolbar" elevation="1">
    <md-button class="md-icon-button" @click="leftToggle">
      <md-icon>menu</md-icon>
    </md-button>
    <nuxt-link class="md-primary md-title" to="/">
      New Nuxt News
    </nuxt-link>
    <div class="md-toolbar-section-end">
      <template v-if="user">
        <md-button>
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
        @click="showRightSidePanel = true"
      >
        検索
      </md-button>
      <md-button>
        カテゴリー
      </md-button>
    </div>
  </md-toolbar>
</template>

<script>
export default {
  data () {
    return {
      showLeftSidePanel: false
    }
  },
  computed: {
    user () {
      return this.$store.getters['auth/user']
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
