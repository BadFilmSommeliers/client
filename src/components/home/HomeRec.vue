<template>
  <div class="container">
    <div class="px-0 d-flex flex-row justify-content-between align-items-center">
      <h4 style="font-weight: 800;">오늘의 추천 영화</h4>
      <v-icon
        color="rgba(52, 52, 52, 0.5)" 
        @click="getRandomSelectedMovies"
        class="m-1 mb-2 mt-0"
        style="color: #f7f7eb;"
      >
        mdi-refresh
      </v-icon>
    </div>
    <div 
      class="row justify-content-center"
      v-if="RecByLikedUpdatedAt && selectedMovies"
    >
      <home-rec-item
        v-for="(recMovie, index) in selectedMovies"
        :key="`m${recMovie.pk}`"
        :recMovie="recMovie"
        v-show="index < 6"
      >
      <p>{{ recMovie.pk }}</p>
      </home-rec-item>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import HomeRecItem from '@/components/home/HomeRecItem'

export default {
  name: 'HomeRec',
  components: {
    HomeRecItem,
  },
  data: function () {
    return {
      dialog: false,
      selectedMovies: [],
    }
  },
  methods: {
    getRandomSelectedMovies: function () {
      this.selectedMovies = _.sampleSize(this.recMovies.recByWatched, 6)
    }
  },
  computed: {
    ...mapState([
      'recMovies',
      'RecByLikedUpdatedAt',
    ])
  },
  created: function () {
    this.getRandomSelectedMovies()
  },
  watch: {
    RecByLikedUpdatedAt: {
      handler () {
        this.getRandomSelectedMovies()
      }
    }
  }
}
</script>

<style>

</style>