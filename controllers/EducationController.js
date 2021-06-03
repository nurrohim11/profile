const pool = require('../config/db')
const web_helper = require('../helpers/web')

module.exports ={

  education:async(req, res)=>{
    var baseUrl = req.protocol + '://' + req.get('host')
    try {
      res.render('education/education',{
        url:req.originalUrl,
        js:'<script src="'+baseUrl+'/js/education/education.js"></script>',
        bulan : ["Januari","Pebruari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
      })
    }catch(err){
      res.render('education/education')
    }
  },

  dataEducation:async(req, res)=>{
    try{
      pool.query("SELECT * from ms_education a where a.status=1", async(err, result) => {
        const data = []
        const rows = result.rows
        for(let i=0; i < rows.length; i++){
          await data.push([
            i+1, 
            rows[i].education,
            rows[i].deskripsi,
            rows[i].bulan_masuk+'/'+rows[i].tahun_masuk,
            (rows[i].present) ? 'Present' :rows[i].bulan_keluar+'/'+rows[i].tahun_keluar,
            web_helper.buttonEdit(rows[i].id)+web_helper.buttonDelete(rows[i].id)
          ])
        }
        res.json({data:data})
      });
    }
    catch(err){
      res.json({data:[]})
    }
  },

  processEducation:async(req, res)=>{
    const { id, education, bulan_masuk, tahun_masuk, bulan_keluar, tahun_keluar, deskripsi } = req.body
    let status = false
    let message = ''

    if(id == ''){
      await pool
        .query("INSERT INTO ms_education (education, deskripsi, bulan_masuk, tahun_masuk, bulan_keluar, tahun_keluar)\
           values ($1, $2, $3, $4, $5, $6)",[education, deskripsi, bulan_masuk, tahun_masuk, bulan_keluar, tahun_keluar])
        .then(async(res)=>{
          if(res.rowCount > 0){
            status = true
            message = "Data berhasil disimpan"
          }
          else{
            message = "Data gagal disimpan"
          }
        })
        .catch(err=>{
          console.log(err)
          message = "Terjadi kesalahan data"
        })
    }
    else{
      await pool
        .query("UPDATE ms_education set education=$1, deskripsi=$2, bulan_masuk =$3, tahun_masuk=$4, bulan_keluar=$5,\
          tahun_keluar=$6 where id = $7",[education, deskripsi, bulan_masuk, tahun_masuk, bulan_keluar, tahun_keluar, id])
        .then(async(res)=>{
          if(res.rowCount > 0){
            status = true
            message = "Data berhasil diperbarui"
          }
          else{
            message = "Data gagal diperbarui"
          }
        })
        .catch(err=>{
          console.log(err)
          message = "Terjadi kesalahan data"
        })
    }

    res.json({
      status:status,
      message : message
    })
  },

  deleteEducation:async(req, res)=>{
    const { id } = req.body
    let status = false;
    let message = ""

    await pool
      .query("UPDATE ms_education set status = 0 where id = $1",
      [id])
      .then(async(res)=>{
        console.log('res',res)
        if(res.rowCount == 1){
          status = true
          message = "Data berhasil dihapus"
        }
        else{
          message = "Data gagal dihapus"
        }
      })
      .catch(err=>{
        console.log(err)
        message = "Data gagal dihapus"
      })
      res.json({
        status:status,
        message : message
      })
  },

  id_education:async(req, res)=>{
    const { id } = req.body
    let status = false;
    let message = ''
    let response = []
    console.log(id)
    await pool
      .query("SELECT * FROM ms_education a where a.id = $1",[id])
      .then((res)=>{
        if(res.rowCount > 0){
          status = true
          message = "Berhasil"
          response = res.rows[0]
        }
        else{
          message = "Data education tidak ditemukan"
        }
      })
      .catch(err=>{
        console.log(err)
      })
    res.json({
      status:status,
      message:message,
      response:response
    })
  }
  
}