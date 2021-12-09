<template>
  <div v-if="movie">
    <div class="backdrop" 
      :style="{
        marginLeft: `-${(windowWidth - 1000) / 2 + 100}px`,
        marginTop: trigger ? '-13rem': '-16rem'
      }"
    >
      <img :src="`${movieBackdropFilePath}`" class="backdrop-img" alt="">
    </div>

    <div class="container">
      <div class="row" :style="{ marginTop: trigger ? '3vw': '0vw'}">
        <movie-detail :movie="movie"></movie-detail>
        <div class="col-md-7 col-12">
          <movie-review 
            v-if="!showReviewDetail" 
            :movie="movie" 
            @go-to-review-detail="getReviewDetail"
          ></movie-review>
          <review-detail 
            v-if="showReviewDetail"
            :movie='movie'
            :review-pk="reviewPk"
            @show-review-list="showReviewDetail=false"
          ></review-detail>
          <movie-rec :movie="movie"></movie-rec>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import MovieDetail from '@/components/movie/MovieDetail'
import MovieReview from '@/components/movie/MovieReview'
import MovieRec from '@/components/movie/MovieRec'
import ReviewDetail from '@/components/review/ReviewDetail'


export default {
  name: 'Movie',
  components: {
    MovieDetail,
    MovieReview,
    MovieRec,
    ReviewDetail
  },
  data: function () {
    return {
      movie: null,
      movieBackdropFilePath: 'https://www.themoviedb.org/t/p/original/',
      
      windowWidth: null,
      trigger: true,

      showReviewDetail: false,
      reviewPk: 0,

      movieFromServer: null,
      movieFromAPI: null,
      movieCredits: null,
    }
  },
  methods: {
    getMovie: function () {
      const movie_pk = this.$route.params.movie_pk
      axios({
        method: 'get',
        url: `${this.$serverURL}/movies/${movie_pk}/`
      })
        .then(res => {
          this.movieFromServer = res.data
          if (this.movieFromAPI !== null && this.movieCredits !== null ) {
            this.movieFromServer['cast'] = this.movieCredits
            this.movie = _.merge(this.movieFromServer, this.movieFromAPI)
          }
        })
        .catch(() => {
        })
    },
    getMovieFromTMDB: function () {
      const movie_pk = this.$route.params.movie_pk
      axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + movie_pk +`?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          res.data['poster_path'] = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + res.data['poster_path']
          this.movieFromAPI = res.data
          if (this.movieFromServer !== null && this.movieCredits !== null ) {
            this.movieFromServer['cast'] = this.movieCredits
            this.movie = _.merge(this.movieFromServer, this.movieFromAPI)
          }
        })
        .catch(() => {
          this.$router.push({ name: 'NotFound' })
        })
    },
    getCreditFromTMDB: function () {
      const movie_pk = this.$route.params.movie_pk
      axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + movie_pk +`/credits?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          this.movieCredits = res.data['cast']
          
            if (this.movieFromServer !== null && this.movieFromAPI !== null ) {
              this.movieFromServer['cast'] = this.movieCredits
              this.movie = _.merge(this.movieFromServer, this.movieFromAPI)
            }
        })
        .catch(() => {
        })
    },

    getMovieBackdrops: function () {
      const movie_pk = this.$route.params.movie_pk
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movie_pk}/images?api_key=${this.$API_KEY}`
      })
        .then(res => {
          const randomNumber = _.random(Math.min(5, res.data.length))
          this.movieBackdropFilePath += res.data.backdrops[randomNumber].file_path
          this.$emit('bring-backdrop', this.movieBackdropFilePath)
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
    getReviewDetail: function (review_pk) {
      this.showReviewDetail = true
      this.reviewPk = review_pk
    }
  },
  created: function () {
    const review_pk = this.$route.params.review_pk
    if (review_pk) {
      this.showReviewDetail = true
      this.reviewPk = review_pk
    }
    this.getMovieBackdrops()
    this.getMovieFromTMDB()
    this.getMovie()
    this.getCreditFromTMDB()

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },

  destroyed() {
      window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
.backdrop {
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
  width: 115vw;
}
.backdrop-img {
  mask-image: linear-gradient(to top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%);
  width: 100%;
}
</style>