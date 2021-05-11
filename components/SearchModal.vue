<template>
  <md-dialog :md-active.sync="dialog">
    <md-dialog-title>{{ text }}</md-dialog-title>
    <div class="md-layout" style="padding: 1em;">
      <md-field>
        <label>検索用語</label>
        <md-input
          v-model="query"
          placeholder="完全に一致する場合は引用符を使用し、複数の用語にはAND/OR/NOTを使用します"
          max-length="30"
        />
      </md-field>
      <md-datepicker
        v-model="fromDate"
        md-immediately
      >
        <label>開始日を選ぶ</label>
      </md-datepicker>
      <md-datepicker
        v-model="toDate"
        md-immediately
      >
        <label>終了日を選ぶ</label>
      </md-datepicker>

      <md-field>
        <label for="sortBy">条件で検索結果を並べ替える</label>
        <md-select
          id="sortBy"
          v-model="sortBy"
          name="sortBy"
          md-dense
        >
          <md-option value="publishedAt">
            新着
          </md-option>
          <md-option value="relevancy">
            関連
          </md-option>
          <md-option value="popularity">
            人気
          </md-option>
        </md-select>
      </md-field>
    </div>
    <md-dialog-actions>
      <md-button class="md-accent" @click="close()">
        Cancel
      </md-button>
      <md-button class="md-primary" @click="searchHeadlines">
        検索
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      query: '',
      fromDate: '',
      toDate: '',
      sortBy: '',
      text: '検索する'
    }
  },
  methods: {
    searchHeadlines () {
      this.$emit('inputQuery', this.query, this.fromDate, this.toDate, this.sortBy)
      this.query = ''
      this.fromDate = ''
      this.toDate = ''
      this.sortBy = ''
    },
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>

<style>

</style>
