const pool = require("../config/db")

module.exports ={
  
  skill:async(req, res)=>{
    let status = 404
    let message = ""
    let response = []
    try{
      var baseUrl = req.protocol + '://' + req.get('host')
      await pool
        .query("SELECT * FROM tb_skill a where a.status = 1")
        .then(async(resp)=>{
          if(resp.rowCount > 0){
            status =200
            message = "Berhasil"
            for(let i=0; i < resp.rows.length; i++){
              await response.push({
                skill : resp.rows[i].skill,
                point : resp.rows[i].point,
                icon : baseUrl+"/"+resp.rows[i].icon 
              })
            }
          }
          else{
            status= 404
            message = "Data tidak ada"
          }
        })
        .catch(err=>{
          status =405
          message = err.message
        })
    }catch(err){
      status = 400
      message = "Internal server error"
    }
    res.printJson(status, message, response)
  },
  
  portofolio:async(req, res)=>{
    let status = 404
    let message = ""
    let response = []
    try{
      var baseUrl = req.protocol + '://' + req.get('host')
      await pool
        .query("SELECT * FROM tb_portofolio a where a.status = 1")
        .then(async(resp)=>{
          if(resp.rowCount > 0){

            for(let i=0; i < resp.rows.length; i++){

              let image = []
              await pool.query("SELECT * FROM image_portofolio a where a.token = $1 and a.status = 1",[resp.rows[i].token])
                .then(async(res)=>{
                  for (let j=0; j < res.rows.length; j++){
                    await image.push({
                      image : baseUrl+res.rows[j].image
                    })
                  }
                })

              await response.push({
                id : resp.rows[i].id,
                title : resp.rows[i].title,
                content : resp.rows[i].content,
                technology : resp.rows[i].technology,
                icon : image
              })
            }
            status =200
            message = "Berhasil"
          }
          else{
            status= 404
            message = "Data tidak ada"
          }
        })
        .catch(err=>{
          status =405
          message = err.message
        })
    }catch(err){
      status = 400
      message = "Internal server error"
    }
    res.printJson(status, message, response)
  },

  contact_me:async(req, res)=>{
    let status = 404
    let message = ""
    let response = []
    try{
      var baseUrl = req.protocol + '://' + req.get('host')
      await pool
        .query("SELECT * FROM contact")
        .then(async(resp)=>{
          if(resp.rowCount > 0){
            response = {
              nama : resp.rows[0].nama,
              email : resp.rows[0].email,
              maps : resp.rows[0].maps,
              alamat : resp.rows[0].alamat,
              foto : baseUrl+"/"+resp.rows[0].foto,
            }
            status =200
            message = "Berhasil"
          }
          else{
            status= 404
            message = "Data tidak ada"
          }
        })
        .catch(err=>{
          status =405
          message = err.message
        })
    }catch(err){
      status = 400
      message = "Internal server error"
    }
    res.printJson(status, message, response)
  },

  message:async(req, res)=>{
    let status = 400
    let message = ''
    let response = []
    try{
      const { nama, email, msg } = req.body
      await pool.query("INSERT INTO tb_message (nama, email, message) values ($1, $2, $3)",[nama, email, msg])
          .then(async(resp)=>{
            if(resp.rowCount > 0){
              status = 200
              message = "Terima kasih telah mengirim kami pesan"
            }
            else{
              status = 400
              message = "Pesan gagal dikirim"
            }
          })
          .catch(err=>{
            console.log(err)
            status = 400
            message = "Terjadi kesalahan data"
          })
    }catch(err){
      console.log(err)
      status = 400
      message = "Internal server error"
    }
    res.printJson(status, message, response)
  }

}