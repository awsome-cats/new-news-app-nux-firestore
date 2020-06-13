<template>
  <div class="md-layout md-alignment-center-center" style="height: 100vh;">
    <md-card class="md-layout-item md-size-50">
      <md-progress-bar v-if="loading" md-mode="indeterminate" />
      <md-card-header>
        <div class="md-title">
          登録
        </div>
      </md-card-header>
      <form @submit.prevent="validateForm">
        <md-card-content>
          <!-- here-->
          <md-field md-clearable :class="getValidationClass('name')">
            <label for="name">name</label>
            <md-input
              id="name"
              v-model="form.name"
              :disabled="loading"
              name="name"
              autocomplete="name"
            />
            <!-- Error Handling To Email -->
            <span v-if="!$v.form.name.required" class="md-error">nameを入力して下さい</span>
            <span v-else-if="!$v.form.name.name" class="md-error">お使い頂けないnameです</span>
          </md-field>
          <!-- here-->

          <md-field md-clearable :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              id="email"
              v-model="form.email"
              :disabled="loading"
              name="email"
              autocomplete="email"
            />
            <!-- Error Handling To Email -->
            <span v-if="!$v.form.email.required" class="md-error">Emailを入力して下さい</span>
            <span v-else-if="!$v.form.email.email" class="md-error">お使い頂けないEmailです</span>
          </md-field>
          <md-field :class="getValidationClass('password')">
            <label for="password">password</label>
            <md-input
              id="password"
              v-model="form.password"
              type="password"
              :disabled="loading"
              name="password"
              autocomplete="password"
            />
            <!-- Error Handling To Password -->
            <span v-if="!$v.form.password.required" class="md-error">パスワードを入力して下さい</span>
            <span v-else-if="!$v.form.password.minLength" class="md-error">パスワードが短いです</span>
            <span v-else-if="!$v.form.password.maxLength" class="md-error">長すぎるパスワードは使えません</span>
          </md-field>
        </md-card-content>
        <md-card-actions>
          <md-button @click="$router.push('/login')">
            ログイン
          </md-button>
          <md-button :disabled="busy" class="md-primary md-raised" type="submit">
            送信
          </md-button>
        </md-card-actions>
        <md-snackbar :md-active.sync="error" md-persistent>
          {{ error }}
        </md-snackbar>
      </form>

      <!-- <md-snackbar :md-active.sync="isAuthenticated">
        {{ form.email }}が登録されました
      </md-snackbar> -->
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
  name: 'ProgressBarIndeterminate',
  // middleware: 'auth',
  mixins: [validationMixin],
  data () {
    return {
      form: {
        name: '',
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
      name: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
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
    error () {
      return this.$store.getters.error
    },
    busy () {
      return this.$store.getters.busy
    },
    jobDone () {
      return this.$store.getters.jobDone
    }
  },
  watch: {
    jobDone (value) {
      if (value) {
        this.$store.commit('setJobDone')
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
        this.jobsDone()
      }
    }
  },
  methods: {
    validateForm () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.registerUser()
      }
    },
    async registerUser () {
      await this.$store.dispatch('registerUser', {
        email: this.form.email,
        password: this.form.password,
        name: this.form.name
      })
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    removeErrors () {
      this.$store.commit('clearError')
    },
    jobsDone () {
      this.removeErrors()
      // push
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped>
 .md-progress-bar {
    margin: 24px;
  }

</style>
