<template>
  <div :class="[isLight? 'invoice light': 'invoice dark']">
    <div class="sidebar desktop">
      <div class="logo">
        <nuxt-link to="/">
          <img src="~/assets/images/logo.png" alt="logo" width="100%">
        </nuxt-link>
      </div>
      <div class="bottom-menu">
        <div class="toogle-mode" @click="$store.commit('setIsLight', isLight? false : true)">
          <i :class="[isLight? 'fas fa-moon' : 'fas fa-sun']"></i>
        </div>
        <div class="avatar">
          <img src="~/assets/images/man.png" alt="avatar" width="100%">
        </div>
      </div>
      <div>
      </div>
    </div>
    <div class="page">
      <div class="sidebar mobile">
        <div class="logo">
          <nuxt-link to="/">
            <img src="~/assets/images/logo.png" alt="logo" width="100%">
          </nuxt-link>
        </div>
        <div class="bottom-menu">
          <div class="toogle-mode" @click="$store.commit('setIsLight', isLight? false : true)">
            <i :class="[isLight? 'fas fa-moon' : 'fas fa-sun']"></i>
          </div>
          <div class="avatar">
            <img src="~/assets/images/man.png" alt="avatar" width="100%">
          </div>
        </div>
        <div>
        </div>
      </div>
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        isLight: 'getIsLight'
      })
    }
  }

</script>

<style lang="scss" scoped>
  .invoice {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    overflow-x:hidden;

    @media only screen and (max-width: 600px) {
      display: block;
    }

    .sidebar {
      z-index: 999;
      display: grid;


      &.desktop {
        width: 7%;
        grid-template-rows: 1fr 3fr;
        text-align: center;
        position: fixed;
        height: 100%;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
              .bottom-menu {
        align-self: self-end;

        .avatar {
          margin-top: 1rem;
          padding: 20px;
          border-top-style: solid;
          border-top-width: 1px;

          img {
            border-radius: 50%;
          }
        }

        .toogle-mode {
          cursor: pointer;
        }
      }

        @media only screen and (max-width: 600px) {
          display: none;
        }
      }

      &.mobile {
        position: fixed;
        display: none;
        grid-template-columns: 20% 30%;
        grid-template-rows: none;
        // height: 13vh;
        justify-content: space-between;
        .logo{
          img{
            height: 100%; 
             @media only screen and (max-width: 600px) {
               width: 85px;
               height: auto;
             }
          }
        }
        .bottom-menu {
          display: flex;
          align-items: center;

          .avatar {
            border-left-style: solid;
            border-left-width: 1px;
            border-top: 0;
            width: 70%;
            padding: 20px;
            img{
              border-radius: 50%;
            }

          }
          .toogle-mode{
            width: 30%;
          }
        }

        @media only screen and (max-width: 600px) {
          display: grid;
        }
      }




      // background-color: #1f2138;
    }

    .page {
      width: 100%;

    }

    &.dark {
      .sidebar {
        background-color: #1f2138;

        .bottom-menu {
          .avatar {
            border-color: #fff;
          }

          .toogle-mode {
            i {
              color: #fff;
            }
          }
        }
      }

      .page {
        background-color: $bg-dark;
        color: #fff;
      }
    }

    &.light {
      .sidebar {
        background: #efeffb;
      }

      .bottom-menu {
        .avatar {
          border-color: black;
        }
      }
    }
  }

</style>
