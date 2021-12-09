import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPk: null,
    userNickname: null,
    recMovieGenres: Array,
    recMovies: {
      recByWatched: [],
      recByGenre: Object    
    },
    // 샘플 형태   -> 12/03 업데이트
    // recMovies:  {
    //   rec_by_wat ched : [ {pk:영화pk, poster:영화포스터, title:제목} ,,,   ]
    //   rec_by_genre :  [ {genre_num: 장르번호, 
    //                      updated_at: null,
    //                      last_searched_page: null,
    //                      movies: [{pk:영화pk, poster:영화포스터, title:제목}]} 
    //                    [] [] []  ]
    // }
    collections: [],
    genrePreference: Array,
    watchedMovies: Object,
    discoverOption: {
      'vote_avg_min': 6.5,
      'vote_avg_max': 10,
      'vote_cnt_min': 1000,
      'vote_cnt_max': 2**30,
    },
    discoverOptionUpdatedAt: null,
    chosenGenres: [],
    alreadyRecdMovies: Object,

    movieDiscoveredAt: null,
    serverURL: process.env.VUE_APP_SERVER_URL,

    likedMovies: Array,
    RecByLikedUpdatedAt: null,
  },
  mutations: {
    GET_USER_PK: function (state, data) {
      state.userPk = data["pk"]
      state.userNickname = data["nickname"]
    },
    DELETE_USER_PK: function (state) {
      state.userPk = null
    },
    LOAD_REC_COLLECTION: function (state, data) {
      state.collections = data
    },
    UPDATE_DISCOVER_OPTION: function(state, data) {
      // B급 영화 팬들 
      if (data['is_b_lover'] === true) {
        state.discoverOption.vote_avg_max = 6.5
        state.discoverOption.vote_avg_min = 0
      } else {
        state.discoverOption.vote_avg_max = 10
        state.discoverOption.vote_avg_min = 6.5
      }
      // 힙스터 영화 팬들 
      if (data['is_hipster'] === true) {
        state.discoverOption.vote_cnt_max = 3000
        state.discoverOption.vote_cnt_min = 150
      } else {
        state.discoverOption.vote_cnt_max = 2**30
        state.discoverOption.vote_cnt_min = 1000
      }

      const sortedGenres = Object.entries(data['genre_preference'])
        .sort(([, a], [, b]) => b - a);

      state.watchedMovies = data['watched_movies']
      state.genrePreference = sortedGenres
      state.likedMovies = data['liked_movies']
      state.discoverOptionUpdatedAt = Date.now()
      if (state.recMovies.recByWatched) {
        state.recMovies.recByWatched = []
      } 
      state.recMovies.recByGenre = new Object
      state.chosenGenres = []
    },
    SET_REC_BY_GENRE: function(state, genreNumber) {
      if (state.recMovies.recByGenre[genreNumber] === undefined) {
        const genreString = genreNumber.toString()
        state.chosenGenres.push(genreString)
        state.recMovies.recByGenre[genreString] = {
          movies: [],
        }
      }
    },
    LOAD_REC_MOVIE_CARD_BY_GENRE: function (state, payload) {
      const movieCard = payload['movieCard']
      const genreNumber = payload['genreNumber']
      state.recMovies.recByGenre[genreNumber].movies.push(movieCard)
      state.movieDiscoveredAt = Date.now()
    },
    LOAD_REC_MOVIE_CARD_BY_WATCHED: function (state, payload) {
      const movieCard = payload['movieCard']
      state.recMovies.recByWatched.push(movieCard)
      state.RecByLikedUpdatedAt = Date.now()
    },
  },
  actions: {
    getUserPk: function ({state, commit}) {
      const token = localStorage.getItem('jwt')
      const config = {
        Authorization: `JWT ${token}`
      }
      axios({
        method: 'get',
        url: `${state.serverURL}/accounts/get-user/`,
        headers: config
      })
        .then((res) => {
          commit('GET_USER_PK', res.data)
        })
        .catch(() => {
        })
    },
    deleteUserPk: function ({commit}) {
      commit('DELETE_USER_PK')
    },

    loadCollections: function ({state, commit}) {
      axios({
        method: 'get',
        url: `${state.serverURL}/movies/collection/`,
      })
        .then((res) => {
          commit('LOAD_REC_COLLECTION', res.data)
        })
        .catch(() => {
        })
    },
    updateDiscoverOption: function ({state, commit}) {  
      const token = localStorage.getItem('jwt')
      const config = {
        Authorization: `JWT ${token}`
      }
      axios({
        method: 'get',
        url: `${state.serverURL}/accounts/get-base-info-for-rec/`,
        headers: config
      })
        .then((res) => {
          commit('UPDATE_DISCOVER_OPTION', res.data)
        })
        .catch(() => {
        })
    },
    defaultDiscoverOption: function ({commit}) {  
      const data = {
        'is_b_lover': true,
        'is_hipster': false,
        'genre_preference': {
          '28': 1,
          '12': 1,
          '80': 1, 
          '27': 1,
          '14': 1,
          '878': 1,
          '53': 1,
        },
        'watched_movies': {},
        // 더 룸, 외계로부터의 9호 계획, 그린 랜턴, 록호쇼, 
        // 이블데드, 아쿠아맨2018, 죽여줘 제니퍼
        'liked_movies': [10513, 36685, 17473, 44912, 764, 297802, 43593, 19994],
      }
      commit('UPDATE_DISCOVER_OPTION', data)
    },
    setRecByGenre: function ({commit}, genreNumber) {
      commit('SET_REC_BY_GENRE', genreNumber)
    },
    loadRecMovieCardByGenre: function ({commit}, payload) {
      commit('LOAD_REC_MOVIE_CARD_BY_GENRE', payload)
    },
    loadRecMovieCardByWatched: function ({commit}, payload) {
      commit('LOAD_REC_MOVIE_CARD_BY_WATCHED', payload)
    },
  },
})