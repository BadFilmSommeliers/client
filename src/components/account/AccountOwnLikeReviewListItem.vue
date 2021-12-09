<template>
  <div class="row justify-content-center">
    <div class="p-1 p-sm-2 col-3 col-sm-2">
      <img 
        :src="`${ this.moviePosterPath }`" 
        @click="$goToMovieDetail(moviePk)"
        alt="poster" 
        class="own-review-comment-poster me-2"
      >
    </div>
    <div class="p-1 p-sm-2 col-9 col-sm-10">
      <p class="m-0">
        <span @click="$goToAccountDetail(Number(review.user.pk))" class="fw-bold account-id">{{ this.review.user.nickname }}</span>
        <span>님의 </span>
        <span @click="$goToReviewDetail(review.movie, review.pk)" class="fw-bold account-id">{{ movieTitle }} 후기</span>
      </p>
      <div class="d-flex justify-content-between mb-1">
        <star-rating 
          :rating="review.rating"
          :star-size="15"
          :increment="0.5"
          :read-only="true"
          :inline="true"
          text-class="rating-text font-size-14-12"
        >
        </star-rating>
        <span class="mt-1">
          <span class="font-size-14-12">💙 {{ review.like_count }} </span>
          <span class="font-size-14-12">💬 {{ review.comment_count }}</span>
        </span>
      </div>
      <p 
        class="font-size-16-14 stretch m-0 px-1 three-lines account-id" 
        @click="$goToReviewDetail(review.movie, review.pk)"
      >{{ review.content }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'


export default {
  name: 'AccountOwnLikeReviewListItem',
  components: {
    StarRating
  },
  data: function () {
    return {
      moviePk: this.review.movie,
      movieTitle: null,
      moviePosterPath: null,
    }
  },
  props: {
    review: Object
  },
  methods: {
    getMovie: function () {
      axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + this.moviePk +`?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          this.moviePosterPath = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + res.data['poster_path']
          this.movieTitle = res.data['title']
        })
        .catch(() => {
        })
    },
  },
  created: function () {
    this.getMovie()
  },
}
</script>

<style>
.own-review-comment-poster {
  width: 100%;
  height: auto;
  border-radius: 0.3rem;
  transition: all .2s ease-in-out; 
  cursor: pointer;
}
.own-review-comment-poster:hover {
  transform: scale(1.05); 
}
</style>