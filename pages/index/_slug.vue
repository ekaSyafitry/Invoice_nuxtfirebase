<template>
  <div class="invoice-detail" :class="{ 'light': isLight, 'dark': !isLight }" v-if="invoices">
    <div class="btn-group card">
      <button class="blue" @click="editInvoice()">Edit</button>
      <button class="red" @click="removeInvoice()">Delete</button>
      <button class="purple" @click="updateStatus('Paid')" v-if="invoices.status == 'Pending'">Mark as Paid</button>
      <button class="paid" disabled v-if="invoices.status == 'Paid'">Paid</button>
      <button class="purple" @click="updateStatus('Pending')" v-if="invoices.status == 'Draft'">Publish</button>
    </div>
    <div class="summary card">
        <div class="header">
            <h2 class="no-inv">
                #{{invoices.invoice_id}}
            </h2>
      <div class="address_wrap ds">
        <div>{{invoices.bill_to.name}} </div>
        <div>{{invoices.bill_to.city}}</div>
        <div>{{invoices.bill_to.postcode}}</div>
        <div>{{invoices.bill_to.country}}</div>
      </div>
      </div>
          <div class="email">
        Sent to
        <div class="bold">{{invoices.bill_to.email}}</div>
    </div>
    <div class="data-inv">
        <div class="title">
            <div class="number">Number</div>
            <div>Item Name</div>
            <div>QTY</div>
            <div>Price</div>
            <div>Total</div>
        </div>
        <div class="data" v-for="(item,index) in invoices.item_list" :key="index">
            <div class="number">{{index+1}}</div>
            <div>{{item.item_name}}</div>
            <div>{{item.qty}}</div>
            <div>{{item.price|currency}}</div>
            <div>{{item.total|currency}}</div>
        </div>
        <div class="total-all">
            <h1>{{invoices.amount_invoice|currency}}</h1>
        </div>
    </div>
    </div>
     <modal :isopen="showModal" @changeModal="handleModal" :invoice_id="invoices.invoice_id" @successUpdate="readFromRealtimeDb()"/>
  </div>
</template>


<script>
import modal from '~/components/modal.vue'
  import {
    mapGetters
  } from 'vuex'
export default {
    components: {
        modal
    },
    data(){
        return{
            showModal: false,
            invoices: null
        }
    },
    computed: {
      ...mapGetters({
        isLight: 'getIsLight'
      })
    },
    methods: {
        async updateStatus(status) {
            try {
            let invoices = this.$fire.database.ref('invoices/' + this.$route.params.slug);
            invoices.update({
                status
            })
            } catch (error) {
            alert(error)
            return
            }
            alert('Success, Update Data')
            this.readFromRealtimeDb()
        },
        async removeInvoice() {
            if (!confirm('are you sure delete this invoices')) {
            return
            }
            try {
            let invoices = this.$fire.database.ref('invoices/' + this.$route.params.slug);
            invoices.remove()
            } catch (error) {
            alert(e)
            return
            }
            alert('Success, Remove Data')
            this.$router.push('/')
            // this.readFromRealtimeDb()
        },
        editInvoice() {
            this.showModal = true
        },
        handleModal(val){
            console.log(val, 'dff')
            this.showModal = val
        },
        async readFromRealtimeDb() {
            const dbref = this.$fire.database.ref('invoices/'+this.$route.params.slug)
            try {
            const snapshot = await dbref.once('value')
            this.invoices = snapshot.val()
            console.log(snapshot.val(), 'list invoice')
            } catch (e) {
            alert(e)
            return
            }
            console.log('this.invoices', this.invoices)
            console.log('this.invoice_data', this.invoice_data)
      },
    },
    mounted() {
        this.readFromRealtimeDb()
    },
   
}
</script>


<style lang="scss" scoped>
.invoice-detail{
    padding: 3rem 15%;
    min-height: 100vh;
     @media only screen and (max-width: 600px) {
      //   padding-top: 13vh;
      padding: 14vh 1rem 1rem 1rem;
    }
    .btn-group{
        text-align: right;
           @media only screen and (max-width: 600px) {
               display: grid;
               grid-template-columns: 1fr;
           }
        button{
            padding: 1rem 1.4rem;
            color: #fff;
            border-radius: 30px;
            text-align: end;
            margin-right: 10px;
            @media only screen and (max-width: 600px) {
                margin-right: 0;
                margin-bottom: 1rem;
            }
        }
    }

    .summary{
        margin-top: 2rem;
        .header{
            display: flex;
            justify-content: space-between;
        }
        .title, .data{
            display: grid;
            grid-template-columns: 1fr 2fr 1fr 2fr 2fr;
            margin-bottom: 1rem;
             @media only screen and (max-width: 600px) {
                grid-template-columns: 2fr 1fr 2fr 2fr;
            }
        }
        .data-inv{         
            padding: 1rem;
            width: 90%;
            margin: 3rem auto 1rem auto;
            border-radius: 15px;
             @media only screen and (max-width: 600px) {
                width: 100%;
            }
            .total-all{
                text-align: right;
                border-radius: 5px;
                h1{
                    margin: 0;
                    padding: 10px;
                }
            }
            .number{
                 @media only screen and (max-width: 600px) {
                display: none;
            }
            }
        }
    }

    &.dark{
        .data-inv{
            background-color: #4c4c69;
        }
        .total-all{
            background-color: black;
        }
    }

    &.light{
        .data-inv{
            background-color: #dfdffb;
        }
        .total-all{
            background-color: #fff;
        }
    }

  
    
}
</style>
