<template>
  <div class="body-home">
    <div class="title">
      <div class="left">
        <h1>Invoices</h1>
        <!-- {{invoices}} -->
        <div class="ifdesktop">There are {{total_invoice}} total invoices</div>
        <div class="ifmobileblock">{{total_invoice}} invoices</div>
      </div>
      <div class="right">
        <div class="select" @click="showFilter = !showFilter"><span class="ifdesktop">Filter by status</span><span
            class="ifmobile">Filter</span> <i class="fas fa-chevron-down arrow"></i>
          <div class="dropdown-menu" v-if="showFilter">
            <div @click="filter_status=''" class="listmenu">All</div>
            <div @click="filter_status='Pending'" class="listmenu">Pending</div>
            <div @click="filter_status='Paid'" class="listmenu">Paid</div>
            <div @click="filter_status='Draft'" class="listmenu">Draft</div>

          </div>
        </div>
        <div class="button-add" @click="showModal = true">
          <div class="circle"><i class="fas fa-plus"></i></div>
          <span class="ifdesktop">New Invoice</span>
          <span class="ifmobile"> New </span>
        </div>
      </div>
    </div>
    <div class="cards">
      <nuxt-link :to="`/${index}`" v-for="(invoice,index) in invoices" :key="index">
        <div class="item-card card" :class="{ 'light': isLight, 'dark': !isLight }">
          <div class="code">#{{invoice.invoice_id}}</div>
          <div class="date">{{due_date(invoice.invoice_date, invoice.payment_term)}}</div>
          <div class="name">{{invoice.bill_to.name}}</div>
          <div class="amount">{{invoice.amount_invoice|currency}}</div>
          <button :class="`status ${invoice.status}`">
            <div class="circle-small"></div> {{invoice.status}}
          </button>

          <div class="icon"><i class="fas fa-chevron-right arrow"></i></div>
        </div>
      </nuxt-link>
    </div>
    <modal :isopen="showModal" @changeModal="handleModal" :invoice_id="null" @successUpdate="readFromRealtimeDb()" />
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import date from '~/mixins/date'
  import modal from '~/components/modal.vue'

  export default {
    mixins: [date],
    components: {
      modal
    },
    data() {
      return {
        invoices: [],
        showModal: false,
        total_invoice: 0,
        filter_status: "",
        showFilter: false
      }
    },
    computed: {
      ...mapGetters({
        isLight: 'getIsLight'
      })
    },
    watch: {
      filter_status(newval) {
        this.readFromRealtimeDb(newval)
      }
    },
    mounted() {
      this.readFromRealtimeDb()
    },
    methods: {
      handleModal(val) {
        console.log(val, 'dff')
        this.showModal = val
      },
      async readFromRealtimeDb(status = "") {
        const dbref = this.$fire.database.ref('invoices')
        try {
          let snapshot
          if (this.filter_status !== "") {
            snapshot = await dbref.orderByChild("status").equalTo(this.filter_status).once('value')
          } else {
            snapshot = await dbref.once('value')
          }
          this.invoices = snapshot.val()
          this.total_invoice = snapshot.numChildren()
          console.log(snapshot.val(), 'list invoice')
        } catch (e) {
          alert(e)
          return
        }
        console.log('this.invoices', this.invoices)
        console.log('this.invoice_data', this.invoice_data)
      },
    }
  }

</script>

<style lang="scss" scoped>
  .arrow {
    color: $purple;
    font-size: 10px;
  }

  .body-home {
    padding: 3rem 15%;
    height: 100vh;

    @media only screen and (max-width: 600px) {
      //   padding-top: 13vh;
      padding: 14vh 1rem 1rem 1rem;
    }

    .title {
      display: flex;
      justify-content: space-between;

      .left {
        width: 30%;
      }

      .right {
        width: 40%;
        display: flex;
        align-items: center;

        @media only screen and (max-width: 600px) {
          width: 55%;
        }

        .button-add {
          // width: 50%;
          display: flex;
          align-items: center;
          padding: 12px;
          padding-left: 10px;
          border-radius: 50px;

          @media only screen and (max-width: 600px) {
            padding: 6px 8px;
          }

          .circle {
            padding: 10px 12px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }

        .select {
          width: 50%;
          position: relative;
          cursor: pointer;

          .dropdown-menu {
            position: absolute;
            right: 0;
            left: 0;
            background-color: #1f2137;
            border-radius: 5px;
            margin-top: 1rem;

            .listmenu {
              padding: 10px 5px;

              &:hover {
                background-color: #7c3cd21f;
              }
            }

            //   display: none;
          }

          @media only screen and (max-width: 600px) {
            width: 40%;
          }

          i {

            margin-left: 10px;
          }
        }
      }


    }

    .cards {
      margin-top: 2rem;

      .item-card {
        // padding: 1rem;
        border-radius: 15px;
        display: grid;
        grid-template-columns: 1fr 2fr 2fr 2fr 120px 20px;
        align-items: center;
        grid-gap: 1rem;
        margin-bottom: 1rem;

        @media only screen and (max-width: 600px) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;

          grid-template-areas:
            "code name"
            "date paid"
            "amount paid";
        }

        .icon {
          @media only screen and (max-width: 600px) {
            display: none;
          }
        }

        .status {
          padding: 1rem;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;

          .circle-small {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
          }

          &.Pending {
            background-color: #f491101f;
            color: #f49110;

            .circle-small {
              background-color: #f49110;
            }
          }

          &.Paid {
            background-color: #2163211f;
            color: #216321;

            .circle-small {
              background-color: #216321;
            }
          }

          &.Draft {
            background-color: #5d616b1f;
            color: #5d616b;

            .circle-small {
              background-color: #5d616b;
            }
          }
        }
      }
    }


    .button-add {
      background-color: $purple;
      color: #fff;

      .circle {
        background-color: #fff;

        i {
          color: $purple;
        }
      }
    }

    // .item-card{
    //     background-color: #a7a9e82e;
    // }

  }

  @media only screen and (max-width: 600px) {
    .code {
      grid-area: code;
    }

    .date {
      grid-area: date;
    }

    .name {
      grid-area: name;
    }

    .amount {
      grid-area: amount;
    }

    .status {
      grid-area: paid;
    }
  }

</style>
