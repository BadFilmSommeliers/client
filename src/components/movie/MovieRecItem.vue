<template>
  <div v-if="movie.poster_path" class="col-3 p-1 recommend-movie-poster-wrap" @click="$goToMovieDetail(movie.id)">
    <img 
      :src="`https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${ movie.poster_path }`" 
      alt="poster" 
      class="recommend-movie-poster"
    >
    <div class="recommend-movie-title m-1">
      <p class="recommend-movie-title-text">
        {{ movie.title }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieRecItem',
  props: {
    movie: Object
  },
}
</script>

<style>
.similar-movie-poster {
  width: 100%;
  height: auto;
  border-radius: 0.3rem;
}
.recommend-movie-poster-wrap {
  position: relative;
  cursor: pointer;
}
.recommend-movie-poster {
  width: 100%;
  height: auto;
  border-radius: 0.7rem;
  transition: all .2s ease-in-out; 
}
.recommend-movie-title {
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
  transition: opacity .2s, visibility .2s;
  text-align: center;
  border-radius: 0.7rem;
  transition: all .2s ease-in-out; 
  transform: scale(1.1); 
}
.recommend-movie-poster-wrap:hover .recommend-movie-title {
  visibility: visible;
  opacity: 1;
}
.recommend-movie-poster-wrap:hover .recommend-movie-poster {
  visibility: visible;
  opacity: 1;
  transform: scale(1.1); 
}
.recommend-movie-title-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>