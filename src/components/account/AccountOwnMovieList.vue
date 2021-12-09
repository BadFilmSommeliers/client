<template>
  <div v-if="reviewSet" class="row justify-content-center">
    <div class="px-0 d-flex flex-row justify-content-between align-items-center">
      <h3 class="ps-0 mb-0">평가한 영화</h3>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="rgba(52, 52, 52, 0.5)" 
            v-bind="attrs"
            v-on="on"
            class="m-1"
          >
            전체보기
          </v-btn>
        </template>
        <v-card flat color="#1a1a1a">
          <v-toolbar
            color="#1a1a1a"
            dense
          >
            <v-btn
              text
              color="#f7f7eb"
              @click="dialog = false"
            >
              I AM THE BEST FILM SOMMELIER
            </v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>

          <div class="container pb-3 mb-3">
            <div class="row">
              <account-own-like-movie-list-item-all
                v-for="(review, index) in reviewSet.slice().reverse()"
                :key="index"
                :movie-pk="review.movie"
              >
              </account-own-like-movie-list-item-all>
            </div>
          </div>

        </v-card>
      </v-dialog>
    </div>
    <hr>
    <account-own-movie-list-item
      v-for="(review, index) in reviewSet.slice().reverse()"
      :key="index"
      :movie-pk="review.movie"
      v-show="startIndex <= index && index < startIndex + indexRange"
    >
    </account-own-movie-list-item>
    <v-pagination
      v-model="pageNumber"
      :length="parseInt((moviesLength + indexRange - 1) / indexRange)"
      :total-visible="7"
      color="#343434"
    ></v-pagination>
  </div>
</template>

<script>
import AccountOwnMovieListItem from '@/components/account/AccountOwnMovieListItem'
import AccountOwnLikeMovieListItemAll from '@/components/account/AccountOwnLikeMovieListItemAll'

export default {
  name: 'AccountOwnMovieList',
  components: {
    AccountOwnMovieListItem,
    AccountOwnLikeMovieListItemAll
  },
  data: function () {
    return {
      pageNumber: 1,
      indexRange: 24,
      moviesLength: 0,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      pageLength: 0,

      dialog: false,
    }
  },
  props: {
    reviewSet: Array
  },
  created: function () {
    this.startIndex = (this.pageNumber - 1) * this.indexRange
    this.moviesLength = this.reviewSet.length
  },
  watch: {
    pageNumber: function () {
      this.startIndex = (this.pageNumber - 1) * this.indexRange
    }
  }
}
</script>

<style>

</style>