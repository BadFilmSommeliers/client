<template>
  <div class="search">
    <h1>Search</h1>
    <input type='text' v-model='query' @keyup='getResult(query)'>
    <div clas='container'>
      <div class='row row-cols-6'>
      <div 
        v-for='(result) in results' 
        :key='result.id'
        >
        <div class='card' @click="addToSelectedMovie($event, result.id)">
          <p>{{result.title}}</p>
          <img v-bind:src="'https://image.tmdb.org/t/p/w500/' + result.poster_path" width='100px'>
        </div>
      </div>
      </div>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'


export default {
  name: 'search',
  data () {
    return {
      query: '',
      results: '',
      current_movie_pk: null,
      selected_movies: [],
    }
  },
  methods: {
    getResult(query) {
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.$API_KEY}&language=ko&query=` + query + '&include_adult=false').then(response => { this.results = response.data.results })
    },
    addToSelectedMovie (event, result_id) {
      this.selected_movies.push(result_id)
    },
  },
}
</script>

<style>

</style>