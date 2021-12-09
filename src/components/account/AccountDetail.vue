<template>
  <div v-if="userInfo" class="d-flex flex-column align-items-center">
    <div class="somi ps-1 mb-1">
      <!-- 마스코트 -->
      <img 
        v-if="credentialState.is_b_lover && credentialState.is_hipster" 
        src="@/assets/somi/dot.png" 
        alt="somi" 
        style="height: 3rem"
      >      
      <img 
        v-else-if="credentialState.is_b_lover" 
        src="@/assets/somi/3D.png" 
        alt="somi" 
        style="height: 3rem"
      >      
      <img 
        v-else-if="credentialState.is_hipster" 
        src="@/assets/somi/glass.png" 
        alt="somi" 
        style="height: 3rem"
      >      
      <img 
        v-else
        src="@/assets/somi/5.png" 
        alt="somi" 
        style="height: 3rem"
      >      
    </div>
    <div v-if="userPk === userInfo.pk">
      <p class="text-center m-0">아이디 | {{ userInfo.username }}</p>

      <!-- 토글 버튼 -->
      <div class="account-detail-flex-box align-items-center mb-5">
        <v-switch
          v-model="credentialState.is_b_lover"
          inset
          label="B영화"
          @change="changeState"
          hide-details
          color="#c9e5f5"
          class="px-4"
        ></v-switch>
        <v-switch
          v-model="credentialState.is_hipster"
          inset
          label="힙스터"
          @change="changeState"
          hide-details
          color="#c9e5f5"
          class="px-4"
        ></v-switch>
      </div>

      <div class="account-detail-flex-box">
        <!-- 닉네임 수정 -->
        <v-dialog
          v-model="nicknameDialog"
          persistent
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="rgba(52, 52, 52, 0.5)"
              v-bind="attrs"
              v-on="on"
              style="color: #f7f7eb;"
              class="m-1"
              small
            >
              닉네임 수정
            </v-btn>
          </template>
          <v-card> 
            <v-card-title>
              <span style="color: #f7f7eb;" class="text-h5">닉네임 수정</span>
            </v-card-title>
            <v-card-text style="color: #f7f7eb;">
              <v-form 
                ref="form"
                v-model="valid"
                lazy-validation
                class="p-4"
              >
                <v-text-field
                  v-model="credentialNickname.nickname"
                  :rules="nicknameRules"
                  :counter="10"
                  required
                  color="#8ed0f6"
                  @keydown.enter="validateNickname"
                  @keydown="errorNickname=''"
                  :autofocus="true"
                  :error-messages="errorNickname"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="#c9e5f5"
                text
                @click="[nicknameDialog = false]"
              >
                취소
              </v-btn>
              <v-btn
                color="#8ed0f6"
                text
                @click="validateNickname"
              >
                수정
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 닉네임 변경 스낵바 -->
        <v-snackbar
          v-model="nicknameSnackbar"
          color="#1a1a1a"
        >
          닉네임이 수정되었습니다.

          <template v-slot:action="{ attrs }">
            <v-btn
              color="#8ed0f6"
              text
              v-bind="attrs"
              @click="nicknameSnackbar = false"
            >
              닫기
            </v-btn>
          </template>
        </v-snackbar>

        <!-- 비밀번호 변경 -->
        <v-dialog
          v-model="passwordDialog"
          persistent
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="rgba(52, 52, 52, 0.5)"
              v-bind="attrs"
              v-on="on"
              style="color: #f7f7eb;"
              class="m-1"
              small
            >
              비밀번호 변경
            </v-btn>
          </template>
          <v-card> 
            <v-card-title>
              <span style="color: #f7f7eb;" class="text-h5">비밀번호 변경</span>
            </v-card-title>
            <v-card-text style="color: #f7f7eb;">
              <v-form 
                ref="form"
                v-model="valid"
                lazy-validation
                class="p-4"
              >
                <v-text-field
                  v-model="credentialPassword.oldPassword"
                  :rules="passwordRules"
                  label="현재 비밀번호"
                  type="password"
                  required
                  @keyup.enter="validatePassword"
                  :error-messages="errorOldPassword"
                  color="#8ed0f6"
                  :autofocus="true"
                ></v-text-field>
                <v-text-field
                  v-model="credentialPassword.password"
                  :rules="[passwordRules.password]"
                  label="새 비밀번호"
                  type="password"
                  required
                  @keyup.enter="validatePassword"
                  :error-messages="errorPassword"
                  color="#8ed0f6"
                ></v-text-field>
                <v-text-field
                  v-model="credentialPassword.password2"
                  :rules="passwordConfirmationRules"
                  label="새 비밀번호 확인"
                  type="password"
                  required
                  @keyup.enter="validatePassword"
                  color="#8ed0f6"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="#c9e5f5"
                text
                @click="[
                  passwordDialog = false,
                  credentialPassword.oldPassword='', 
                  credentialPassword.password='',
                  credentialPassword.password2=''
                ]"
              >
                취소
              </v-btn>
              <v-btn
                color="#8ed0f6"
                text
                @click="validatePassword"
              >
                변경
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 비밀변호 변경 스낵바 -->
        <v-snackbar
          v-model="passwordSnackbar"
          color="#1a1a1a"
        >
          비밀번호가 변경되었습니다.

          <template v-slot:action="{ attrs }">
            <v-btn
              color="#8ed0f6"
              text
              v-bind="attrs"
              @click="passwordSnackbar = false"
            >
              닫기
            </v-btn>
          </template>
        </v-snackbar>

        <!-- 로그아웃 버튼 -->
        <div class="d-flex flex-column align-items-center">
          <v-btn
            @click.native="logout" 
            style="color: #f7f7eb;"
            color="rgba(52, 52, 52, 0.5)"
            class="m-1"
            small
          >
            로그아웃
          </v-btn>
        </div>
      </div>
    </div>
    <!-- 로딩 오버레이 -->
    <v-overlay
      :z-index="zIndex"
      :value="isLoading"
    >
      <v-btn
        width='400'
      >
        <v-progress-linear
          color="#c9e5f5"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-btn>
    </v-overlay>
    <!-- 로딩 오버레이 끝 -->

  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'


export default {
  name: 'AccountDetail',
  data: function () {
    return {
      zIndex: null,

      clickChangePassword: false,

      credentialNickname : {
        nickname: this.userInfo.nickname,
      },
      credentialPassword : {
        oldPassword: null,
        password: '',
        password2: null,
      },

      valid: true,
      nicknameRules: [
        v => !!v || '변경하실 닉네임을 입력 해주세요.',
        v => (v && v.length <= 10) || '닉네임은 10자 이내로 작성해주세요.',
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
        v => v === this.credentialPassword.password || '비밀번호가 일치하지 않습니다.'
      ],

      errorOldPassword: '',
      errorPassword: [],
      errorNickname: [],

      credentialState: {
        is_hipster: false,
        is_b_lover: false
      },
      isLoading: false,  // 로딩 모달
      nicknameDialog: false,
      nicknameSnackbar: false,
      passwordDialog: false,
      passwordSnackbar: false,
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true,
    }
  },
  methods: {
    edtiNickname: function () {
      const user_pk = this.$route.params.user_pk
      axios({
        method: 'put',
        url: `${this.$serverURL}/accounts/profile/${user_pk}/`,
        data: this.credentialNickname
      })
        .then(res => {
          this.credentialNickname.nickname = res.data.nickname
          this.$store.dispatch('getUserPk')
          this.nicknameSnackbar = true
          this.nicknameDialog = false
        })
        .catch(err => {
          this.errorNickname = err.response.data.error
        })
    },
    changePassword: function () {
      const user_pk = this.$route.params.user_pk
      axios({
        method: 'put',
        url: `${this.$serverURL}/accounts/change_password/${user_pk}/`,
        headers: this.$setToken(),
        data: this.credentialPassword
      })
        .then(() => {
          this.passwordDialog = false
          this.passwordSnackbar = true
        })
        .catch(err => {
          if (err.response.data.oldPassword) {
            this.errorOldPassword = err.response.data.oldPassword.oldPassword
          }
          if (err.response.data.password) {
            this.errorPassword = err.response.data.password
          }
        })
    },
    validateNickname () {
      if (this.$refs.form.validate()) {
        this.edtiNickname()
      }
    },
    validatePassword () {
      if (this.$refs.form.validate()) {
        this.changePassword()
      }
    },
    changeState: function () {
      const user_pk = this.$route.params.user_pk
      this.turnLoadingOverlayOn()
      axios({
        method: 'put',
        url: `${this.$serverURL}/accounts/profile/${user_pk}/`,
        data: this.credentialState
      })
        .then(() => {
          this.updateRec()
        })
        .catch(() => {
        })
    },
    updateRec: function () {
      const token = localStorage.getItem('jwt')
        if (token) {
          this.$store.dispatch('getUserPk')
          this.$store.dispatch('updateDiscoverOption')
        } else {
          this.$store.dispatch('defaultDiscoverOption')
        }
    },
    turnLoadingOverlayOn: function () {
      this.isLoading = true
      setTimeout(() => this.isLoading = false, 1500)
    },
    logout: function () {
      this.$store.dispatch('deleteUserPk')
      localStorage.removeItem('jwt')
      this.$router.push({ name: 'Login' })
    },
  },
  created: function () {
    this.nickname = this.userNickname
    this.credentialState.is_hipster = this.userInfo.is_hipster
    this.credentialState.is_b_lover = this.userInfo.is_b_lover
  },
  computed: {
    ...mapState([
      'userPk',
      'userNickname'
    ])
  }
}
</script>

<style>
.somi {
  width: 30%;
  padding: .5rem;
  text-align: center;
}
</style>