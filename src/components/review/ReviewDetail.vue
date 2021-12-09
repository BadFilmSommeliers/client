<template>
  <div v-if="review.pk" class="col">
    <!-- 후기 수정란 -->
    <div v-if="editReviewInfo.pk === review.pk" class="review-box">
      <div>
        <span class="fw-bold">{{ review.user.nickname }}</span>
      </div>
      <v-textarea
        name="input-7-1"
        filled
        label="후기를 수정하세요."
        auto-grow
        color="rgba(142, 208, 246, 0.5)"
        v-model="editReviewInfo.content"
      ></v-textarea>
      <div class="d-flex justify-content-between">
        <star-rating 
          v-model="editReviewInfo.rating" 
          :star-size="15"
          :increment="0.5"
          text-class="rating-text"
        >
        </star-rating>
        <div>
          <!-- 수정중일 때 -->
          <v-btn
            small
            elevation="2"
            class="me-2"
            @click="editReview(review.pk)"
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

    <!-- 나의 후기 출력 -->
    <div v-else class="review-box">
      <div v-if="review.user.pk === userPk" class="row justify-content-between mb-2 align-items-center">
        <div class="fs-6 col-12 col-lg-6 py-0">
          <span @click="$goToAccountDetail(review.user.pk)" class="fw-bold account-id">{{ review.user.nickname }}</span>
          <span class="align-baseline lh-lg">님의 후기</span>
        </div>
        
        <!-- 수정, 삭제 버튼 -->
        <div class="col-12 col-lg-6 py-0">
          <div class="d-flex flex-row justify-content-end">
            <span class="font-size-12 me-2 pt-1">{{review.created_at | prettyDate}}</span>
            <v-btn
              elevation="2"
              @click="clickEdit(review.pk, review.content, review.rating)"
              small
              color="rgba(52, 52, 52, 0.5)"
              class="me-1"
            >수정</v-btn>

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
                    @click="deleteReview(review.pk)"
                    style="color: #8ed0f6"
                  >
                    삭제
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>

      <p v-else class="m-0 d-flex justify-content-between">
        <span>
          <span @click="$goToAccountDetail(review.user.pk)" class="fw-bold account-id">
            {{ review.user.nickname }}
          </span>
          님의 후기
        </span>
        <span>{{review.created_at | prettyDate}}</span>
      </p>

      <div class="d-flex justify-content-between mb-1 pe-2">
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
          <v-tooltip 
            bottom :disabled="userPk != null"
            color='#343434'
            >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                text
                class="write-review-button"
                v-bind="attrs"
                v-on="on"
                @click="likeReview(review.pk)"
              >
                <span v-if="like === true">💙</span>
                <span v-else>🤍</span>
              </v-btn>        
            </template>
            <span color="#f7f7eb">좋아요를 누르시려면 로그인을 해주세요!</span>
          </v-tooltip>
          <span class="">{{ this.like_count }} </span>
          <span class=""> 💬 {{ review.comment_count }}</span>
        </span>
      </div>
      <p class="mb-0" style="white-space: pre-line">{{ review.content }}</p>
    </div>
    <hr>

    <review-detail-comment :review-pk="review.pk"></review-detail-comment>
    <v-btn 
      @click="showReviewList(review.movie)"
      small
      class="mb-5"
    >
      목록
    </v-btn>

  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'
import ReviewDetailComment from '@/components/review/ReviewDetailComment'


export default {
  name: 'ReviewDetail',
  components: {
    ReviewDetailComment,
    StarRating
  },
  props: {
    movie: Object,
    reviewPk: [String, Number],
  },
  data: function () {
    return {
      review: {},
      movie_pk: null,

      editReviewInfo: {
        pk: null, 
        content: null, 
        rating: null
      },

      like: null,
      like_count: null,

      dialog: false,
    }
  },
  methods: {
    getReviews: function () {
      const review_pk = this.reviewPk
      axios({
        method: 'get',
        url: `${this.$serverURL}/movies/review/${review_pk}/`
      })
        .then(res => {
          this.review = res.data
        })
        .catch(() => {
        })
    },
    deleteReview: function (review_pk) {
      const movie_genres = []
      for (const genre of this.movie.genres) {
        movie_genres.push(genre['id'])
      }
      axios({
        method: 'delete',
        url: `${this.$serverURL}/movies/review/${review_pk}/`,
        headers: this.$setToken(),
        data: {
          'genre_list': movie_genres,
        },
      })
        .then(() => {
          this.showReviewList()
        })
        .catch(() => {
        })
    },
    clickEdit: function (pk, content, rating) {
      this.editReviewInfo = {pk, content, rating}
    },
    editReview: function (review_pk) {
      const movie_genres = []
      for (const genre of this.movie.genres) {
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
          this.getReviews()
        })
        .catch(() => {
        })
    },
    likeReview: function (review_pk) {
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/review/${review_pk}/like/`,
        headers: this.$setToken()
      })
        .then(res => {
          this.like = res.data.like
          this.like_count = res.data.like_count
        })
        .catch(() => {
        })
    },
    showReviewList: function (movie_pk) {
      history.pushState(
        {},
        null,
        `/movie/${movie_pk}`
      )
      this.$emit('show-review-list')
    }
  },
  computed: {
    ...mapState([
      'userPk',
      'nickname'
    ])
  },
  created: function () {
    // 후기 정보 호출
    const review_pk = this.reviewPk
    axios({
      method: 'get',
      url: `${this.$serverURL}/movies/review/${review_pk}/`
    })
      .then(res => {
        this.review = res.data
        this.movie_pk = res.data.movie

        // 좋아요 정보 초기 설정
        this.like_count = res.data.like_count
        if (res.data.like_users.includes(this.userPk)) {
          this.like = true
        } else {
          this.like = false
        }
      })
      .catch(() => {
        this.$router.push({ name: 'NotFound' })
      })
  },
  filters: {
    prettyDate: function (value) {
      const date = value.slice(0, 10)
      const time = value.slice(11, 16)
      return date + ' ' + time
    }
  }
}
</script>

<style>
.review-box {
  background-color: rgba(52, 52, 52, 0.7);
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 1px 2px #1a1a1a;
}
</style>