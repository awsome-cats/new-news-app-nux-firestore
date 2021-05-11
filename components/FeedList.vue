<template>
  <div>
    <md-list
      v-for="headline in feed"
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
  </div>
</template>

<script>
export default {
  async fetch ({ store }) {
    await store.dispatch('headlines/loadHeadlines', `/api/top-headlines?country=${store.state.headlines.country}&category=${store.state.headlines.category}`)
    await store.dispatch('feed/loadUserFeed')
  },
  computed: {
    feed () {
      return this.$store.getters['feed/feed']
    }
  }
}
</script>
