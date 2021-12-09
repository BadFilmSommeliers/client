<template>
  <div v-if="isReadyToBeSeen">
    <div class="px-0 d-flex flex-row justify-content-between align-items-center">
      <h4 style="font-weight: 800;">{{ genreName }}</h4>
      <v-icon
        color="rgba(52, 52, 52, 0.5)" 
        class="m-1 mb-2 mt-0"
        style="color: #f7f7eb;"
        small
        @click="getRandomSelectedMovies"
      >
        mdi-refresh
      </v-icon>        
    </div>
    <home-boxoffice-item 
      v-for="(movie) in selectedMovies"
      :key="movie.pk"
      :recMovie="movie"
      class="mb-3"
    >
    </home-boxoffice-item>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import HomeBoxofficeItem from '@/components/home/HomeBoxofficeItem'


export default {
  name: 'HomeGenre',
  components: {
    HomeBoxofficeItem,
  },
  props: {
    genreNumber: String,
    movies: Array,
  },  
  data: function () {
    return {
      dialog: false,
      genreName: null,
      genres : 
        {
          '28': "액션",
          '12': "모험",
          '16': "애니",
          '35': "코미디",
          '80': "범죄",
          '99': "다큐",
          '18': "드라마",
          '10751': "가족",
          '14': "판타지",
          '36': "역사",
          '27': "공포",
          '10402': "음악",
          '9648': "미스터리",
          '10749': "로맨스",
          '878': "SF",
          '10770': "TV 영화", 
          '53': "스릴러",
          '10752': "전쟁",
          '37': "서부",
        },
      selectedMovies: [],
      isReadyToBeSeen: false,
    }
  },
  methods: {
    getRandomSelectedMovies: function () {
      this.selectedMovies = _.sampleSize(this.movies, 3)
      this.isReadyToBeSeen = true
    }
  },  
  created: function () {
    this.genreName = this.genres[this.genreNumber]
    this.isReadyToBeSeen = false
    this.getRandomSelectedMovies()
  },
  computed: {
    ...mapState([
      'movieDiscoveredAt',
    ])
  },
  watch: {
    movieDiscoveredAt: {
      handler() {
        this.getRandomSelectedMovies()
      },
      deep: true
    }
  }
}
</script>

<style>

</style>