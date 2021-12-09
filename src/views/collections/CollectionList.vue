<template>
  <div class="container">
    <div class="backdrop" 
      :style="{
        marginLeft: `-${(windowWidth - 1000) / 2 + 100}px`,
        marginTop: trigger ? '-13rem': '-16rem'
      }"
    >
      <img v-if="movieBackdropFilePath.length > 40" :src="`${movieBackdropFilePath}`" class="backdrop-img" alt="backdrop image">
    </div>
    <div class='row '>
      <div class='d-flex'>
        <h2 style="font-weight: 800;">컬렉션 목록</h2>
        <div style="width: 100px;">
          <v-select
            v-model="selectedOrder"
            :items="order"
            color="#8ed0f6"
            background-color="transparent"
            :hide-details="true"
            :solo="true"
            :flat="true"
            item-color="dark"
            class="pb-3"
            dense
          ></v-select>
        </div>
        <v-spacer></v-spacer>
        <!-- 컬렉션 생성 dialog -->
        <div class="d-flex flex-shrink-1" v-if="userPk">
          <v-dialog
            v-model="dialog"
            fullscreen
            persistent
            hide-overlay
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="rgba(52, 52, 52, 0.5)"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-movie-open-plus</v-icon>
              </v-btn>
            </template>
            <v-card class='container' justify='center' align='center'>
              <v-row class="m-0">
                <v-toolbar>
                  <v-btn
                  icon
                  dark
                  @click="dialog = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  
                  <v-toolbar-title
                  >컬렉션 생성</v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn
                    dark
                    icon
                    @click="clickSave"
                  >
                    <v-icon>mdi-movie-open-check</v-icon>
                  </v-btn>
                </v-toolbar>  

                <create-collection
                  class='mt-5'
                  :createBtnOn = "createBtnOn"
                  style="max-width: 1000px;"
                ></create-collection>
              </v-row>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>
    <div class="row row-cols-2 justify-content-between m-0">
      <home-collection-item
        v-for="(collection, index) in orderedCollections"
        :key="`c${collection.pk}`"
        :collection="collection"
        v-show="startIndex <= index && index < startIndex + indexRange"
        class='p-0 rounded-3 m-1 col col-12 p-0'
        >
      </home-collection-item>
    </div>
    <div class='row justify-content-center'>
      <v-pagination
        v-model="pageNumber"
        :length="parseInt((collectionLength + indexRange - 1) / indexRange)"
        :total-visible="6"
        class="mt-5"
        color="rgba(52, 52, 52, 0.5)"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import HomeCollectionItem from '@/components/home/HomeCollectionItem'
import CreateCollection from '@/components/collection/CreateCollection'


export default {
  name: 'CollectionList',
  components: {
    HomeCollectionItem,
    CreateCollection
  },
  data: function () {
    return {
      pageNumber: 1,
      indexRange: 6,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      collectionLength: 0,
      pageLength: 0,
      dialog: false,
      createBtnOn: false,

      // 백드랍 관련
      windowWidth: null,
      trigger: true,
      movie: null,
      movieBackdropFilePath: 'https://www.themoviedb.org/t/p/original/',

      // 정렬 관련
      orderedCollections: _.orderBy(this.collections, 'created_at', 'desc'),
      selectedOrder: 'recent',
      order: [{text: '최신순', value: 'recent'}, {text: '인기순', value: 'like'}],
    }
  },
  methods: {
    clickSave: function () {
      this.createBtnOn = true
      setTimeout(() => this.createBtnOn = false, 1000)
    },
    getMovieBackdrops: function () {
      if (this.collections.length) {
        const movie_pk = _.sample(this.orderedCollections[0].movies)
        axios({
          method: 'get',
          url: `https://api.themoviedb.org/3/movie/${movie_pk}/images?api_key=${this.$API_KEY}`
        })
          .then(res => {
            const randomNumber = _.random(Math.min(5, res.data.length))
            if (this.movieBackdropFilePath.length == 40) {
              this.movieBackdropFilePath = 'https://www.themoviedb.org/t/p/original/' + res.data.backdrops[randomNumber].file_path
              this.$emit('bring-backdrop', this.movieBackdropFilePath)
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
  computed: {
    ...mapState([
      'collections',
      'userPk'
    ])
  },
  created: function () {
    this.$store.dispatch('loadCollections')
    this.startIndex = (this.pageNumber - 1) * this.indexRange
    this.collectionLength = this.$store.state.collections.length

    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    setTimeout(() => {
      this.orderedCollections = _.orderBy(this.collections, 'created_at', 'desc')
    });
  },
  destroyed() {
      window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    pageNumber: function () {
      this.startIndex = (this.pageNumber - 1) * this.indexRange
    },
    orderedCollections: function () {
      this.getMovieBackdrops()
    },
    selectedOrder: function (val) {
      if (val === 'recent') {
        this.orderedCollections = _.orderBy(this.collections, 'created_at', 'desc')
      } else {
        this.orderedCollections = _.orderBy(this.collections, 'like_count', 'desc')
      }
    }
  },
}
</script>

<style>

</style>