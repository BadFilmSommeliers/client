<template>
  <div v-if="movie" class="row justify-content-center">
    <!-- 후기란 -->
    <div class="p-1 p-sm-2 col home-review-list-item-review align-self-center">
      <img 
        :src="`${ movie.poster_path }`" 
        @click="$goToMovieDetail(movie.pk)"
        alt="poster" 
        class="review-movie-poster float-left w-25 m-3"
      >
      <div class="p-3 home-review-list-item-review-text" @click="$goToReviewDetail(movie.pk, review.pk)">
        <div class="text-truncate">
          <span class="font-size-18-16 fw-bold">{{ movie.title }}</span>
          <hr class="my-1">
        </div>
        <span @click="$goToAccountDetail(review.user.pk)" class="font-size-14-12 fw-bold">{{ review.user.nickname }}</span>
        <div class="d-flex justify-content-between mb-2">
          <star-rating 
            v-model="review.rating" 
            :star-size="15"
            :increment="0.5"
            :read-only="true"
            :inline="true"
            text-class="rating-text font-size-14-12"
          >
          </star-rating>
          <span class="mt-1">
            <span class=" font-size-14-12">💙 {{ review.like_count }} </span>
            <span class=" font-size-14-12">💬 {{ review.comment_count }}</span>
          </span>
        </div>
        <p class="mb-0 font-size-16-14 stretch three-lines">{{ review.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'

export default {
  name: 'HomeReviewListItem',
  components: {
    StarRating
  },
  data: function () {
    return {
      movie: null
    }
  },
  props: {
    review: Object
  },
  methods: {
    getMovie: function () {
      const moviePk = this.review.movie
      axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + moviePk +`?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          res.data['poster_path'] = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + res.data['poster_path']
          res.data['pk'] = res.data['id']
          this.movie = res.data
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
.home-review-list-item-review {
  border-radius: 1.5rem;
  background-clip: content-box;
  background-color: rgba(52, 52, 52, 0.5);

  transition: all .2s ease-in-out; 
}
.home-review-list-item-review:hover {
  transform: scale(1.05); 
}
.home-review-list-item-review-text {
  cursor: pointer;
}
.review-movie-poster {
  width: 100%;
  border-radius: 0.3rem;
  transition: all .2s ease-in-out; 
  cursor: pointer;
}
.review-movie-poster:hover {
  transform: scale(1.1); 
}
.rating-text {
  font-weight: bold;
  padding-top: 4px;
  color: rgba(247, 247, 235, 0.5);
}
</style>