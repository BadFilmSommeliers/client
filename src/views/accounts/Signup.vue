<template>
  <v-container>
    <v-col
      align="center"
      justify="center"
    >
      <v-carousel
        cycle
        :interval="10000"
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
      >
        <v-form 
          ref="form"
          v-model="valid"
          lazy-validation
          class="login-form"
        >
          <v-text-field
            v-model="credentials.username"
            :rules="idRules"
            label="아이디"
            required
            @keydown="errorMessage=''"
            @keyup.enter="validate"
            :error-messages="errorMessage"
            color="#8ed0f6"
            :autofocus="true"
          ></v-text-field>
          <v-text-field
            v-model="credentials.nickname"
            :rules="nicknameRules"
            :counter="10"
            label="닉네임"
            @keyup.enter="validate"
            required
            color="#8ed0f6"
          ></v-text-field>
          <v-text-field
            v-model="credentials.password"
            :rules="[passwordRules.password]"
            label="비밀번호"
            type="password"
            required
            @keyup.enter="validate"
            color="#8ed0f6"
          ></v-text-field>
          <v-text-field
            v-model="credentials.passwordConfirmation"
            :rules="passwordConfirmationRules"
            label="비밀번호 확인"
            type="password"
            required
            @keyup.enter="validate"
            color="#8ed0f6"
          ></v-text-field>
        </v-form> 
        <v-btn
          elevation="2"
          :disabled="!valid"
          class="mr-4 mt-3"
          @click="validate"
        >가입</v-btn>
      </v-col>
    </v-col>
  </v-container>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Signup',
  data: function () {
    return {
      credentials : {
        username: null,
        nickname: null,
        password: null,
        passwordConfirmation: null,
        },

      valid: true,
      idRules: [
        v => !!v || '아이디를 입력해주세요.',
      ],
      nicknameRules: [
        v => !!v || '닉네임을 입력해주세요.',
        v => (v && v.length <= 10) || '닉네임은 10자 이하여야 합니다',
      ],
      passwordRules: {
        required: value => !!value || "비밀번호를 입력해주세요.",
        password: value => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
          return (
            pattern.test(value) ||
            "비밀번호는 8자를 넘으며 숫자, 영문 대문자, 특수 문자를 포함해야 합니다."
          );
        }
      },
      passwordConfirmationRules: [
        v => !!v || '비밀번호를 다시 입력해주세요.',
        v => v === this.credentials.password || '비밀번호가 일치하지 않습니다.'
      ],
      errorMessage: '',

      images: _.shuffle(["best_with_bg.png", "bad_with_bg.png", "hip_with_bg.png"]),
      windowWidth: null,
      trigger: true,
    }
  },
  methods: {
    signup: function () {
      axios({
        method: 'post',
        url: `${this.$serverURL}/accounts/signup/`,
        data: this.credentials
      })
        .then(() => {
          this.$router.push({name: 'Login', params: {just_signup: 'welcome',}})
        })
        .catch(err => {
          if (err.response.data.username) {
            this.errorMessage = '이미 사용중인 아이디입니다.'
          }
        })
    },
    validate () {
      if (this.$refs.form.validate()) {
        this.signup()
      }
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
