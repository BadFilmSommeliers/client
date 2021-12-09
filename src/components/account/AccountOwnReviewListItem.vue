<template>
  <div v-if="movie" class="row justify-content-center">
    <div class="p-1 p-sm-2 col-3 col-sm-2">
      <img 
        :src="`${ movie.poster_path }`" 
        @click="$goToMovieDetail(movie.pk)"
        alt="poster" 
        class="own-review-poster me-2"
      >
    </div>
    <div class="p-1 p-sm-2 col-9 col-sm-10">
      <p @click="$goToMovieDetail(movie.pk)" class="m-0 account-id">
        <span class="font-size-16-14 fw-bold">{{ movie.title }}</span>
      </p>
      <div class="d-flex justify-content-between mb-1">
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
          <span class="font-size-14-12">💙 {{ review.like_count }} </span>
          <span class="font-size-14-12">💬 {{ review.comment_count }}</span>
        </span>
      </div>
      <p class="font-size-16-14 stretch m-0 three-lines account-id" @click="$goToReviewDetail(review.movie, review.pk)">{{ review.content }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'

export default {
  name: 'AccountOwnReviewListItem',
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
  watch: { 
    review: function() { 
      this.getMovie()
    }
  }
}
</script>

<style>
.review-list-item-movie-poster {
  width: 100%;
  height: auto;
  border-radius: 0.3rem;
  float: left;
}
.review-list-item-movie-poster:hover {
  box-shadow: 0px 0px 15px 0px black;  
}
@media (min-width: 300px) {
.review-list-item-movie-poster {
    width: 100%;
  }
}
.own-review-poster {
  width: 100%;
  height: auto;
  border-radius: 0.3rem;
  transition: all .2s ease-in-out; 
  cursor: pointer;
}
.own-review-poster:hover {
  transform: scale(1.05); 
}
</style>