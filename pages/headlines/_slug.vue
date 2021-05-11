<template>
  <div class="md-layout md-alignment-center" style="margin: 5em 0;">
    <div class="md-layout-item md-size-75 md-small-size-80 md-xsmall-size-100">
      <md-card>
        <md-card-media style="height: 300px;" md-ratio="16:9">
          <img :src="headline.urlToImage" :alt="headline.title">
        </md-card-media>
        <md-card-header>
          <div class="md-title">
            <a :href="headline.url" target="_blank">{{ headline.title }}</a>
          </div>
          <div>
            {{ headline.source.name }}
            <md-icon>book</md-icon>
          </div>
          <span v-if="headline.author" class="md-subhead">
            {{ headline.author }}
            <md-icon>face</md-icon>
          </span>
        </md-card-header>
        <md-card-content>
          {{ headline.content }}
        </md-card-content>
        <md-card-content>
          {{ headline.description }}
        </md-card-content>
      </md-card>
      <!-- コメントForm -->
      <form @submit.prevent="sendComment">
        <md-field>
          <label>コメント</label>
          <md-textarea v-model="text" :disabled="loading || !user">
            <md-icon>description</md-icon>
          </md-textarea>
        </md-field>
        <md-button
          :disabled="loading || !user"
          class="md-primary md-raised"
          type="submit"
        >
          コメントを送信する
        </md-button>
      </form>
      <!-- コメントForm -->
      <!-- コメントの表示 -->
      <md-list class="me-triple-line" style="margin-top: 1em;">
        <md-list-item v-for="comment in headline.comments" :key="comment.id">
          <div class="md-list-item-text" style="font-size: 1em;">
            <span>{{ comment.user.username }}</span>
            <span>{{ comment.published_at |commentTimeToNow}}</span>
            <span>{{ comment.text }}</span>
          </div>
          <md-badge
            class="md-primary"
            md-position="bottom"
            :md-content="comment.likes">
            <md-button
              :disabled="loading || !user"
              class="md-icon-button"
              @click="likeComment(comment.id)"
            >
              <md-icon>
                thumb_up
              </md-icon>
            </md-button>
          </md-badge>
        </md-list-item>
      </md-list>
      <!-- コメントの表示 -->
      <!-- 戻るボタン -->
      <md-button
        class="md-fab md-fab-bottom-right md-fixed md-primary"
        @click="$router.go(-1)"
      >
        <md-icon>arrow_back</md-icon>
      </md-button>
      <!-- 戻るボタン -->
    </div>
  </div>
</template>

<script>
import { uuid } from 'uuidv4'
export default {
  async fetch ({ store, params }) {
    await store.dispatch('headlines/loadHeadline', params.slug)
  },
  data () {
    return {
      text: ''
    }
  },
  computed: {
    headline () {
      return this.$store.getters['headlines/headline']
    },
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters['auth/user']
    }
  },
  methods: {
    sendComment () {
      const comment = {
        id: uuid(),
        text: this.text,
        user: this.getCommentUserData(),
        published_at: Date.now(),
        likes: 0
      }
      this.$store.dispatch('comments/sendComment', comment)
      this.text = ''
    },
    getCommentUserData () {
      const commentUserData = { ...this.user }
      commentUserData.username = commentUserData.email.split('@')[0]
      return commentUserData
    },
    async likeComment (commentId) {
      await this.$store.dispatch('comments/likeComment', commentId)
    }
  }
}
</script>

<style>

</style>
