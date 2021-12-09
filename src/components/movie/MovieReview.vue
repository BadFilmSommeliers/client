<template>
  <div
    v-if="movie" 
    class="col">
    <!-- 나의 후기 수정란 -->
    <div v-if="userReview !== null & editReviewInfo.pk === userReview.pk">
      <h3>나의 후기 수정</h3>
      <hr class="mt-0">
      <div class="movie-review-box">
        <v-textarea
          name="input-7-1"
          filled
          auto-grow
          color="rgba(142, 208, 246, 0.5)"
          v-model="editReviewInfo.content"
          :error-messages="errorMessage"
        ></v-textarea>
        <div class="d-flex flex-row justify-content-between mb-5">
          <div class="m-2">
            <star-rating 
              v-model="editReviewInfo.rating" 
              :star-size="20"
              :increment="0.5"
              :inline="true"
              text-class="rating-text"
            >
            </star-rating>
          </div>
          <div>
            <v-btn
              small
              elevation="2"
              @click="editReview(userReview.pk)"
              class="me-2"
            >
              수정
            </v-btn>
            <v-btn
              small
              elevation="2"
              @click="editReviewInfo.pk = 0"
            >
              취소
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- 나의 후기 -->
    <div v-else class="mb-5">
      <!-- 로그인한 사용자만 접근 가능 -->
      <div v-if="userPk !== null">
        <div v-if="userReview.user">
          <div class="d-flex justify-content-between">
            <h3>나의 후기</h3>
            <div>
              <v-btn
                small
                @click="clickEdit(userReview.pk, userReview.content, userReview.rating)"
                class="me-1"
                color="rgba(52, 52, 52, 0.5)"
              >
                수정
              </v-btn>

              <!-- 삭제  -->
              <v-dialog
                v-model="dialog"
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    color="rgba(52, 52, 52, 0.5)"
                    v-bind="attrs"
                    v-on="on"
                  >
                    삭제
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="fs-6 fw-bold" style="color: #f7f7eb">
                    정말 삭제하시겠습니까?
                  </v-card-title>
                  <v-card-text>삭제된 후기는 복구되지 않습니다.</v-card-text>
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
                      @click="[dialog = false, deleteReview(userReview.pk)]"
                      style="color: #8ed0f6"
                    >
                      삭제
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
        
            </div>
          </div>
          <hr class="mt-0">
          <div 
            v-if="userReview"
            class="movie-review-box">
            <div class="d-flex justify-content-between mb-2">
              <star-rating 
                v-model="userReview.rating" 
                :star-size="15"
                :increment="0.5"
                :read-only="true"
                :inline="true"
                text-class="rating-text"
              >
              </star-rating>
              <span class="mt-1">
                <span class="">💙 {{ userReview.like_count }} </span>
                <span class="">💬 {{ userReview.comment_count }}</span>
              </span>
            </div>
            <p class="m-0">{{ userReview.content | truncate(255, '...') }}
              <span @click="goToReviewDetail(userReview.movie, userReview.pk)" class="float-right blue-text">더보기</span>
            </p>
          </div>
        </div>
        
        <!-- 후기 작성란 -->
        <div v-else>
          <h3>나의 후기 작성</h3>
          <hr class="m-0">
          <v-textarea
            name="input-7-1"
            filled
            auto-grow
            color="rgba(142, 208, 246, 0.5)"
            v-model="reviewContent"
            :error-messages="errorMessage"
          ></v-textarea>
          <div class="d-flex flex-row justify-content-between">
            <div class="m-2">
              <star-rating 
                v-model="reviewRating" 
                :star-size="20"
                :increment="0.5"
                :inline="true"
                text-class="rating-text"
              >
              </star-rating>
            </div>
            <v-btn
              elevation="2"
              @click="createReview"
              color="rgba(52, 52, 52, 0.5)"
              style="color: #f7f7eb;"
            >
              작성
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- 후기 목록 -->
    <div class="d-flex flex-row justify-content-between">
      <p class="font-size-20-18 m-0">다른 사람들의 후기</p>
      <div style="width: 100px;">
        <v-select
          v-model="selectedOrder"
          :items="order"
          color="#8ed0f6"
          background-color="transparent"
          :hide-details="true"
          :solo="true"
          :flat="true"
          item-color="dark"
          class="m-0 p-0"
          dense
        ></v-select>
      </div>

    </div>
    <hr class="mt-0">

    <!-- 다른 사람들의 후기가 없을 경우 출력 문구 -->
    <p v-if="movie.reviews.length == 0 || (movie.reviews.length == 1 && movie.reviews[0].user.pk == userPk)">작성된 후기가 없습니다.</p>
    
    <div v-else class="mb-5 pb-5">
      <div
        v-for="(review, index) in orderedReviews" 
        :key="review.pk"
        v-show="startIndex <= index && index < startIndex + indexRange"
      >
        <!-- 내 후기 빼고 다른 사람들의 후기 출력 -->
        <div v-if="review.user.pk !== userPk" class="movie-review-box mt-2">
          <p class="m-0 d-flex flex-row justify-content-between">
            <span>
              <span 
                @click="$goToAccountDetail(review.user.pk)" 
                class="fw-bold account-id">{{ review.user.nickname }}
              </span>
              님의 후기
            </span>
            
            <span class="font-size-12">{{ review.created_at.slice(0, 10) }}</span>
          </p>
          <div class="d-flex justify-content-between mb-1">
            <star-rating 
              v-model="review.rating" 
              :star-size="15"
              :increment="0.5"
              :read-only="true"
              :inline="true"
              text-class="rating-text"
            >
            </star-rating>
            <span class="mt-1">
              <span class="">💙 {{ review.like_count }} </span>
              <span class="">💬 {{ review.comment_count }}</span>
            </span>
          </div>
          <p class="m-0">{{ review.content | truncate(250, '...')  }}
            <span @click="goToReviewDetail(review.movie, review.pk)" class="float-right blue-text">더보기</span>
          </p>
        </div>
      </div>
      <v-pagination
        v-model="pageNumber"
        :length="parseInt((moviesLength + indexRange - 1) / indexRange)"
        :total-visible="7"
        color="#343434"
        class="mt-2"
      ></v-pagination>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'

export default {
  name: 'MovieReview',
  components: {
    StarRating,
  },
  props: {
    movie: Object
  },
  data: function () {
    return {
      userReview: {},

      editReviewInfo: {
        pk: 0, 
        content: null, 
        rating: null
      },

      reviewContent: null,
      reviewRating: null,
      errorMessage: '',

      dialog: false,

      pageNumber: 1,
      indexRange: 4,
      moviesLength: this.movie.reviews.length,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      pageLength: 0,

      orderedReviews: _.orderBy(this.movie.reviews, 'created_at', 'desc'),
      selectedOrder: 'recent',
      order: [{text: '최신순', value: 'recent'}, {text: '인기순', value: 'like'}],
    }
  },
  methods: {
    createReview: function () {
      const movie_pk = this.$route.params.movie_pk
      const movie_genres = []
      for (const genre of this.movie['genres']) {
        movie_genres.push(genre['id'])
      }
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/${movie_pk}/review/`,
        data: {
          'movie_title': this.movie['title'],
          'genre_list': movie_genres,
          'poster_path': this.movie.poster_path.slice(51),
          'content': this.reviewContent,
          'rating': this.reviewRating
        },
        headers: this.$setToken()
      })
        .then(() => {
          this.getUserReview(this.userPk)
        })
        .catch(err => {
          if (err.response.data.content && err.response.data.content.rating) {
            this.errorMessage = '내용을 작성하시고 별점을 선택해주세요.'
          } else if (err.response.data.content) {
            this.errorMessage = '내용을 작성해주세요.'
          } else {
            this.errorMessage = '별점을 선택해주세요.'
          }
        })
    },
    goToReviewDetail: function (movie_pk, review_pk) {
      history.pushState(
        {},
        null,
        `/movie/${movie_pk}/` + review_pk
      )
      this.$emit('go-to-review-detail', review_pk)
    },
    clickEdit: function (pk, content, rating) {
      this.editReviewInfo = {pk, content, rating}
    },
    editReview: function (review_pk) {
      const movie_genres = []
      for (const genre of this.movie['genres']) {
        movie_genres.push(genre['id'])
      }
      axios({
        method: 'put',
        url: `${this.$serverURL}/movies/review/${review_pk}/`,
        data: {
          'genre_list': movie_genres,
          'content': this.editReviewInfo.content,
          'rating': this.editReviewInfo.rating
        },
        headers: this.$setToken()
      })
        .then(() => {
          this.editReviewInfo.pk = null
          this.getUserReview()
        })
        .catch(() => {
        })
    },
    getUserReview: function () {
      const movie_pk = this.$route.params.movie_pk
      axios({
        method: 'get',
        url: `${this.$serverURL}/movies/${movie_pk}/review/user/${this.userPk}/`,
        headers: this.$setToken()
      })
        .then(res => {
          if (res.data) {
            this.userReview = res.data
          }
        })
        .catch(() => {
        })
    },
    deleteReview: function (review_pk) {
      const movie_genres = []
      for (const genre of this.movie['genres']) {
        movie_genres.push(genre['id'])
      }
      axios({
        method: 'delete',
        url: `${this.$serverURL}/movies/review/${review_pk}/`,
        data: {
          'genre_list': movie_genres,
        },
        headers: this.$setToken()
      })
        .then(() => {
          this.userReview.user = null
          this.reviewContent = null
          this.reviewRating = null
        })
        .catch(() => {
        })
    },
  },
  computed: {
    ...mapState([
      'userPk',
      'nickname'
    ]),
  },
  created: function () {
    this.startIndex = (this.pageNumber - 1) * this.indexRange
    this.getUserReview()
  },
  filters: {
    truncate: function(text, length, clamp){
        clamp = clamp || '...';
        var node = document.createElement('div');
        node.innerHTML = text;
        var content = node.textContent;
        return content.length > length ? content.slice(0, length) + clamp : content;
    }
  },
  watch: {
    pageNumber: function () {
      this.startIndex = (this.pageNumber - 1) * this.indexRange
    },
    selectedOrder: function (val) {
      if (val === 'recent') {
        this.orderedReviews = _.orderBy(this.movie.reviews, 'created_at', 'desc')
      } else {
        this.orderedReviews = _.orderBy(this.movie.reviews, 'like_count', 'desc')
      }
    }
  }
}
</script>

<style>
.rating-text {
  font-weight: bold;
  padding-top: 4px;
  color: #999;
}
.movie-review-box {
  background-color: rgba(52, 52, 52, 0.5);
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 1px 2px #1a1a1a;
}
.theme--dark.v-list {
  background: #343434 !important; 
}
.v-list-item__title {
  color: #f7f7eb !important;
}
.v-select.v-input--dense .v-select__selection--comma {
  color: #f7f7eb !important;
}
</style>