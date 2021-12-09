<template>
  <div
    v-if="movie"
    class="col-md-5 col-12 mb-3">
    <div class="d-flex flex-column p-2">
      <img :src="`${ movie.poster_path }`" alt="poster" class="detail-poster">
      <div class="p-1">
        <span @click="goToMovieDetail(movie.pk)" class="movie-detail-title-text account-id fs-1">{{ movie.title }}</span>
        <p>📅 {{ movie.release_date }} 개봉</p>
        <div class="mb-1">
          <v-btn small color="#343434" @click="openMovieWindow(movie.pk)">
            TMDB
          </v-btn>
          <span> 평가 {{ movie.vote_average }} / 10</span>
        </div>
        
        <!-- 북마크 -->
        <!-- <div class="my-3">
          <v-dialog
            v-model="bookmarkDialog"
            max-width="600px"
          >
            <template v-slot:activator="{ on: dialog, attrs }">
              <v-tooltip right :disabled="userBookmark === false" color="#343434">
                <template v-slot:activator="{ on: tooltip }">
                  <v-icon
                    v-if="userBookmark"
                    class="icon-color"
                    v-bind="attrs"
                    v-on="{ ...dialog, ...tooltip}"
                    left
                  >
                    mdi-bookmark-check-outline
                  </v-icon>
                  <v-icon
                    v-else
                    class="icon-color"
                    v-bind="attrs"
                    v-on="{ ...dialog, ...tooltip}"
                    left
                  >
                    mdi-bookmark-outline
                  </v-icon>
                </template>
                <span>{{ userBookmark.content }}</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">북마크</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-if="userBookmark"
                  v-model="userBookmark.content"
                ></v-text-field>
                <v-text-field
                  v-else
                  label="메모"
                  v-model="bookmarkContent"
                ></v-text-field>
              </v-card-text>
              <v-card-actions v-if="userBookmark">
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="[bookmarkDialog = false, deleteBookmark(movie.pk)]"
                >
                  삭제
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="[bookmarkDialog = false, updateBookmark(movie.pk)]"
                >
                  수정
                </v-btn>
              </v-card-actions>
              <v-card-actions v-else>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="bookmarkDialog = false"
                >
                  취소
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="[bookmarkDialog = false, createBookmark(movie.pk)]"
                >
                  생성
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <span class="me-2">{{movie.movie_serializer.bookmark_count}}</span>
          <v-icon class="disable-icon-color" left>
            mdi-text-box-outline
          </v-icon>
          <span class="pb-2">{{movie.reviews.length}}</span>
        </div> -->
        <div class="lh-lg">
          <v-tooltip 
            bottom :disabled="userPk != null"
            color='#343434'
            >
            <template v-slot:activator="{ on, attrs }">
              <!-- <v-btn 
                icon
                v-if="this.like" 
                @click="likeMovie(movie, movie.genres)"
                class="pb-0"
              >
                💙
              </v-btn> -->
              <v-btn
                icon
                @click="likeMovie(movie, movie.genres)"
                class="pb-0"
                v-bind="attrs"
                v-on="on"
              >
              <span v-if="like === true">💙</span>
              <span v-else>🤍</span>
              </v-btn>        
            </template>
            <span color="#f7f7eb">좋아요를 누르시려면 로그인을 해주세요!</span>
          </v-tooltip>
<!-- 
          <v-btn 
            icon
            v-if="!this.like"
            @click="likeMovie(movie, movie.genres)"
            class="pb-0"
          >
            🤍
          </v-btn> -->
          <span class="me-4">{{like_count}}</span>
          <span class="me-2">📝</span>
          <span 
            v-if='movie.reviews'
            class="pb-2">{{movie.reviews.length}}</span>
        </div>
        <div>
          <v-btn
            small
            color="#343434"
            v-for="genre in movie.genres"
            :key="genre.id"
            class="movie-detail-genre-text mb-2 ms-0 me-2"
            @click="openGenreWindow(genre.id)"
          >
            {{ genre.name }}
          </v-btn>
        </div>
        <div class="mb-3">
          <v-btn
            small
            color="#343434"
            v-for="cast in movie.cast.slice(0, 6)"
            :key="cast.id"
            class="movie-detail-genre-text mb-1 ms-0 me-2 text-capitalize"
            @click="openCastWindow(cast.id)"
          >
            {{ cast.name }}
          </v-btn>
          <p class="movie-detail-overview-text">{{ movie.overview }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'MovieDetail',
  data: function () {
    return {
      like: null,
      like_count: null,

      bookmarkDialog: false,
      userBookmark: {},
      bookmarkContent: '',
    }
  },
  props: {
    movie: Object
  },
  methods: {
    goToMovieDetail: function (movie_pk) {
      if (this.$route.path !== `/movie/${movie_pk}`) {
        this.$router.push({name: 'Movie', params: {movie_pk: movie_pk}})
      }
    },
    likeMovie: function (movie, movieGenre) {
      const movie_pk = movie.pk
      const movie_genres = []
      for (const genre of movieGenre) {
        movie_genres.push(genre['id'])
      }
      
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/${movie_pk}/like/`,
        data: {
          'title': movie.title,
          'movie_genre': movie_genres,
          'poster_path': movie.poster_path.slice(51),
        },
        headers: this.$setToken()
      })
        .then(res => {
          this.like = res.data.like
          this.like_count = res.data.like_count
        })
        .catch(err => {
          console.log(err)
        })
    },
    openMovieWindow: function (movie_pk) {
      window.open(`https://www.themoviedb.org/movie/${movie_pk}`)
    },
    openGenreWindow: function (genre_pk) {
      window.open(`https://www.themoviedb.org/genre/${genre_pk}/movie`)
    },
    openCastWindow: function (cast_pk) {
      window.open(`https://www.themoviedb.org/person/${cast_pk}`)
    },
    // createBookmark: function (movie_pk) {
    //   axios({
    //     method: 'post',
    //     url: `${this.$serverURL}/movies/${movie_pk}/bookmark/`,
    //     headers: this.$setToken(),
    //     data: {
    //       'content': this.bookmarkContent,
    //     },
    //   })
    //     .then(() => {
    //       this.bookmarkContent = ''
    //       this.getUserBookmark()
    //     })
    //     .catch(() => {
    //     })
    // },
    // updateBookmark: function (movie_pk) {
    //   axios({
    //     method: 'put',
    //     url: `${this.$serverURL}/movies/${movie_pk}/bookmark/`,
    //     headers: this.$setToken(),
    //     data: {
    //       'content': this.userBookmark.content,
    //     },
    //   })
    //     .then(() => {
    //     })
    //     .catch(() => {
    //     })
    // },
    // deleteBookmark: function (movie_pk) {
    //   axios({
    //     method: 'delete',
    //     url: `${this.$serverURL}/movies/${movie_pk}/bookmark/`,
    //     headers: this.$setToken(),
    //   })
    //     .then(() => {
    //       this.getUserBookmark()
    //     })
    //     .catch(() => {
    //     })
    // },
    // getUserBookmark: function () {
    //   // 로그인한 사용자가 이 영화에 작성한 북마크 조회
    //   if (this.userPk) {
    //     const movie_pk = this.$route.params.movie_pk
    //     axios({
    //       method: 'get',
    //       url: `${this.$serverURL}/movies/${movie_pk}/bookmark/`,
    //       headers: this.$setToken()
    //     })
    //       .then(res => {
    //         this.userBookmark = res.data
    //       })
    //       .catch(() => {
    //       })
    //   }
    // },
  },
  created: function () {
    this.like_count = this.movie.movie_serializer.like_count
    if (this.movie.movie_serializer.like_users.includes(this.userPk)) {
      this.like = true
    } else {
      this.like = false
    }
    // this.getUserBookmark()
  },
  computed: {
    ...mapState([
      'userPk',
      'userNickname',
      'userBookmarks'
    ])
  },
}
</script>

<style>
.detail-poster {
  width: 100%;
  height: auto;
  border-radius: 0.7rem;
  margin-bottom: 1em;
}
.movie-detail-title-text {
  font-family: 'KoPubDotumBold', 'Noto Sans KR', sans-serif;
}
.movie-detail-like-button {
  background-color: transparent;
  border: none;
  margin-bottom: 16px;
}
.movie-detail-genre-text {
  background-color: #8ed0f6;
  margin: 5px;
  padding: .2rem .5rem;
  color: #1a1a1a;
  border: none;
  border-radius: .8em;
}
.movie-detail-actor-text {
  background-color: #343434;
  margin: 5px;
  padding: .2rem .5rem;
  color: #f7f7eb;
  border: none;
  border-radius: .8em;
}
.movie-detail-overview-text {
  background-color: #343434;
  border-radius: .3rem;
  color: #f7f7eb;
  margin: 5px 0;
  padding: 1em;
  font-size: 14px;
}
.a-tag-inline-block {
  display: inline-block;
}
.disable-icon-color {
  color: #f7f7eb;
  pointer-events: none
}
.icon-color {
  color: #f7f7eb;
}
.icon-color:hover {
  color: #8ed0f6;
}
</style>