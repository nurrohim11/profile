const pool = require("../config/db")

module.exports ={

  dashboard:async(req, res)=>{
    try {
      res.render('main/dashboard',{
        url:req.originalUrl
      })
    }catch(err){
      res.render('main/dashboard')
    }
  },

  contact:async(req, res)=>{
    var baseUrl = req.protocol + '://' + req.get('host')
    try {
      res.render('main/contact',{
        url:req.originalUrl,
        js:'<script src="'+baseUrl+'/js/main/main.js"></script>'
      })
    }catch(err){
      res.render('main/contact')
    }
  },

  viewContact:async(req, res)=>{
    response = []
    status = false
    message = ''
    const query = await pool
      .query("SELECT * FROM contact limit 1")
    if(query.rowCount > 0){
      status = true
      message = 'Berhasil'
      response = query.rows[0]
    }
    else{
      status = false
      message = 'Data tidak ada'
    }
    res.json({
      status:status,
      message:message,
      response :response
    })
  },

  updateContact:async(req, res)=>{
    const { nama, email, maps, alamat } = req.body
    const file = req.file
    status = false
    message = ''

    const contact = await pool.query("SELECT * FROM contact a limit 1")
    if(contact.rowCount > 0){
      let foto = (file == undefined ) ? contact.rows[0].foto : `images/${file.filename}`
      await pool
        .query("UPDATE contact set alamat=$1, nama=$2, email=$3, maps=$4, foto=$5",
        [alamat, nama, email, maps, foto])
        .then(async(resp)=>{
          if(resp.rowCount > 0){
            status = true
            message = "Contact berhasil diupdate"
          }
          else{
            message = 'Contact gagal diupdate'
          }
        })
        .catch(err=>{
          console.log(err)
          message = "Terjadi kesalahan data"
        })
    }
    else{
      if(req.file == undefined){
        message = "Foto tidak boleh kosong"
      }
      else{
        await pool
        .query("INSERT INTO contact (alamat, email, maps, foto) value($1,$2, $3,$4,$5)",
        [alamat, nama, email, maps, foto])
        .then(async(resp)=>{
          if(resp.rowCount > 0){
            status = true
            message = "Contact berhasil dimasukkan"
          }
          else{
            message = 'Contact gagal dimasukkan'
          }
        })
        .catch( err=>{
          message = 'Terjadi kesalahan data'
        })
      }
    }
    res.json({
      status:status,
      message:message
    })
  }
  
}