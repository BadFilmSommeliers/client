<template>
  <div v-if="collection" class='container'>
    <div class="backdrop" :style="{marginLeft: `-${(windowWidth - 1000) / 2 + 100}px`, marginTop: trigger ? '-13rem': '-16rem'}">
      <img 
        v-if="movieBackdropFilePath.length > 40"
        :src="`${movieBackdropFilePath}`" 
        class="backdrop-img" 
        alt="backdrop image"
      >
    </div>    
    <div class="row">    
      <collection-detail
        class="col-md-5 col-12 mb-3"
        :collection="collection"
        >
        </collection-detail>
      <collection-comment 
        :collection="collection"
        class="col-md-7 col-12"
        ></collection-comment>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import CollectionDetail from '@/components/collection/CollectionDetail'
import CollectionComment from '@/components/collection/CollectionComment'


export default {
  name: 'Collection',
  components: {
    CollectionDetail,
    CollectionComment,
  },
  data: function () {
    return {
      collection: null,

      movieBackdropFilePath: 'https://www.themoviedb.org/t/p/original/',
      windowWidth: null,
      trigger: true,
    }
  },
  methods: {
    createCollectionComment: function () {
      const collection_pk = this.$route.params.collection_pk
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/collection/${collection_pk}/comment/`,
        data: {
          'content': this.commentContent,
        },
        headers: this.$setToken()
      })
        .then(() => {
        })
        .catch(() => {
        })
    },
    getMovieBackdrops: function () {
      const movie_pk = _.sample(this.collection.movies)
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movie_pk}/images?api_key=${this.$API_KEY}`
      })
        .then(res => {
          const randomNumber = _.random(Math.min(5, res.data.length))
          this.movieBackdropFilePath += res.data.backdrops[randomNumber].file_path
          this.$emit('bring-backdrop', this.movieBackdropFilePath)
        })
        .catch(() => {
        })
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
  created: function () {
    const collection_pk = this.$route.params.collection_pk
    axios({
      method: 'get',
      url: `${this.$serverURL}/movies/collection/${collection_pk}/`
    })
      .then(res => {
        this.collection = res.data
        this.getMovieBackdrops()
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
      })
      .catch(() => {
        this.$router.push({ name: 'NotFound' })
      })
  },
  destroyed() {
      window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
.backdrop {
  z-index: -1;
  position: absolute;
  margin-top: -9rem;
  left: 0;
  top: 0;
  width: 115vw;
}
.backdrop-img {
  mask-image: linear-gradient(to top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%);
  width: 100%
}
</style>