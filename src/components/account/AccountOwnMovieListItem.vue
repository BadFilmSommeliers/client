<template>
  <div v-if="movie" class="col-3 p-1">
    <img 
      :src="`${ movie.poster_path }`" 
      @click="$goToMovieDetail(movie.pk)"
      alt="poster" 
      class="movie-poster"
    >
  </div>
</template>

<script>
import axios from 'axios'


export default {
  name: 'AccountOwnMovieListItem',
  data: function () {
    return {
      movie: null,
    }
  },
  props: {
    moviePk: Number
  },
  methods: {
    getMovie: function () {
      axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + this.moviePk +`?api_key=${this.$API_KEY}&language=ko`,
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
  }
}
</script>

<style>
.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 0.7rem;
  transition: all .2s ease-in-out; 
  cursor: pointer;
}
.movie-poster:hover {
  transform: scale(1.05); 
}
</style>