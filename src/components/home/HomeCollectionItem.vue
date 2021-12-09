<template>
  <div class="m-0 container" style="max-width:px">
    <!-- 컬렉션 카드 전체 div -->
    <div 
      class="col justify-content-center p-0" 
      style="max-width:980px, max-height:240px"
      >
      <!-- 컬렉션 카드 내부 -->
      <div 
        v-if="movieCards"
        class="row row-cols-2 p-1 flex-shrink-1"
        > 
        <!-- 컬렉선 카드 (좌) 포스터 부분 -->
        <div class='row row-cols-6 flex-shrink-1' style="max-width:980px">
          <div
            v-for='(movieCard, index) in movieCards'
            :key='index'
            class='col home-collection-movie-poster'
            height='240px'
            @click="$goToMovieDetail(movieCard.pk)"
            >
              <img
                :src="`https://image.tmdb.org/t/p/w500/${movieCard.poster_path}`" 
                alt="img" 
                width="auto"
                height="240px"
                >
          </div>
        </div>
        <!-- 컬렉션 카드 (우) 제목 및 내용 -->
        <div 
          @click="$goToCollectionDetail(collection.pk)" 
          class='row justify-content-between 
          ms-xs-4 ms-md-4 ms-lg-0 p-0
          home-collection-item-review'
          style="max-height:240px"
        >
          <!-- 상단 타이틀과 글 -->
          <div class='row px-4 py-2 px-md-5 py-md-4'>
            <p class='font-size-20-18 m-0 mt-3 text-truncate account-id'> {{ collection.title }}</p>
            <p class="three-lines font-size-16-14 collection-content-text-size p-3 m-0"> {{ collection.content }}</p>
          </div>
          <!-- 하단 프로필 -->
          <div class='d-flex flex-sm-row flex-column justify-content-between align-self-end m-0 mb-3 px-4 py-2 px-md-5 py-md-3'> 
            <div class="">
              <span class="font-size-14-12 col col-8 m-0 p-0"> {{ collection.user.nickname }}</span>
            </div>
            <div class="">
              <span class="font-size-14-12 me-2"> 💙 {{ collection.like_count }} </span>
              <span class="font-size-14-12 "> 💬 {{ collection.comment_count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'HomeCollectionItem',
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      poster_path: null,
      movieCards: [],
    }
  },
  methods: {
    getPoster: function (movie_id) {
      axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + movie_id +`?api_key=${this.$API_KEY}&language=ko`,
      })
        .then(res => {
          if (this.movieCards.length < 5) {
            const movieCard = new Object
            movieCard['poster_path'] = res.data['poster_path']
            movieCard['title'] = res.data['title']
            movieCard['pk'] = res.data['id']
            this.movieCards.push(movieCard)
          }
        })
        .catch(() => {
        })
    },
  },
  created: function () {
    const sampleMovies = _.sampleSize(this.collection.movies, 7)
    for (const movie_pk of sampleMovies) {
      this.getPoster(movie_pk)
    }
  },
}
</script>

<style>
img {
  border-radius: 0.5rem;
  border-color: black;
}

.home-collection-item-review {
  border-radius: 1.0rem;
  background-clip: content-box;
  background-color: rgba(52, 52, 52, 0.5);
  background: linear-gradient(to right, #343434 30%,rgba(52, 52, 52, 0.9) 50%, rgba(52, 52, 52, 0.3));
  transition: all .2s ease-in-out; 
  cursor: pointer;
}
.home-collection-item-review:hover {
  transform: scale(1.05); 
}
.home-collection-movie-poster:hover {
  transform: scale(1.1); 
}
.home-collection-movie-poster {
  transition: all .2s ease-in-out; 
  cursor: pointer;
}
</style>