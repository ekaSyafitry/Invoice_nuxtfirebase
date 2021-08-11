<template>
  <div class="modal" :class="{ 'active': isopen , 'light': isLight, 'dark': !isLight}">
    <div class="overlay">
        <div @click="$emit('changeModal', false )" class="closemodal"></div>
      <div class="modal-card">
          <h2 v-if="action == 'add'">Add Invoice</h2>
        <h2 v-else>Edit #{{invoice_id}}</h2>
        <form @submit.prevent="updateData">
        <div class="bill-from sec">
          <div class="title-section">
            Bill From
          </div>
          <div class="form-group">
            <label for="street">Street Address</label>
            <input type="text" v-model="form_invoices.bill_from.street" required maxlength="50">
          </div>
          <div class="input-group">
            <div class="form-group">
              <label for="city"> City</label>
              <input type="text" v-model="form_invoices.bill_from.city" required maxlength="50">
            </div>
            <div class="form-group">
              <label for="code"> Post Code</label>
              <input type="number" v-model="form_invoices.bill_from.postcode" required maxlength="5" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
            </div>
            <div class="form-group">
              <label for="country"> Country</label>
              <input type="text" v-model="form_invoices.bill_from.country" required maxlength="50">
            </div>
          </div>
        </div>
        <div class="bill-to sec">
          <div class="title-section">
            Bill To
          </div>
          <div class="form-group">
            <label for="name"> Client's Name</label>
            <input type="text" v-model="form_invoices.bill_to.name" required maxlength="50">
          </div>
          <div class="form-group">
            <label for="email">Client's Email</label>
            <input type="email" v-model="form_invoices.bill_to.email" required>
          </div>
          <div class="form-group">
            <label for="street-to" > Street Address</label>
            <input type="text" v-model="form_invoices.bill_to.street" required maxlength="50">
          </div>
          <div class="input-group">
            <div class="form-group">
              <label for="city"> City</label>
              <input type="text" v-model="form_invoices.bill_to.city" required maxlength="50">
            </div>
            <div class="form-group">
              <label for="code"> Post Code</label>
              <input type="number" v-model="form_invoices.bill_to.postcode" required maxlength="5" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
            </div>
            <div class="form-group">
              <label for="country" > Country</label>
              <input type="text" v-model="form_invoices.bill_to.country" required maxlength="50">
            </div>
          </div>
          <div class="input-group-2">
            <div class="form-group">
              <label for="date">Invoice Date</label>
              <input type="date" v-model="form_invoices.invoice_date" required>
            </div>
            <div class="form-group">
              <label for="payment">Payment Terms</label>
              <select name="payment" id="payment" v-model="form_invoices.payment_term" required>
                <option :value="30">Next 30 Days</option>
                <option :value="90">Next 90 Days</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="desc">Project Description</label>
            <input type="text" v-model="form_invoices.project_description" required maxlength="50">
          </div>
        </div>
        <div class="item-list" >
          <h3>Item List</h3>
          <div class="title-table grid">
            <div>Item Name</div>
            <div>Qty</div>
            <div>Price</div>
            <div>Total</div>
          </div>
          <div class="data-list grid" v-for="(item,index) in form_invoices.item_list" :key="index">
            <div class="box">{{item.item_name}}</div>
            <div class="box">{{item.qty}}</div>
            <div class="box">{{item.price | currency}}</div>
            <div class="bold">{{item.total | currency}} <i class="fas fa-trash" @click="deleteItems(index)"></i></div>
          </div>
          <div v-if="showInput" >
              <div class="addInput">
                  <div class="form-group">
                      <label>Item Name</label>
                   <input type="text" v-model="item_form.item_name" maxlength="50">
                  </div>
                   <div class="form-group">
                      <label>Qty</label>
                    <input type="number" v-model="item_form.qty">
                   </div>
                    <div class="form-group">
                      <label>Price</label>
                    <input type="number" v-model="item_form.price">
                    </div>
              </div>
         
          <button @click="addItem()" class="addInputBtn">Add</button>
          </div>
          
          <button class="add" @click="showInput = true" v-if="!showInput">+ Add New Item</button>
          <div class="btn-group">
            <button class="transparent" type="button" @click="showModal()">Cancel</button>
            <button class="purple" type="submit"> Save Changes</button>
          </div>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
 import date from '~/mixins/date'
export default {
    props: ['isopen', 'invoice_id'],
    mixins: [date],
    data() {
        return {
            action: null,
            showInput: false,
            item_form: {
                item_name: '',
                qty: 0,
                price: 0
            },
            form_invoices: {
                invoice_id: this.invoice_id || null,
                status: 'Pending',
                bill_from: {
                    street: '',
                    city: '',
                    postcode: '',
                    country: ''
                },
                bill_to: {
                    name: '',
                    email: '',
                    street: '',
                    city: '',
                    postcode: '',
                    country: ''
                },
                invoice_date: new Date(),
                payment_term: 30,
                project_description: '',
                item_list: [],
                amount_invoice: 0, // total of item
            }
        }
    },
    mounted(){
        console.log(this.isopen, 'open')
        if(!this.form_invoices.invoice_id) {
            this.action = 'add'
            this.form_invoices.invoice_id = this.makeid(5)
        }
    },
     computed: {
      ...mapGetters({
        isLight: 'getIsLight'
      })
    },
    watch: {
        isopen(newval) {
            if(newval){
                this.readFromRealtimeDb()
            }
        },
        invoice_id() {
            this.readFromRealtimeDb()
        }
    },
    methods: {
        makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        addItem() {
            // console.log(this.item_form, 'this.item_form')
            let data = {
                item_name: this.item_form.item_name,
                qty: this.item_form.qty,
                price: this.item_form.price,
                total: this.item_form.price*this.item_form.qty
            }
            this.form_invoices.item_list.push(data)
            this.item_form.item_name = ''
            this.item_form.qty = 0
            this.item_form.price = 0
            this.showInput = false
        },
        deleteItems(index) {
            if(!confirm('are you sure delete this items?')) {
                return;
            }
            if (index > -1) {
            this.form_invoices.item_list.splice(index, 1);
            }
        },
        showModal(){
            if(this.action == 'add' && confirm('Dou you wanna make invoice draft?')){
                this.form_invoices.status = 'Draft'
                this.updateData()
            }
            this.$emit('changeModal', false )
        },
        async updateData() {
            try {
                let inv_date = new Date(this.form_invoices.invoice_date)
                this.form_invoices.invoice_date = inv_date.getTime()
                this.form_invoices.item_list.map(item=>{
                    this.form_invoices.amount_invoice += item.total
                })
                if(this.action=='add') {
                    const messageRef = this.$fire.database.ref('invoices')
                    await messageRef.push().set({
                        ...this.form_invoices
                    })
                    alert('Success. Create Invoice')
                    // this.readFromRealtimeDb()
                    this.$emit('changeModal', false )
                    this.$emit('successUpdate')
                    return
                }
            let invoices = this.$fire.database.ref('invoices/' + this.$route.params.slug);
            console.log(this.form_invoices, 'form_invoices')
            invoices.update({
                ...this.form_invoices
            })
            } catch (error) {
            alert(error)
            return
            }
            alert('Success, Update Data')
            // this.readFromRealtimeDb()
            this.$emit('changeModal', false )
            this.$emit('successUpdate')
        },
        async readFromRealtimeDb() {
            if(this.action=='add') {
                return
            }
            const dbref = this.$fire.database.ref('invoices/'+this.$route.params.slug)
            try {
            const snapshot = await dbref.once('value')
            this.form_invoices = snapshot.val()
            this.form_invoices.invoice_date = this.toDate(this.form_invoices.invoice_date, 'dateformat')
            console.log(this.toDate(new Date(this.form_invoices.invoice_date), 'dateformat'), 'dateformat')
            console.log(snapshot.val(), 'list invoice')
            } catch (e) {
            alert(e)
            return
            }
      },
    }
}
</script>
<style lang="scss" scoped>
  .modal {
    .overlay {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 7%;
      right: 0;
      background-color: #06060ac7;
      opacity: 0;
      visibility: hidden;
      transition: opacity ease 0.5s;
      overflow: auto;
        @media only screen and (max-width: 600px) {
            left: 0;
            top: 14vh;
        }
      .modal-card {
        overflow-y: auto;
        overflow-x: hidden;
        // max-height: 100vh;
        width: 40%;
        padding: 2rem;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        transform: translateX(-200px);
        transition: transform ease-out 0.3s;
        @media only screen and (max-width: 600px) {
            width: 100%;
        }

        .title-section {
          font-weight: bold;
          color: $purple;
          margin-bottom: 2rem;
        }

        .sec {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1rem;

          input,
          select {
            width: 100%;
            // border: 1px solid #131429;
            padding: 12px;
            border-radius: 5px;
            font-weight: bold;
          }
        }

        .input-group {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 1rem;
        }

        .input-group-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 3fr 1fr 2fr 2fr;
          margin-bottom: 1rem;
          grid-gap: 1rem;
          align-items: center;

          i {
            float: right;
          }

          .box {
            padding: 12px;
            border-radius: 5px;
            font-weight: bold;
          }

        }

        .add {
          width: 100%;
          padding: 12px;
        //   font-weight: bold;
          border-radius: 20px;
          margin-bottom: 2rem;
        }
        .btn-group{
            text-align: right;
            button{
                color: #fff;
                padding: 1rem 1.4rem;
                border-radius: 30px;
                margin-left: 5px;
            }
        }
        .addInput{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            margin-bottom: 1rem;
            grid-gap: 1rem;
        }
        .addInputBtn{
            padding: 1rem 2rem;
            border-radius: 30px;
        }
      }
    }

    .closemodal{
        position: absolute;
        top: 0;
      bottom: 0;
      left: 7%;
      right: 0;
    }

    &.dark {
      .modal-card {
        background-color: #131429;

        input,
        select,
        .box,
        .add, .transparent{
          background-color: #a7a9e82e;
          border: 1px solid #393a4c;
          color: #fff;
        }
      }
    }

    &.light{
        .modal-card {
        background-color: #fff;

        input,
        select,
        .box,
        .add, .transparent{
          background-color: #a7a9e82e;
          border: 1px solid #dfe0f5;
          color: black !important;
        }
      }
    }
      &.active{
          .overlay{
               opacity: 1;
            visibility: visible;
          }
          .modal-card{
              transform: translateX(0);
          }
       
    }
  }

</style>
