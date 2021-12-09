<template>
  <div v-if='this.movies_in_collection' class="container">
    <div class='row'>
      <!-- 상단바 -->
      <div class="d-flex justify-content-between">
        <h3 class="d-flex flex-grow-1"> {{ collection.title }} </h3>
      </div>
      <div class="d-flex justify-content-between">
        <div
          v-if="userPk == collection.user.pk"
          class="d-flex flex-grow-1">
          <p class='d-flex align-items-center m-0 fw-bold'>내 컬렉션</p> 
        </div>
        <div 
          v-else
          class="d-flex flex-grow-1">
          <p 
            class='d-flex align-items-center m-0 fw-bold account-id font-size-16-14'
            @click="$goToAccountDetail(collection.user.pk)"
          > {{ collection.user.nickname }}</p> 
          <p class='d-flex align-items-center m-0 font-size-16-14'> 님의 컬렉션 </p>
        </div>

        <!-- 삭제 -->
        <v-dialog
          v-model="dialog"
          v-if="userPk === collection.user.pk"
          class="d-flex flex-shrink-1 align-items-center m-1"
        >
          <!-- 삭제 버튼  -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="rgba(52, 52, 52, 0.5)"
              style="color: #f7f7eb"
              v-bind="attrs"
              v-on="on"
              class="me-1 mb-1"
              small
            >삭제</v-btn>
          </template>
          <!-- 삭제 버튼 모달 -->
          <v-card>
            <v-card-title class="text-h5 lighten-2">
              삭제 경고
            </v-card-title>
            <v-card-text>
              컬렉션을 삭제하시면 다시 복구할 수 없습니다. <br/> 삭제하시겠습니까?
            </v-card-text>
          <!-- 삭제 액션 -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="#f7f7eb"
                text
                @click="dialog = false"
              >
                취소
              </v-btn>
              <v-btn
                color="#8ed0f6"
                text
                @click="deleteCollection(collection.pk)"
              >네</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 수정  -->
        <v-dialog
          v-if="userPk === collection.user.pk"
          v-model="collectionEditDialog"
          fullscreen
          persistent
          hide-overlay
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="rgba(52, 52, 52, 0.5)"
              v-bind="attrs"
              v-on="on"
              style="color: #f7f7eb;"
              small
            >
              수정
            </v-btn>
          </template>
          <v-card class='container'>
            <v-row>
              <v-toolbar
                class='row justify-contents-between '
              >
                <v-btn
                icon
                dark
                @click="collectionEditDialog = false"
                class='col col-1 ml-5'
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title
                class='col col-10'
                >컬렉션 수정</v-toolbar-title>
                <v-btn
                  dark
                  text
                  class='col col-1'
                  @click='clickSave' 
                >
                  수정
                </v-btn>
              </v-toolbar>  
            </v-row>
            <create-collection
              class='mt-5'
              :collection="this.collection"
              :movie_cards="this.movies_in_collection"
              :updateBtnOn="this.updateBtnOn"
            ></create-collection>
          </v-card>
        </v-dialog>
    
        <div class="d-flex flex-row align-items-center">
          

          <v-tooltip 
            bottom :disabled="userPk != null"
            color='#343434'
            >
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                v-if="collection.user.pk != userPk" 
                @click="likeCollection(collection.pk)" 
                class="d-flex flex-shrink-1 align-items-center m-1"
                text
                icon
                v-bind="attrs"
                v-on="on"
              >
                <span v-if="like === true">💙</span>
                <span v-else>🤍</span>
              </v-btn>
            </template>
            <span color="#f7f7eb">좋아요를 누르시려면 로그인을 해주세요!</span>
          </v-tooltip>

          <span v-if="collection.user.pk != userPk" class="me-4">{{this.like_count}}</span>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-between align-items-end">
        <p class="m-0 font-size-12">{{ collection.created_at.slice(0, 10) + ' ' + collection.created_at.slice(11, 16) }}</p>
        <!-- 영화 목록 조회 토글 버튼  -->
        <v-btn
          @click="toggleMovieList"
          color="rgba(52, 52, 52, 0.5)"
        >목록</v-btn>
      </div>
      <hr class="mt-2 mb-0">

      <!-- 영화 목록 -->
      <div class="collection-list-text" v-show="this.show_movie_list">
        <div 
          v-for="(movie_info, index) in this.movies_in_collection"
          :key="movie_info['pk']"
          class="d-flex flex-row justify-content-between"
          >
          <p class="text-truncate mb-0 account-id" @click="$goToMovieDetail(movie_info['pk'])"> {{ index + 1}}. {{ movie_info['title'] }} </p>
          <p class="account-id" @click="$goToMovieDetail(movie_info['pk'])">➡</p> 
        </div>
      </div>
      <!-- 하단 -->
      <div class='row col-10 row-cols-6 row-cols-md-5 row-cols-lg-6 ms-1'>
        <div
          v-for="movie_info in this.movies_in_collection"
          :key='movie_info[0]'
          class="col p-1" 
        >
          <img :src="`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie_info['poster_path']}`" alt="poster" width='100px' class='movie-posters movie-posters-wrap' @click="$goToMovieDetail(movie_info['pk'])">
          <div class='movie-title m-1'>
            <span class="movie-title-text">
              {{ movie_info['title'] }}
            </span>
          </div>
        </div>
      </div>
      <p class="collection-detail-text"> {{ collection.content }}</p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import CreateCollection from '@/components/collection/CreateCollection'


export default {
  name: 'CollectionDetail',
  components: {
    CreateCollection,
  },
  data: function () {
    return {
      movies_in_collection: [],
      movie_count: null,
      like: null,
      like_count: null,
      show_movie_list: false,
      dialog: false,
      collectionEditDialog: false,
      updateBtnOn: false,
    }
  },
  props: {
    collection: Object
  },
  methods: {
    getMovie: function (movie_id) {
      axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + movie_id +`?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          res.data['pk'] = res.data['id']
          this.movies_in_collection.push(res.data)
        })
        .catch(() => {
        })
    },
    deleteCollection: function (collection_pk) {
      axios({
        method: 'delete',
        url: `${this.$serverURL}/movies/collection/${collection_pk}/`,
        headers: this.$setToken()
      })
        .then(() => {
          this.$router.push({name: 'CollectionList', })
        })
        .catch(() => {
        })
    },
    likeCollection: function (collection_pk) {
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/collection/${collection_pk}/like`,
        headers: this.$setToken()
      })
        .then(res => {
          this.like = res.data.like
          this.like_count = res.data.like_count
        })
        .catch(() => {
        })
    },
    toggleMovieList: function () {
      this.show_movie_list = !this.show_movie_list
    },
    clickSave: function () {
      this.updateBtnOn = true
      setTimeout(() => this.updateBtnOn = false, 1000)
    },
  },
  created: function() {
    if (this.collection.like_users.includes(this.userPk)) {
      this.like = true
    } else {
      this.like = false
    }
    this.like_count = this.collection.like_count
    for (const movie_pk of this.collection.movies) {
      this.getMovie(movie_pk)
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
<style scoped>
.movie-posters {
  border-radius: 0.5rem;
  border-color: black;
  border: black;
  transition: all .2s ease-out;
  cursor: pointer;
}
.movie-posters:hover {
  transform: scale(1.1);
}
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
  border-radius: 0.7rem;
  transition: all .2s ease-in-out; 
  transform: scale(1.1); 
}
.movie-posters-wrap:hover .movie-title {
  visibility: visible;
  opacity: 1;
}
.movie-title-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.collection-detail-text {
  background-color: rgba(52, 52, 52, 0.5);
  border-radius: .3rem;
  margin: 5px 0;
  padding: 1em;
  font-size: 14px;
}
.collection-list-text {
  background-color: rgba(52, 52, 52, 0.5);
  border-radius: .3rem;
  margin: 5px 0;
  padding: 1em;
  font-size: 14px;
}
</style>