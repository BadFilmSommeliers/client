<template>
  <div class='container' style="max-width: 1000px;">
    <div class="row justify-content-center">
      <v-text-field
        type='text'
        :autofocus='true'
        color='#8ed0f6'
        @input="changeInput"
        placeholder="영화 제목을 입력해주세요"
        @keyup='[getResult(query), showResults=true]'
        @keyup.enter="showResults=true"
        class='d-flex flex-fill m-1'
        style="max-width: 1000px"
      ></v-text-field>
      <div class="d-flex flex-row justify-content-center">

        <v-btn @click="showResults=true" class="me-2">
          검색
        </v-btn>
        <v-btn @click="cancleDialog">
          취소
        </v-btn>
      </div>
      
      <div v-show="showResults" class='container p-1 search-result'>
        <div v-if="results.length === 0" class="text-center mt-3 mb-2">
          <p class="m-0">검색 결과가 없습니다</p>
        </div>
        <div class='row'>
          <div 
            v-for='(result) in results.slice(0, 18)' 
            :key='result.id'
            class='card col-4 col-sm-3 col-md-2 p-2 justify-content-center movie-poster-wrap'
            style="background-color: transparent;"
          >
            <div @click="goToMovieDetail(result.id)" class="search-movie-poster-wrap">
              <img 
                :src="'https://image.tmdb.org/t/p/w500/' + result.poster_path" width='70px'
                class="search-movie-poster"
                >
              <div class="search-movie-title">
                <p class="search-movie-title-text px-6">
                  {{ result.title }}
                </p>
              </div>
            </div>
       
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'


export default {
  name: 'HomeSearch',
  data () {
    return {
      query: '',
      results: '',
      name: '',
      showResults: true,
      minWidth: true,
      windowWidth: 0,
      trigger: false
    }
  },
  methods: {
    getResult(query) {
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.$API_KEY}&language=ko&query=` + query + '&include_adult=false')
        .then(response => { 
          this.results = response.data.results.filter(
                            function (result) {
                              return result.poster_path
                            }
                          )
        })
    },
    goToMovieDetail: function (movie_pk) {
      this.$emit('close-search')
      this.query = ''
      this.results = ''
      this.$router.push({ name: 'Movie', params: { movie_pk: movie_pk} })
    },
    cancleDialog: function () {
      this.$emit('cancle-dialog')
    },
    changeInput: function (input) {
      this.query = input
    }
  },
  watch: {
    query(newVal) {
      if (!newVal) {
        this.results = ''
      }
    }
  },
}
</script>

<style>
.search-movie-poster-wrap {
  position: relative;
}
.search-movie-poster {
  width: 100%;
  height: auto;
  border-radius: 0.7rem;
  transition: all .2s ease-in-out; 
}
.search-movie-title {
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
.search-movie-poster-wrap:hover .search-movie-title {
  visibility: visible;
  opacity: 1;
}
.search-movie-poster-wrap:hover .search-movie-poster {
  visibility: visible;
  opacity: 1;
  transform: scale(1.1); 
}
.search-movie-title-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>