<template>
  <div class='container search-to-add-collection-container'>
    <div class="d-flex flex-row justify-content-center align-items-center ">
      <div class="m-3">
        <v-text-field
          type='text'
          v-model='query'
          :autofocus='true'
          placeholder="영화 제목을 입력해주세요."
          @keyup='getResult(query)'
          color="#8ed0f6"
          style="background-color: #1a1a1a;"
        >
        </v-text-field>
      </div>
      <v-btn
        @click="clickCloseButton"
        elevation="2"
        color="#1a1a1a m-3"
      >닫기</v-btn>
    </div>

    <div clas='container'>
      <div class='row m-5'>
        <div 
          v-for='(result) in results' 
          :key='result.id'
          class='card col-4 col-sm-3 col-md-2 col-xxl-1 p-1 justify-content-center movie-poster-wrap'
          style="background-color: transparent;"
          >
          <div @click="addToSelectedMovie($event, result.id, result.poster_path, result.title)">
            <img 
              :src="'https://image.tmdb.org/t/p/w500/' + result.poster_path" width='70px'
              class="movie-poster"
            >
            <div class="movie-title">
              <span class="movie-title-text px-3">
                {{ result.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 스낵바 -->
    <v-snackbar
      v-model="isMovieCartChanged"
      >
      {{ changedMovieTitle }} {{ changeType }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="#8ed0f6"
          text
          v-bind="attrs"
          @click="isMovieCartChanged = false"
        >
          닫기
        </v-btn>
      </template>
    </v-snackbar>


  </div>  
</template>

<script>
import axios from 'axios'


export default {
  name: 'searchToAddCollection',
  props: {
    propedSelectedMovieIds: Array,
    propedSelectedMovieInfos: Array,
    isMovieDeleted: Boolean,
  },
  data () {
    return {
      query: '',
      results: '',
      current_movie_pk: null,
      selected_movie_ids: [],
      selected_movies: [],
      
      isMovieCartChanged: false,
      changedMovieTitle: null, 
      changeType: null,
    }
  },
  methods: {
    getResult(query) {
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.$API_KEY}&language=ko&query=` + query + '&include_adult=false')
        .then(response => { 
          // 포스터가 있는 영화만 호출
          this.results = response.data.results.filter(
                            function (result) {
                              return result.poster_path
                            }
                          )
        })
    },
    addToSelectedMovie (event, result_id, poster_path, title) {
      if (this.selected_movie_ids.includes(result_id) === false) {
        this.showCartSnackbar(title, true)
        this.selected_movie_ids.push(result_id)
        this.selected_movies.push([result_id, poster_path, title])
        this.$emit('added-movie-to-collection', this.selected_movies, this.selected_movie_ids)
        } else {
          this.showCartSnackbar(title, false)
          let id_popped = false
          let movie_popped = false
          for (let i =0; i < this.selected_movie_ids.length; i++) {
            if (id_popped === true && movie_popped === true) {
              break
            }  
            if (this.selected_movie_ids[i] === result_id) {
              this.selected_movie_ids.splice(i, 1)
              id_popped = true
            } 
            if (this.selected_movies[i][0] === result_id) {
              this.selected_movies.splice(i, 1)
              movie_popped = true
            }
          }
          this.$emit('added-movie-to-collection', this.selected_movies, this.selected_movie_ids)
        }
    },
    clickCloseButton: function () {
      this.$emit('click-close-button')
    },

    showCartSnackbar: function (movieTitle, isAdd) {
      if (isAdd === true) {
        this.changedMovieTitle = "'" + movieTitle + "'"
        this.changeType = '를 담았습니다.'
      } else {
        this.changedMovieTitle = "'" + movieTitle + "'"
        this.changeType = '를 삭제했습니다.'      
      } 
      this.isMovieCartChanged = true
    },
  },
  watch: {
    isMovieDeleted: function () {
      if (this.isMovieDeleted === true) {
        this.selected_movies = this.propedSelectedMovieInfos
        this.selected_movie_ids = this.propedSelectedMovieIds
      }
    },
  },
  created: function () {
    if (this.propedSelectedMovieInfos) {
      this.selected_movies = this.propedSelectedMovieInfos
      this.selected_movie_ids = this.propedSelectedMovieIds
    }
  }
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
.search-to-add-collection-container {
  background-color: rgba(26, 26, 26, 0.8); 
  min-height: 90vh; 
  min-width: 90vw;
  border: 3px solid #1a1a1a
}
</style>