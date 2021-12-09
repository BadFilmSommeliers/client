<template>
  <div class='container p-0'>
    <div class='d-flex'>
      <v-text-field
        type="text"
        id="createCollection"
        v-model="collectionTitle"
        class='d-flex flex-grow-1'
        placeholder="  컬렉션 제목"
        color="#8ed0f6"
      ></v-text-field>
    </div>
    <div class="d-flex flex-grow-1 flex-wrap">
      <v-textarea
        name="collectionContentbox"
        id="collectionContent" 
        cols="30" rows="10"
        class='d-flex flex-grow-1'
        placeholder="컬렉션 내용"
        outlined
        v-model="collectionContent"
        color="#8ed0f6"
        ></v-textarea>
    </div>
    <div class="d-flex justify-content-between">
      <v-btn 
        class='d-flex flex-grow-1 m-0' 
        @click="toggleMovieTitles">
        영화 목록  
        <span v-if="isMovieTitleSeen">
          닫기
        </span>
        <span v-else>
          펼치기
        </span>
        </v-btn>
      <!--  모달 띄우기  -->
      <v-dialog
        v-model="dialog"
        :fullscreen="$vuetify.breakpoint.mobile"
        >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            v-bind="attrs"
            v-on="on"
          >
            🛒
          </v-btn>
        </template>

        <search-to-add-collection
          @added-movie-to-collection="updateMoviePks"
          :isMovieDeleted="isMovieDeleted"
          :propedSelectedMovieIds="selectedMovieIds"
          :propedSelectedMovieInfos="selectedMovieCards"
          @click-close-button="dialog=false"
        >
        </search-to-add-collection>
      </v-dialog>
    </div>
    <v-card
      v-if="isMovieTitleSeen"
      class='row m-0'
    >
      <div
        v-for="(movieCard, index) in selectedMovieCards"
        :key="movieCard[0]"
        class='row justify-content-end p-0 mt-2 mb-2'
      >
        <v-col>{{ index + 1 }}. {{ movieCard[2] }}</v-col>
        <v-btn 
          class='col col-1 p-0'
          @click="clickMovieDelete(movieCard)"
          >삭제</v-btn>
      </div>
    </v-card>

    <!-- 담은 영화 보여주는 곳 -->
    <v-card
      v-if="isSelectedMovie"
      outlined
      class='container row row-cols-5 m-0'
      >
      <div
        v-for="(movieInfo) in selectedMovieCards"
        :key='movieInfo.id'
        class="col col-2 p-1 m-0 movie-poster-wrap"
        @click="clickMovieDelete(movieInfo)"
      >
        <img 
          v-bind:src="'http://image.tmdb.org/t/p/w500/' + movieInfo[1]" 
          class="card-img-top movie-poster" 
          alt="poster">
        <div class="movie-title">
          
          <span class='movie-title-text'>
            '{{ movieInfo[2] }}'
            지우기
          </span>
        </div>
      </div>
    </v-card>
    
    <!-- 스낵바 -->
    <v-snackbar
      v-model="emptyFieldWarning"
      >
      {{ warningText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="#8ed0f6"
          text
          v-bind="attrs"
          @click="emptyFieldWarning = false"
        >
          닫기
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import SearchToAddCollection from '../search/SearchToAddCollection.vue'

export default {
  name: 'CreateCollection',
  props: {
    collection: Object,
    movie_cards: Array,
    updateBtnOn: Boolean,
    createBtnOn: Boolean,
  },
  components: {
    SearchToAddCollection,
  },
  data: function () {
    return {
      collectionTitle: null,
      collectionContent: null,
      selectedMovieIds: [],
      selectedMovieCards: [],
      isSelectedMovie: false,

      dialog: false,
      collectionPk: 0,

      emptyFieldWarning: false,
      warningText: null,

      isMovieDeleted: false,
      isMovieTitleSeen: false,
    }
  },
  methods: {
    createCollection: function () {
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/collection/`,
        data: {
          'title': this.collectionTitle,
          'content': this.collectionContent,
          'movie_infos': this.selectedMovieCards,
        },
        headers: this.$setToken()
      })
        .then(res => {
          this.$goToCollectionDetail(res.data.pk)
        })
        .catch(() => {
          this.showWarnSnackbar()
        })
    },
    updateCollection: function (collection_pk) {
      axios({
        method: 'PUT',
        url: `${this.$serverURL}/movies/collection/${collection_pk}/`,
        data: {
          'title': this.collectionTitle,
          'content': this.collectionContent,
          'movie_pks': this.selectedMovieIds,
        },
        headers: this.$setToken()
      })
        .then(() => {
          this.$router.go()
        })
        .catch(() => {
          this.showWarnSnackbar()
        })
    },
    showWarnSnackbar: function () {
      if (this.collectionTitle == null || this.collectionTitle.length == 0) {
        this.warningText = '제목을 입력하세요.'
      } else if (this.collectionTitle.length >= 150) {
        this.warningText = '제목은 150자 이내로 입력해주세요.'
      } else if (this.collectionContent == null || this.collectionContent.length == 0) {
        this.warningText = '내용을 입력하세요.' 
      } else if (this.selectedMovieIds == false || this.selectedMovieIds.length == 0) {
        this.warningText = '영화를 선택하세요.'
      }
      this.emptyFieldWarning = true
    },
    clickMovieDelete: function (movie_info) {

      let id_popped = false
      let movie_popped = false
      const deletingMovieId = movie_info[0]

      for (let i =0; i < this.selectedMovieIds.length; i++) {
        if (id_popped === true && movie_popped === true) {
          break
        }  
        if (this.selectedMovieIds[i] === deletingMovieId) {
          this.selectedMovieIds.splice(i, 1)
          id_popped = true
        } 
        if (this.selectedMovieCards[i][0] === deletingMovieId) {
          this.selectedMovieCards.splice(i, 1)
          movie_popped = true
        }
      }
      setTimeout(() => this.isMovieDeleted = true, 100)
      setTimeout(() => this.isMovieDeleted = false, 500)
    },
    updateMoviePks: function (selected_movies, selected_movie_ids) {
      this.selectedMovieCards = selected_movies
      this.selectedMovieIds = selected_movie_ids
      if (this.selectedMovieCards === null) {
        this.isSelectedMovie = false
      } else {
        this.isSelectedMovie = true
      }
    },
    toggleMovieTitles: function () {
      this.isMovieTitleSeen = !this.isMovieTitleSeen
    },
    pushMovieCard: function (movie_info) {
      const moviePk = movie_info.pk
      const moviePosterPath = movie_info.poster_path
      const movieTitle = movie_info.title      
      this.selectedMovieCards.push([moviePk, moviePosterPath, movieTitle])
    },
  },
  computed: {
    ...mapState([
      'userPk'
    ])
  },
  created: function () {
    // 만약 collection 프롭 데이터를 받았다면, 
    //  컬렉션의 이전 정보들을 전부 가져와서 '담은 영화들'에 표시한다.
    if (this.collection) {
      this.collectionTitle = this.collection.title
      this.collectionContent = this.collection.content
      this.selectedMovieIds = this.collection.movies
      this.collectionPk = this.collection.pk
      this.movie_cards.forEach( element => 
        this.pushMovieCard(element)
      )
      this.isSelectedMovie = true
    }
  },
  watch: {
    createBtnOn: function () {
      if (this.createBtnOn === true) {
        this.createCollection()
      }
    },
    updateBtnOn: function () {
      if (this.updateBtnOn === true) {
        this.updateCollection(this.collection.pk)
      }
    },
  },
}

</script>

<style>
.movie-title {
  position: absolute;
  margin: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, black);
  color: #fff;
  visibility: hidden;
  opacity: 0;
  transition: opacity .2s, visibility .2s;
  text-align: center;
}
.movie-title-text {
  position: absolute;
  bottom: 1.2rem;
  left: 0;
  right: 0;
}
</style>