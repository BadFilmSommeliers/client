<template>
  <div v-if="recMovie" @click="getMovieDetail" class="p-1 movie-poster-wrap p-0">
    <img :src="`${ recMovie.poster }`" alt="poster" class="movie-poster">
    <div class="movie-title m-1">
      <p class="movie-title-text px-3 py-0 my-0">
        {{ recMovie.title }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeBoxofficeItem',
  props: {
    recMovie: Object
  },
  methods: {
    getMovieDetail: function () {
      this.$router.push({ name: 'Movie', params: { movie_pk: `${this.recMovie.pk}`} })
    }
  },
  watch: {
    recMovie: {
      handler() {
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style>
.movie-poster-wrap {
  position: relative;
}
.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 0.7rem;
}
.movie-title {
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
}
.movie-poster-wrap:hover .movie-title {
  visibility: visible;
  opacity: 1;
}
.movie-title-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>