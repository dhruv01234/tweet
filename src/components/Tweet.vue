<template>
  <div>
    <q-card class="tweetcard q-pa-md">
      <div class="sender">
        <div>
          <div class="tweet-avatar">
            <q-avatar>
              <img src="../assets/avatar.jpg" />
            </q-avatar>
          </div>
          <div class="tweet-author">
            <p>{{ tweet.username }}</p>
          </div>
        </div>
      </div>
      <div class="vertical"></div>
      <div class="content">
        <div class="tweet-message">
          <p>{{ tweet.content }}</p>
        </div>
        <div class="tweet-footer flex">
          <div class="tweet-likes">
            <div>
              <q-btn
                round
                dense
                flat
                icon="favorite"
                class="like-button"
                @click="likeTweet(tweet.id)"
              />
            </div>
            <div>
              <p>{{ tweet.likes }}</p>
            </div>
          </div>
          <div class="tweet-time flex items-end">
            <p>{{tweet.date}}</p>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "TweetCard",
  props: {
    tweet: Object,
  },
 methods:{
  likeTweet(tweetId) {

  },
 }
};
</script>

<style scoped>
.vertical {
  display: inline-block;
  border-left: 1px solid yellow;
  height: 100%;
}
.tweetcard {
  display: flex;
  justify-content: space-between;
}
.tweet-likes {
  display: flex;
  align-items: baseline;
}
.sender {
  width: 12%;
  border-right: 2px solid #c7e0f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content {
  width: 80%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #1976d2;
}
.tweet-footer {
  background-color: #e7ecf691;
  display: flex;
  justify-content: space-between;
  height: max-content;
  padding: 5px;
}
.tweet-message {
  overflow-wrap: break-word;
  word-wrap: break-word;
  overflow: hidden;
}
.tweet-author {
  overflow-wrap: break-word;
  word-wrap: break-word;
  max-width: 100%;
  margin: auto;
}
</style>
