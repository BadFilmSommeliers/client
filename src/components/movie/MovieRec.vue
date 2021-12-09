<template>
  <div 
    v-if="movie"
    class="col">
    <h5>같이 보면 좋은 영화</h5>
    <hr class="m-0">
    <div class="container-fluid px-3 py-1 mb-4">
      <div class="row justify-content-between">
        <movie-rec-item
          v-for="movie in recommendations"
          :key="`s${movie.id}`"
          :movie="movie"
          class="mb-3"
        >
        </movie-rec-item>
      </div>
    </div>

    <h5>{{movie.title}} 같은 영화</h5>
    <hr class="m-0">
    <div class="container-fluid px-3 py-1 mb-5">
      <div class="row justify-content-between">
        <movie-rec-item
          v-for="movie in similarMovies"
          :key="`r${movie.id}`"
          :movie="movie"
        >
        </movie-rec-item>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import MovieRecItem from '@/components/movie/MovieRecItem'


export default {
  name: 'MovieRec',
  components: {
    MovieRecItem
  },
  data: function () {
    return {
      similarMovies: null,
      recommendations: null,
    }
  },
  props: {
    movie: Object
  },
  methods: {
    getRecommendations: function () {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${this.movie.pk}/recommendations` + `?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          this.recommendations = _.sampleSize(res.data['results'], 4)
        })
        .catch(() => {
        })
    }, 
    getSimilarMovies: function () {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${this.movie.pk}/similar` + `?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          this.similarMovies = _.sampleSize(res.data['results'], 4)
        })
        .catch(() => {
        })
    }, 
  },
  created: function () {
    this.getRecommendations()
    this.getSimilarMovies()
  }
}
</script>

<style>

</style>