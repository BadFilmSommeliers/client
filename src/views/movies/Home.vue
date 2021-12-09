<template>
  <div>
    <div 
      class="backdrop" 
      :style="{
        marginLeft: `-${(windowWidth - 1000) / 2 + 100}px`, 
        marginTop: trigger ? '-13rem': '-16rem'
      }"
    >
      <img 
        v-if="movieBackdropFilePath.length > 40"
        :src="`${movieBackdropFilePath}`" 
        class="backdrop-img" alt="backdrop image"
      >
    </div>
    <home-rec class="mb-4"></home-rec>
    <home-collection class="mb-4"></home-collection>
    <home-review-list class="mb-4"></home-review-list>
    <v-container>
      <v-row>
        <v-col
          v-for="(genreNumber, index) of chosenGenres.slice(0, 4)"
          :key="index"
          cols="6"
          sm="3"
        >
          <home-genre
            :genreNumber="genreNumber"
            :movies="recMovies.recByGenre[genreNumber].movies"
          ></home-genre>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import axios from 'axios'
import HomeRec from '@/components/home/HomeRec'
import HomeCollection from '@/components/home/HomeCollection'
import HomeReviewList from '@/components/home/HomeReviewList'
import HomeGenre from '@/components/home/HomeGenre'


export default {
  name: 'Home',
  components: {
    HomeRec,
    HomeCollection,
    HomeReviewList,
    HomeGenre,
  },
  data: function () {
    return {
      movie: null,
      movieBackdropFilePath: 'https://www.themoviedb.org/t/p/original/',

      windowWidth: null,
      trigger: true,

      isBackDropOn: false,
    }
  },
  props: {
    isUpdatedNeeded: Boolean,
  },
  methods: {
    getMovieBackdrops: function () {
      if (this.recMovies.recByWatched.length > 6) {
        const movie_pk = _.sample(this.recMovies.recByWatched)['pk']
        axios({
          method: 'get',
          url: `https://api.themoviedb.org/3/movie/${movie_pk}/images?api_key=${this.$API_KEY}`
        })
          .then(res => {
            if (this.isBackDropOn === false) {
              const randomNumber = _.random(Math.min(5, res.data.length))
              this.movieBackdropFilePath += res.data.backdrops[randomNumber].file_path
              this.isBackDropOn = true
            }
          })
          .catch(() => {
          })
        }
    },
    handleResize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 768) {
        this.trigger = false
      } else {
        this.trigger = true
      }
    },

  },
  created: function () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.getMovieBackdrops()
  },
  destroyed() {
      window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    ...mapState([
      'recMovies',
      'genrePreference',
      'discoverOption',
      'discoverOptionUpdatedAt',
      'chosenGenres',
      'movieDiscoveredAt',
    ])
  },
  watch: {
    recMovies: {
      handler() {
        if (this.recMovies.recByWatched !== undefined &&this.recMovies.recByWatched.length > 6){
          this.getMovieBackdrops();
        }
      },
      deep: true,
    },
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