<template>
  <div class="body">
    <div class="avatar-container desktop-only">
      <img src="../assets/loginavatar.png"/>
    </div>
   <div class="form">
    <router-view/>
   </div>
  </div>
</template>

<script>
  export default {
    name:'LoginRegLayout'
  }
</script>

<style scoped>
.form{
  width: 30%;
}
img{
  width:100%;
  opacity: 0.6;
}
.body{
  margin: 0px;
  padding: 0px;
  background-image: url('../assets/loginbg.avif');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.avatar-container{
  width: 30%;
}
@media (max-width: 727px) {
  .avatar-container {
    display: none;
  }

  .form {
    width: 80%;
  }
}
</style>
