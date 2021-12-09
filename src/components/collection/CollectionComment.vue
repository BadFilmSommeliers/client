<template>
  <div>
    <!-- 댓글 작성  -->
    <div v-if="userPk" class="d-flex flex-row justify-content-between mb-2 align-items-end">
      <h5 class="m-0">댓글을 작성하세요</h5>
      <v-btn 
        elevation="2"
        small
        color="rgba(52, 52, 52, 0.5)"
        @click='createComment'
      >
        작성
      </v-btn>
    </div>
    <v-textarea 
      v-if="userPk"
      name="input-7-1"
      filled
      auto-grow
      color="rgba(142, 208, 246, 0.5)"
      v-model="commentContent"
    ></v-textarea>

    <!-- 댓글 열람 -->
    <div class="d-flex flex-row justify-content-end">
      <h6>💬 {{this.comments.length }}</h6>
    </div>
    <hr class="mt-0">
    <p v-if="comments.length === 0">작성된 댓글이 없습니다.</p>
    <div
      v-else
      v-for="(comment, index) in comments"
      :key="comment.pk"
      v-show="startIndex <= index && index < startIndex + indexRange"
      class="mb-1"
      >
        <v-card
          class="mx-auto"
          color="rgba(52, 52, 52, 0.5)"
          >
          <v-card-text class="p-3">
            <div class="d-flex flex-row justify-content-between align-items-center">
              <div>
                <h6 @click="goToAccountDetail(comment.user.pk)" class="collection-comment-account-id m-0">
                {{ comment.user.nickname }}
                </h6>
              </div>
              <div v-if="editCommentInfo.pk == comment.pk">
                <v-btn
                  small
                  elevation="2"
                  class="me-2"
                  @click="editComment(comment.pk)"
                >
                  수정
                </v-btn>
                <v-btn
                  small
                  elevation="2"
                  @click="editCommentInfo.pk = 0"
                >
                  취소
                </v-btn>
              </div>
              <div v-else class="d-flex flex-row justify-content-between">
                <!-- 수정 버튼 -->
                <v-btn
                  v-if="comment.user.pk == userPk"
                  small
                  icon
                  @click='clickEdit(comment.pk, comment.content)'
                >🔧</v-btn>
                <!-- 댓글 삭제 부분  -->
                <v-dialog
                  v-if="comment.user.pk == userPk"
                  v-model="dialog"
                  width="500"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="clickDeleteBtn(comment.pk)"
                    >
                      ❌
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="fs-6 fw-bold" style="color: #f7f7eb">
                      정말 삭제하시겠습니까?
                    </v-card-title>

                    <v-card-text>
                      삭제된 댓글은 복구되지 않습니다.
                    </v-card-text>

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
                        @click="dialog = false, deleteComment()"
                      >
                        네
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>              
            </div>
            <!-- 텍스트 수정부분 -->
            <v-textarea
              v-if="editCommentInfo.pk == comment.pk"
              name="input-7-1"
              filled
              label="댓글을 수정하세요"
              auto-grow
              color="rgba(142, 208, 246, 0.5)"
              v-model="editCommentInfo.content"
              @keyup.enter="editComment(comment.pk)"
              class="mt-4"
              hide-details
            ></v-textarea>
            <div v-else>
              <p class="my-5 mx-1" style="color: #f7f7eb;"
              > {{ comment.content }}</p>
              <!-- 작성일과 좋아요 -->
              <div class="d-flex flex-row justify-content-between align-items-center">
                <div class="">
                  <v-btn 
                    v-if="comment.like_users.includes(userPk)" 
                    @click="likeComment(comment.pk)"
                    text 
                    icon
                    small
                  >
                    💙
                  </v-btn>
                  <v-btn 
                    v-else @click="likeComment(comment.pk)" 
                    text 
                    icon
                    small
                  >
                    🤍
                  </v-btn>
                  <span class="font-size-12">{{comment.like_count}}</span>
                </div>
                <span class='me-2 font-size-12'>{{ comment.created_at.slice(0, 10) + ' ' + comment.created_at.slice(11, 16)}}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
    </div>
    <v-pagination
        v-model="pageNumber"
        :length="parseInt((commentsCount + indexRange - 1) / indexRange)"
        :total-visible="8"
        color="rgba(52, 52, 52, 0.5)"
        class="mt-5"
    ></v-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'CollectionComment',
  data: function () {
    return {
      comments: [],
      commentContent: null,
      editCommentInfo: {
        pk: 0,
        content: null,
      },
      deleteCommentInfo: {
        pk: 0,
      },
      currentTime: null,
      pageNumber: 1,
      indexRange: 8,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      commentsCount: 0,
      pageLength: 0,

      dialog: false,
    }
  },
  props: {
    collection: Object
  },
  methods: {
    setToken: function () {
      const token = localStorage.getItem('jwt')
      const config = {
        Authorization: `JWT ${token}`
      }
      return config
    },
    getComments: function () {
      axios({
        method: 'get',
        url: `${this.$serverURL}/movies/collection/${this.collection.pk}/comment`
      })
        .then(res => {
          this.comments = res.data.reverse()
          this.commentsCount = res.data.length
        })
        .catch(() => {
        })
      },
    createComment: function () {
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/collection/${this.collection.pk}/comment/`,
        data: {
          'content': this.commentContent
        },
        headers: this.setToken()
      })
        .then(() => {
          this.commentContent= null,
          this.getComments()
        })
        .catch(() => {
        })
    },
    likeComment: function(comment_pk) {
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/collection/comment/${comment_pk}/like/`,
        headers: this.setToken()
      })
        .then(() => {
          this.getComments()
        })
        .catch(() => {
        })      
    },
    deleteComment: function() {
      const comment_pk = this.deleteCommentInfo.comment_pk
      axios({
        method: 'delete',
        url: `${this.$serverURL}/movies/collection/comment/${comment_pk}/`,
        headers: this.setToken()
      })
        .then(() => {
          this.getComments()
          this.deleteCommentInfo.comment_pk = 0
        })
        .catch(() => {
        })      
    },
    clickEdit: function(comment_pk, comment_content) {
      this.editCommentInfo.pk = comment_pk
      this.editCommentInfo.content = comment_content
    },
    clickDeleteBtn: function (comment_pk) {
      this.deleteCommentInfo.comment_pk = comment_pk
    },
    editComment: function(comment_pk) {
      axios({
        method: 'put',
        url: `${this.$serverURL}/movies/collection/comment/${comment_pk}/`,
        data: {
          'content': this.editCommentInfo.content
        },
        headers: this.setToken()
      })
        .then(() => {
          this.editCommentInfo = {
            pk: 0,
            content: null,
          }
          this.getComments()
        })
        .catch(() => {
        })      
    },
    goToAccountDetail: function (user_pk) {
      this.$router.push({name: 'Account', params: {user_pk: user_pk}})
    },
  },
  computed: {
    ...mapState([
      'userPk',
      'nickname'
    ]), 
  },
  created: function () {
    this.getComments()
    this.startIndex = (this.pageNumber - 1) * this.indexRange
  },
  watch: {
    pageNumber: function () {
      this.startIndex = (this.pageNumber - 1) * this.indexRange
    }
  },
}
</script>

<style>
.collection-comment-account-id {
  color: #f7f7eb;
}
.collection-comment-account-id:focus,
.collection-comment-account-id:hover {
    outline: 0;
    color: #8ed0f6;
    -webkit-transition: color .2s ease;
    -moz-transition: color .2s ease;
    -ms-transition: color .2s ease;
    -o-transition: color .2s ease;
    transition: color .2s ease;
    cursor: pointer
}
.collection-comment-account-id:after,
.collection-comment-account-id:before {
    -webkit-transition: all .2s ease 0s;
    -moz-transition: all .2s ease 0s;
    -ms-transition: all .2s ease 0s;
    -o-transition: all .2s ease 0s;
    transition: all .2s ease 0s
}
.collection-comment-account-id:focus:after,
.collection-comment-account-id:focus:before,
.collection-comment-account-id:hover:after,
.collection-comment-account-id:hover:before {
    outline: 0;
    background-color: #8ed0f6;
    -webkit-transition: all .2s ease 0s;
    -moz-transition: all .2s ease 0s;
    -ms-transition: all .2s ease 0s;
    -o-transition: all .2s ease 0s;
    transition: all .2s ease 0s
}
</style>