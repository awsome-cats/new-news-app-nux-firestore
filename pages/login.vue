<template>
  <div class="md-layout md-alignment-center-center" style="height: 100vh;">
    <md-card class="md-layout-item md-size-50">
      <md-progress-bar v-if="loading" md-mode="indeterminate" />
      <md-card-header>
        <div class="md-title">
          ログイン
        </div>
      </md-card-header>
      <form @submit.prevent="validateForm">
        <md-card-content>
          <md-field md-clearable :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input id="email" v-model="form.email" :disabled="loading" name="email" autocomplete="email" />
            <!-- Error Handling To Email -->
            <span v-if="!$v.form.email.required" class="md-error">Emailを入力して下さい</span>
            <span v-else-if="!$v.form.email.email" class="md-error">お使い頂けないEmailです</span>
          </md-field>
          <md-field :class="getValidationClass('password')">
            <label for="password">password</label>
            <md-input id="password" v-model="form.password" :disabled="loading" name="password" autocomplete="password" />
            <!-- Error Handling To Password -->
            <span v-if="!$v.form.password.required" class="md-error">パスワードを入力して下さい</span>
            <span v-else-if="!$v.form.password.minLength" class="md-error">パスワードが短いです</span>
            <span v-else-if="!$v.form.password.maxLength" class="md-error">長すぎるパスワードは使えません</span>
          </md-field>
        </md-card-content>
        <md-card-actions>
          <md-button @click="$router.push('/register')">
            登録
          </md-button>
          <md-button :disabled="loading" class="md-primary md-raised" type="submit">
            送信
          </md-button>
        </md-card-actions>
      </form>
      <md-snackbar :md-active.sync="busy">
        {{ form.email }}でログインしました
      </md-snackbar>
    </md-card>
    <md-button
      class="md-fab md-fab-bottom-right md-fixed md-primary"
      @click="$router.go(-1)"
    >
      <md-icon>arrow_back</md-icon>
    </md-button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  // middleware: 'auth',
  name: 'ProgressBarIndeterminate',
  mixins: [validationMixin],
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      }
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters.user
    },
    busy () {
      return this.$store.getters.busy
    },
    jobDone () {
      return this.$store.getters.jobDone
    }
  },
  watch: {
    user (value) {
      if (value) {
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      }
    }
  },
  methods: {
    validateForm () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loginUser()
      }
    },
    async loginUser () {
      await this.$store.dispatch('loginUser', {
        email: this.form.email,
        password: this.form.password
      })
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    }
  }
}
</script>

<style scoped>
.md-progress-bar {
    margin: 24px;
  }
</style>
