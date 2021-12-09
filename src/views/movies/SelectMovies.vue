<template>
  <div class="container position-relative">
    <div>
      <p class="fs-3">
        <img src="@/assets/somi/5.png" alt="somi" style="width: 10%">
        취향 분석을 위해 재밌게 보셨던 영화를 골라주세요!
      </p>
    </div>
    <div class="confirm mb-2" :style="{right: trigger ? `${(windowWidth - 1200) / 2}px` : '1rem'}">
      <v-btn block fab @click="likeEveryMovie" class="select-button" color="#8ed0f6">
        <v-icon color="#343434">mdi-check-bold</v-icon>
      </v-btn>
    </div>
    <div class="row" v-if="exampleMovies.length !== 0">
      <div 
        class="col-md-2 col-6 col-sm-4 select-movie-poster-wrap" 
        v-for="movie in exampleMoviesInfo.slice(0, lastIndex)"
        :key="movie.pk"
      >
        <select-movies-item :movie="movie" @select-movie="selectMovie"></select-movies-item>
      </div>
    </div>
  </div>
</template>

<script>
import exampleMovies from '@/assets/popular_1000_movies'
import axios from 'axios'
import SelectMoviesItem from '@/components/movie/SelectMoviesItem'
import { mapState } from 'vuex'


export default {
  name: 'SelectMovies',
  components: {
    SelectMoviesItem
  },
  data: function () {
    return {
      exampleMoviesInfo: [],
      selectedMovies: {},
      alreadyLikeMovies: [],

      scrolledToBottom: 0,
      lastIndex: 48,

      windowWidth: null,
      trigger: true,
    }
  },
  methods: {
    getMovie: function () {  
      exampleMovies.forEach(movie_pk => {
        axios({
          method: 'get',
          url: `https://api.themoviedb.org/3/movie/${movie_pk}?api_key=${this.$API_KEY}&language=ko`
        })
          .then(res => {
            const movie_genres = []
            for (const genre of res.data['genres']) {
              movie_genres.push(genre['id'])
            }
            const movieInfo = {pk: res.data.id, title: res.data.title, posterPath: res.data.poster_path, movieGenre: movie_genres}
            this.exampleMoviesInfo.push(movieInfo)
          })
          .catch(() => {
          })
      })
    },
    selectMovie: function (movie) {
      const movie_pk = movie['pk']
      if (this.selectedMovies[movie_pk] !== undefined) {
        delete this.selectedMovies[movie_pk]
      } else {
        this.selectedMovies[movie_pk] = movie
      }
    },
    scroll () {  // 무한 스크롤
      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.scrolledToBottom += 1 
        }
      }
    },
    likeMovie: function (movie) {
      const movie_pk = movie['pk']
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/${movie_pk}/like/only/`,
        data: {
          'pk': movie['pk'],
          'poster_path': movie['posterPath'],
          'title': movie['title'],
          'genre_list': movie['movieGenre']
        },
        headers: this.$setToken(),
      })
        .then(() => {
        })
        .catch(() => {
        })
    },
    likeEveryMovie: function () {
      for (let moviePk in this.selectedMovies) {
        const movie = this.selectedMovies[moviePk]
        this.likeMovie(movie)
      }
      this.$router.push({name: 'Home'})
    },
    handleResize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 1200) {
        this.trigger = false
      } else {
        this.trigger = true
      }
    },
  },
  created: function () {
    this.exampleMovies = exampleMovies
    this.getMovie()
    this.scroll()
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    scrolledToBottom: function () {
      this.lastIndex += 48
    }
  },
  computed: {
    ...mapState([
      'userPk',
      'nickname'
    ])
  },
}
</script>

<style>
.select-movie-poster-wrap {
  position: relative;
}
.confirm {
  position: fixed;
  bottom: .3rem;
  z-index: 99;
}
.select-button {
  background: linear-gradient(-45deg, #8ed0f6 0 30%, #f7f7eb 50%);
  box-shadow: 2px 2px 10px 2px #343434 !important;
}
</style>