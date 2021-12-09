<template>
  <div>
    <div 
      class="backdrop" 
      :style="{
        marginLeft: `-${(windowWidth - 1000) / 2 + 100}px`, 
        marginTop: trigger ? '-13rem': '-16rem'
      }"
    >
      <img 
        v-if="movieBackdropFilePath.length > 40"
        :src="`${movieBackdropFilePath}`" 
        class="backdrop-img" 
        alt="backdrop image"
      >
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-12 px-0">
          <account-detail v-if="user_info" :user-info="user_info"></account-detail>
          <div class="d-flex flex-column align-items-center">
            <div v-if="user_info !== null" class="mt-4">
              <p>{{ user_info.nickname }}의 기록</p>
            </div>
            <v-btn-toggle 
              class="btn-toggle account-category-flex-box" 
              mandatory 
              borderless
              style="background-color: rgba(52, 52, 52, 0.5);"
            >
              <v-btn
                plain
                style="color: #f7f7eb;"
                @click="category = 1"
                class="category-item"
              >컬렉션</v-btn>
              <v-btn
                plain
                style="color: #f7f7eb;"
                @click="category = 6"
                class="category-item"
              >좋아한 컬렉션</v-btn>
              <v-btn
                plain
                style="color: #f7f7eb;"
                @click="category = 4"
                class="category-item"
              >평가한 영화</v-btn>
              <v-btn
                plain
                style="color: #f7f7eb;"
                @click="category = 3"
                class="category-item"
              >좋아한 영화</v-btn>
              <v-btn
                plain
                style="color: #f7f7eb;"
                @click="category = 2"
                class="category-item"
              >후기</v-btn>
              <v-btn
                plain
                style="color: #f7f7eb;"
                @click="category = 5"
                class="category-item"
              >좋아한 후기</v-btn>
            </v-btn-toggle>

            <!-- 회원탈퇴 -->
            <v-dialog
              v-model="dialog"
              max-width="290"
              :retain-focus="false"
              :hide-overlay="true"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="user_info && user_info.pk === userPk"
                  small
                  text
                  v-bind="attrs"
                  v-on="on"
                  class="mt-3"
                  color="rgba(247, 247, 235, 0.5)"
                  style="background-color: transparent; min-width: 0;"
                >
                  회원탈퇴
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="fs-6 fw-bold" style="color: #f7f7eb">
                  정말 탈퇴하시겠습니까?
                </v-card-title>
                <v-card-text>삭제된 계정은 복구되지 않습니다.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    @click="dialog = false"
                    style="color: #f7f7eb"
                  >
                    취소
                  </v-btn>
                  <v-btn
                    text
                    @click="[deleteAccount(), dialog = false]"
                    style="color: #8ed0f6"
                  >
                    탈퇴
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <div class="col-md-9 col-12 p-0">
          <account-own :user-info="user_info" :category="category"></account-own>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import { mapState } from 'vuex'
import AccountDetail from '@/components/account/AccountDetail'
import AccountOwn from '@/components/account/AccountOwn'


export default {
  name: 'Account',
  components: {
    AccountDetail,
    AccountOwn
  },
  data: function () {
    return {
      user_info: null,
      category: 1,

      movieBackdropFilePath: 'https://www.themoviedb.org/t/p/original/',
      windowWidth: null,
      trigger: true,

      dialog: false,
    }
  },
  methods: {
    getMovieBackdrops: function () {
      const movie_pk = _.sampleSize(this.user_info.like_movies)[0].pk
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movie_pk}/images?api_key=${this.$API_KEY}`
      })
        .then(res => {
          const randomNumber = _.random(Math.min(5, res.data.length))
          this.movieBackdropFilePath += res.data.backdrops[randomNumber].file_path
        })
        .catch(() => {
        })
    },
    handleResize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 768) {
        this.trigger = false
      } else {
        this.trigger = true
      }
    },
    deleteAccount: function () {
      axios({
        method: 'delete',
        url: `${this.$serverURL}/accounts/profile/${this.userPk}/`,
        headers: this.$setToken(),
      })
        .then(() => {
          this.$store.dispatch('deleteUserPk')
          localStorage.removeItem('jwt')
          this.$router.push({ name: 'Home' })
        })
        .catch(() => {
        })
    }
  },
  created: function () {
    const user_pk = this.$route.params.user_pk
    axios({
      method: 'get',
      url: `${this.$serverURL}/accounts/profile/${user_pk}/`,
      headers: this.$setToken(),
    })
      .then(res => {
        this.user_info = res.data
        this.getMovieBackdrops()
      })
      .catch(() => {
        this.$router.push({ name: 'NotFound' })
      })
    window.scrollTo(0,0)

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
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
.btn-toggle {
  flex-direction: column;
}
.account-detail-flex-box {
  display: flex;
  flex-direction: column;
}
@media (max-width: 767px) {
  .account-detail-flex-box {
    flex-direction: row;
    justify-content: center;
  }
}
.account-category-flex-box {
  display: flex;
  flex-direction: column;
}
@media (max-width: 767px) {
  .account-category-flex-box {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}
@media (max-width: 576px) {
  .category-item {
    margin: 0 5%;
  }
}
</style>