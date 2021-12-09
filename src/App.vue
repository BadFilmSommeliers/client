<template>
  <v-app id="app">
    <div class="container p-0">
      <div class="row nav-toolbar-div justify-content-sm-between align-center" style="margin: auto;">
        <div class="col-sm-6 col-12 px-0 py-3">
          <div class="d-flex flex-row justify-content-sm-start justify-content-center">
            
            <!-- 로고 -->
            <v-btn
              :to="{ name: 'Home' }" 
              elevation="0" 
              width=200
              height=150
              plain
              :rounded='true'
              :shaped='true'
              class="p-0"
            >
              <v-img src="@/assets/logo/logo.png" alt="logo image" width=60></v-img>    
            </v-btn>
          </div>
        </div>

        <!-- 네비바 아이콘 -->
        <div class="col-sm-6 col-12 p-0">
          <div class="d-flex flex-row justify-content-sm-end justify-content-center">

            
            <!-- 검색 기능 -->
            <v-dialog
              v-model="showSearch"
              fullscreen
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="0" 
                  color="#c9e5f5" 
                  width=60
                  height=60
                  v-bind="attrs"
                  v-on="on"
                  plain
                  :rounded='true'
                  :shaped='true'
                >
                  <v-img src="@/assets/icon/search.png" alt="search" width=50></v-img>   
                </v-btn>
              </template>
              <v-card color="rgba(26, 26, 26, 0.9)">
                <v-card-text>
                  <home-search @close-search="showSearch=false" @cancle-dialog="showSearch=false"></home-search>
                </v-card-text>
              </v-card>
            </v-dialog>
            
            <!-- collections -->
            <v-btn
              elevation="0" 
              color="#c9e5f5" 
              width=60
              height=60
              plain
              :rounded='true'
              :shaped='true'
              :to="{ name: 'CollectionList' }" 
            >
              <v-img src="@/assets/icon/archive.png" alt="collections" width=50></v-img>    
            </v-btn>

            <!-- 로그인 -->
            <v-btn 
              v-if="!userPk"
              elevation="0" 
              color="#c9e5f5" 
              width=60
              height=60
              :to="{ name: 'Login' }"
              plain
              :rounded='true'
              :shaped='true'
            >
              <v-img src="@/assets/icon/login.png" alt="logout" width=50></v-img> 
            </v-btn>

            <!-- 계정 -->
            <v-btn 
              v-if="userPk"
              elevation="0" 
              color="#c9e5f5" 
              width=60
              height=60
              plain
              :rounded='true'
              :shaped='true'
              :to="{ name: 'Account', params: { user_pk: userPk } }"
            >
              <v-img src="@/assets/icon/user.png" alt="user" width=50></v-img>  
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  
    <v-main id="main" class="container">
      <router-view @bring-backdrop="bringBackdrop" :isUpdatedNeeded='updateHome' :key="$route.path" />
    </v-main>

    <!-- footer -->
    <v-container class="pb-0">
      <v-row
        justify="center"
        no-gutters
      >
        <v-col
          class="py-1 text-center font-size-14-12"
          style="#color: f7f7eb;"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>TEAM SORT</strong> 
          <v-btn
            class="mb-1"
            icon
            @click="goToGithub"
          >
            <v-icon size="20px" color="#f7f7eb">
              mdi-github
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <rec-manager></rec-manager>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import HomeSearch from '@/views/movies/HomeSearch'
import RecManager from '@/components/recommendation/RecManager'

export default {
  name: 'App',
  components: {
    HomeSearch,
    RecManager,
  },
  data: () => ({
    backdrop: '',
    showSearch: false,
    updateHome: false,
  }),
  methods: {
    bringBackdrop: function (backdrop) {
      this.backdrop = backdrop
    },
    goToGithub: function () {
      window.open('https://github.com/BestFilmSommeliers')
    },
  },
  created: function () {
    this.$store.dispatch('loadCollections')
    const token = localStorage.getItem('jwt')
    if (token) {
      this.$store.dispatch('getUserPk')
      this.$store.dispatch('updateDiscoverOption')
    } else {
      this.$store.dispatch('defaultDiscoverOption')
    }
  },
  computed: { 
    ...mapState([
      'userPk',
      'discoverOption',
      'discoverOptionUpdatedAt',
      'chosenGenres',
      'movieDiscoveredAt',
    ])
  },
  watch: {
    discoverOptionUpdatedAt: {
      handler () {
        this.updateHome = true
      }
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');


@font-face {
    font-family: 'KoPubDotumLight';
    src: url('https://cdn.jsdelivr.net/npm/font-kopubworld@1.0.3/fonts/KoPubWorld-Dotum-Light.woff2') format('woff');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'KoPubDotumMedium';
    src: url('https://cdn.jsdelivr.net/npm/font-kopubworld@1.0.3/fonts/KoPubWorld-Dotum-Medium.woff2') format('woff');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'KoPubDotumBold';
    src: url('https://cdn.jsdelivr.net/npm/font-kopubworld@1.0.3/fonts/KoPubWorld-Dotum-Bold.woff2') format('woff');
    font-weight: normal;
    font-style: normal;
}

#app {
  font-family: 'KoPubDotumMedium', sans-serif;
  font-weight: 400;
  letter-spacing: .05em;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #f7f7eb;
  background-color: var(--v-background-base) !important;

  padding: 0;
  position: relative;
}
@media (max-width: 576px) {
  #app {
    font-size: 16px;
  }
}

#nav {
  background-color: #c9e5f5;
  max-width: 1000px;
  height: 8rem;
}
#nav a {
  font-weight: bold;
  color: #f7f7eb;
}
#nav a.router-link-exact-active {
  color: #8ed0f6;
}

#main {
  max-width: 1000px;
}

.app-bar {
  background-color: #c9e5f5;
}

.logo {
  width: 10rem;
}

.yellow-text {
  color: #f7f7eb;
}
.blue-text {
  color: #8ed0f6;
  cursor: pointer;
}
.font-size-12 {
  font-size: 12px;
}
.font-size-14-12 {
  font-size: 14px;
}
@media (max-width: 576px) {
  .font-size-14-12 {
    font-size: 12px;
  }
}
.font-size-16-14 {
  font-size: 16px;
}
@media (max-width: 576px) {
  .font-size-16-14 {
    font-size: 14px;
  }
}
.font-size-18-16 {
  font-size: 18px;
}
@media (max-width: 576px) {
  .font-size-18-16 {
    font-size: 16px;
  }
}
.font-size-20-18 {
  font-size: 20px;
}
@media (max-width: 576px) {
  .font-size-20-18 {
    font-size: 18px;
  }
}

.three-lines {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.two-lines {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.account-id:focus,
.account-id:hover {
    outline: 0;
    color: #8ed0f6;
    -webkit-transition: color .2s ease;
    -moz-transition: color .2s ease;
    -ms-transition: color .2s ease;
    -o-transition: color .2s ease;
    transition: color .2s ease;
    cursor: pointer
}
.account-id:after,
.account-id:before {
    -webkit-transition: all .2s ease 0s;
    -moz-transition: all .2s ease 0s;
    -ms-transition: all .2s ease 0s;
    -o-transition: all .2s ease 0s;
    transition: all .2s ease 0s
}
.account-id:focus:after,
.account-id:focus:before,
.account-id:hover:after,
.account-id:hover:before {
    outline: 0;
    background-color: #8ed0f6;
    -webkit-transition: all .2s ease 0s;
    -moz-transition: all .2s ease 0s;
    -ms-transition: all .2s ease 0s;
    -o-transition: all .2s ease 0s;
    transition: all .2s ease 0s
}

.background-color-1a1a1a {
  background-color: #1a1a1a;
}
.background-color-c9e5f5 {
  background-color: #c9e5f5;
}
.nav-icon {
  width: 10%;
}
.nav-toolbar-div {
  max-width: 1000px;
  width: 100%;
}

/* 스크롤바 */
/* width */
::-webkit-scrollbar {
  background-color: #1a1a1a;
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
::-webkit-scrollbar-track:hover {
    background-color: transparent;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #343434;
  border-radius: 10px;
  background-clip: padding-box;
  border: 1px solid transparent;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #343434; 
}
</style>