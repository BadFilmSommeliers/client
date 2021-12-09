<template>
  <div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import axios from 'axios'


export default {
  name: 'RecManager',
  data: function () {
    return {
    alreadyRecdMovies: {},
    }
  },
  methods: {
    selectMovieByGenre: function () {
      const favoriteGenres = this.genrePreference.slice(0, 6)
      const pickedGenres = _.sampleSize(favoriteGenres, 4)

      for (const genreObject of pickedGenres)  {
        const genreNumber = genreObject[0]
        this.$store.dispatch('setRecByGenre', genreNumber)
      }

      this.sendGenreQueryByPage(pickedGenres)
    },
    selectMovieByLiked: function () {
      const likedMovies = _.sampleSize(this.likedMovies, 4)
      for (let pageNumber = 1; pageNumber < 4; pageNumber ++) {
        for (const moviePk of likedMovies) {
          this.queryMovieByLiked(moviePk, pageNumber)
        } 
      }
    },
    sendGenreQueryByPage: function (pickedGenres) {
      for (let pageNumber = 1; pageNumber < 25; pageNumber ++) {
        for (const genreObject of pickedGenres)  {
          const genreNumber = genreObject[0]
          this.queryMovieByGenre(genreNumber, pageNumber)
        }
      }
    },
    queryMovieByGenre: function (genreNum, pageNum) {
      const genreNumStr = genreNum.toString()
      const page_number = pageNum
      axios({
        method: 'get',
        url: 
        'https://api.themoviedb.org/3/discover/movie?'
        + `api_key=${this.$API_KEY}`
        + '&language=ko-KR'
        + '&sort_by=popularity.desc'
        + '&include_adult=false'
        + '&include_video=false'
        + `&page=${page_number}`
        + `&vote_count.gte=${this.discoverOption.vote_cnt_min}`
        + `&vote_count.lte=${this.discoverOption.vote_cnt_max}`
        + `&vote_average.gte=${this.discoverOption.vote_avg_min}`
        + `&vote_average.lte=${this.discoverOption.vote_avg_max}`
        + `&with_genres=${genreNumStr}`
        + `&with_watch_monetization_types=flatrate`
      })
        .then(res => {
          this.parseGenreMovieBySearchOption(genreNum, pageNum, res.data['results'])
        })
        .catch(() => {
        })
    },
    queryMovieByLiked: function (movieNum, pageNum) { 
      const page_number = pageNum
      axios({
        method: 'get',
        url: 
        `https://api.themoviedb.org/3/movie/${movieNum}/similar?`
        + `api_key=${this.$API_KEY}`
        + '&language=ko-KR'
        + `&page=${page_number}`
      })
        .then(res => {
          this.parseSimliarToLikedMovies(res.data['results'])
        })
        .catch(() => {
        })
    },
    parseGenreMovieBySearchOption: function (genreNumber, pageNumber, discoveredResult) {
      for (const movieInfo of discoveredResult) {
        const movieId = movieInfo['id'].toString()
        if (this.watchedMovies[movieId] === undefined 
            && this.alreadyRecdMovies[movieId] === undefined) {
          const movieCard = {
            pk: movieInfo['id'],
            poster: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + movieInfo['poster_path'],
            title: movieInfo['title']
          }
          const payload = {
            'movieCard': movieCard,
            'genreNumber': genreNumber,
          }

          if (this.recMovies.recByGenre[genreNumber].movies.length < 50) {
            this.$store.dispatch('loadRecMovieCardByGenre', payload)
            this.alreadyRecdMovies[movieId] = true
          }
        } 
      }
    },
    parseSimliarToLikedMovies: function (discoveredResult) {

        const voteCntMin = this.discoverOption.vote_cnt_min
        const voteCntMax = this.discoverOption.vote_cnt_max
        const voteAvgMin = this.discoverOption.vote_avg_min
        const voteAvgMax = this.discoverOption.vote_avg_max

      for (const movieInfo of discoveredResult) {
        const movieId = movieInfo['id'].toString()
        if (this.watchedMovies[movieId] === undefined 
            && this.alreadyRecdMovies[movieId] === undefined
            && +movieInfo['vote_average'] <= voteAvgMax
            && +movieInfo['vote_average'] >= voteAvgMin
            && +movieInfo['vote_count'] >= voteCntMin
            && +movieInfo['vote_count'] <= voteCntMax
            ) {
          const movieCard = {
            pk: movieInfo['id'],
            poster: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + movieInfo['poster_path'],
            title: movieInfo['title']
          }
          const payload = {
            'movieCard': movieCard,
          }

          if (this.recMovies.recByWatched.length < 50) {
            this.$store.dispatch('loadRecMovieCardByWatched', payload)
            this.alreadyRecdMovies[movieId] = true
          }
        } 
      }
    },
  },
  computed: {
    ...mapState([
      'recMovies',
      'genrePreference',
      'watchedMovies',
      'discoverOption',
      'discoverOptionUpdatedAt',
      'likedMovies'
    ]),
  },
  watch: {
    discoverOptionUpdatedAt: {
      handler() {
        this.selectMovieByLiked()
        this.selectMovieByGenre()
      },
      immediate: true
    }
  }
}
</script>

<style>

</style>