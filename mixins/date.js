export default {
    methods: {
      toDate(dateInput, dateformat=null) {
        var date = new Date(dateInput);
        var tahun = date.getFullYear();
        var bulan = date.getMonth();
        var tanggal = date.getDate();
        var hari = date.getDay();
        var jam = date.getHours();
        var menit = date.getMinutes();
        var detik = date.getSeconds();
        var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        switch(hari) {
        case 0: hari = "Minggu"; break;
        case 1: hari = "Senin"; break;
        case 2: hari = "Selasa"; break;
        case 3: hari = "Rabu"; break;
        case 4: hari = "Kamis"; break;
        case 5: hari = "Jum'at"; break;
        case 6: hari = "Sabtu"; break;
        }
        switch(bulan) {
        case 0: bulan = "Januari"; break;
        case 1: bulan = "Februari"; break;
        case 2: bulan = "Maret"; break;
        case 3: bulan = "April"; break;
        case 4: bulan = "Mei"; break;
        case 5: bulan = "Juni"; break;
        case 6: bulan = "Juli"; break;
        case 7: bulan = "Agustus"; break;
        case 8: bulan = "September"; break;
        case 9: bulan = "Oktober"; break;
        case 10: bulan = "November"; break;
        case 11: bulan = "Desember"; break;
        }
        let jams =  jam.toString().length == 1 ? '0' + jam: jam;
        let menits = menit.toString().length == 1 ? '0' + menit: menit;
        var tampilTanggal = "" + hari + ", " + tanggal + " " + bulan + " " + tahun;
        var tampilWaktu = " " + jams + ":" + menits;
        // return `${tampilTanggal} ${tampilWaktu}`
        if(dateformat) {
            return `${tahun}-${date.getMonth()+1 < 10 ? '0':''}${date.getMonth()+1}-${date.getDay()+1 < 10 ? '0':''}${date.getDay()}`
        }
        return tampilTanggal
      },
      due_date(invoice_date, term) {
        var inv_date = new Date(invoice_date);
        return this.toDate(inv_date.setDate(inv_date.getDate() + term))
      }
    },
  }