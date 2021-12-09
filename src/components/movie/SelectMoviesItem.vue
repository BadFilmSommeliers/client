<template>
  <div 
    @click="[selected=!selected, selectMovie(movie)]" 
    :class="selected ? 'selected-movie' : ''"
  >
    <img 
      :src="`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${ movie.posterPath }`" 
      alt="poster" 
      class="select-movie-poster">
    <div class="select-movie-title m-1">
      <p class="select-movie-title-text px-6">
        {{ movie.title }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectMovies',
  props: {
    movie: Object
  },
  data: function () {
    return {
      selected: false
    }
  },
  methods: {
    selectMovie: function (movie) {
      this.$emit('select-movie', movie)
    }
  }
}
</script>

<style>
.selected-movie {
  outline: 5px solid;
  border-radius: 0.7rem;
  box-shadow: 0 0 20px #f7f7eb;
}

.select-movie-poster {
  width: 100%;
  height: auto;
  border-radius: 0.7rem;
  transition: all .1s ease-in-out; 
}
.select-movie-title {
  position: absolute;
  margin: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-weight: 800;
  font-size: 16px;
  background: linear-gradient(transparent, #1a1a1a);
  color: #f7f7eb;
  visibility: hidden;
  opacity: 0;
  transition: opacity .3s, visibility .3s;
  text-align: center;
  border-radius: 0.9rem;
  transition: all .3s ease-in-out; 
}
.select-movie-poster-wrap:hover{
  z-index: 9;
  cursor: pointer;
}
.select-movie-poster-wrap:hover .select-movie-title {
  visibility: visible;
  opacity: 1;
}
.select-movie-poster-wrap:hover .select-movie-poster {
  visibility: visible;
  opacity: 1;
}
.select-movie-title-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>