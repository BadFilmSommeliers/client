<template>
  <v-container class="justify-content-center">
    <v-col
      justify="center"
      align="center"
    >
      <v-carousel
        cycle
        :interval="6000"
        hide-delimiters
        :show-arrows="false"
        :height="trigger ? '260': '180'"
      >
        <v-carousel-item
          transition="fade-transition"
          reverse-transition="fade-transition"
          v-for="image in images" :key="image"
        >
          <v-img
            :src="require(`@/assets/logo/${image}`)"
            max-width="400"
          >
          </v-img>
        </v-carousel-item>
      </v-carousel>

      <v-col
        md="4"
        align="center"
        justify="center"
      >
        <v-form 
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="credentials.username"
            :rules="idRules"
            label="아이디"
            required
            :error-messages="errorMessage"
            color="#8ed0f6"
            @keydown="errorMessage=''"
            :autofocus="true"
          ></v-text-field>
          <v-text-field
            v-model="credentials.password"
            :rules="passwordRules"
            type="password"
            label="비밀번호"
            required
            color="#8ed0f6"
            @keyup.enter="validate"
            :error-messages="errorMessage"
            @keydown="errorMessage=''"
          ></v-text-field>
        </v-form>
        <v-btn
          elevation="2"
          class="my-3"
          @click="validate"
        >로그인</v-btn>
      </v-col>
      <v-btn
        text
        :to="{ name: 'Signup' }"
      >
        회원가입
      </v-btn>
    </v-col>
  </v-container>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Login',
  data: function () {
    return {
      credentials: {
        username: null,
        password: null,
      },
      valid: true,
      idRules: [
        v => !!v || '아이디를 입력해주세요',
      ],
      passwordRules: [
        v => !!v || '비밀번호를 입력해주세요',
      ],
      errorMessage: '',

      images: _.shuffle(["best_with_bg.png", "bad_with_bg.png", "hip_with_bg.png"]),
      windowWidth: null,
      trigger: true,
    }
  },
  methods: {
    login: function () {
      axios({
        method: 'post',
        url: `${this.$serverURL}/accounts/api-token-auth/`,
        data: this.credentials
      })
        .then((res) => {
          localStorage.setItem('jwt', res.data.token)
          this.$store.dispatch('getUserPk')

          // 가입 후 리다이렉트 되었다면 로그인 후 영화 선택으로 이동
          if (this.$route.params.just_signup === 'welcome') {
            this.$router.push({ name: 'SelectMovies' })
          } else {
            // 로그인 시 영화 탐색 옵션 업데이트 
            this.$store.dispatch('updateDiscoverOption')
            this.$router.push({ name: 'Home' })
          }
        })
        .catch(err => {
          if (err.response.data) {
            this.errorMessage = '아이디 또는 비밀번호가 일치하지 않습니다'
          }
        })
    },
    validate () {
      this.$refs.form.validate()
      this.login()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    handleResize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 400) {
        this.trigger = false
      } else {
        this.trigger = true
      }
    },
  },
  created: function () {
    window.scrollTo(0,0)

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
</style>