const pool = require("../config/db")
const { buttonEdit, buttonDelete } = require("../helpers/web")

module.exports={
  
  portofolio:async(req, res)=>{
    var baseUrl = req.protocol + '://' + req.get('host')
    try {
      res.render('portofolio/portofolio',{
        url:req.originalUrl,
        js:'<script src="'+baseUrl+'/js/portofolio/portofolio.js"></script>'
      })
    }catch(err){
      res.render('portofolio/portofolio')
    }
  },

  dataPortofolio:async(req, res)=>{
    try{
      pool
      .query(
          'select a.*,COALESCE(b.jumlah,0) as jml from tb_portofolio a left join ( select count(*) as jumlah ,ip."token"  from image_portofolio ip  where ip.status =1 group by ip."token" ) b on b.token = a."token" where a.status=1',async(err, result) => {
        const data = []
        const rows = result.rows
        for(let i=0; i < rows.length; i++){
          await data.push([
            i+1, 
            rows[i].title,
            rows[i].technology,
            rows[i].jml+" foto",
            buttonEdit(rows[i].id)+buttonDelete(rows[i].id)
          ])
        }
        res.json({data:data})
      });
    }
    catch(err){
      res.json({data:[]})
    }
  },

  procesPortofolio:async(req, res)=>{
    try{
      const { token, title, id, content, technology } = req.body
      console.log(req.body)
      status =false
      message = ''
      if(id == ''){
        await pool
          .query("INSERT INTO tb_portofolio (title, content, technology, token) values ($1, $2, $3, $4)",
            [title, content, technology, token])
          .then(async(response)=>{
            if(response.rowCount > 0){
              status = true
              message = 'Portofolio berhasil ditambah'
            }
            else{
              message = 'Portofolio gagal ditambah'
            }
          })
      }
      else{
        await pool
          .query("UPDATE tb_portofolio set title=$1, content=$2, token=$3, technology=$5 where id = $4",
            [title, content, token, id, technology])
          .then(async(response)=>{
            if(response.rowCount > 0){
              status = true
              message = 'Portofolio berhasil diubah'
            }
            else{
              message = 'Portofolio gagal diubah'
            }
          })
      }
    }catch(err){
      status =false
      message = "Terjadi kesalahn data"
    }
    res.json({
      status:status,
      message:message
    })
  },

  idPortofolio:async(req, res)=>{
    const { id } = req.body
    let status = false;
    let message = ''
    let response = []
    await pool
      .query("SELECT * FROM tb_portofolio a where a.id = $1",[id])
      .then((res)=>{
        if(res.rowCount > 0){
          status = true
          message = "Berhasil"
          response = res.rows[0]
        }
        else{
          message = "Data portofolio tidak ditemukan"
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
  },

  deletePortofolio:async(req, res)=>{
    let status  = false
    message = ''
    try{
      const { id } = req.body
      await pool
        .query("UPDATE tb_portofolio set status = 0 where id =$1",[id])
        .then(response=>{
          if(response.rowCount > 0){
            status = true
            message  = "Portofolio berhasil diupdate"
          }
          else{
            message = 'Portofolio gagal diupdate'
          }
        })
        .catch(err=>{
          message = "Terjadi kesalahan data"
        })
    }catch(err){
      message = "Internal server error"
    }
    res.json({
      status:status,
      message:message
    })
  },

  uploadImagePortofolio:async(req, res)=>{
    let status = false
    let message = ''
    try{
      const { token_foto, token } = req.body
      const filename = `images/portofolio/${req.file.filename}`
      const filesize = req.file.size
      await pool
        .query("INSERT INTO image_portofolio (image, token_image, token, size, name_image) values ($1, $2, $3, $4, $5)",
          [filename, token_foto, token, filesize, req.file.filename])
        .then((response)=>{
          if(response.rowCount > 0){
            status = true
            message = "Foto portofolio berhasil diupload"
          }
          else{
            message = "Foto portofolio gagal diupload"
          }
        })
    }catch(err){
      console.log(err)
      message = "Terjadi kesalahan data"
    }
    res.json({
      status:status,
      message:message
    })
  },

  imagePortofolio:async(req, res)=>{
    
    const { token } =req.params
    let status =false;
    let message = '';
    let response = [] 

    const query = await pool.query("SELECT * FROM image_portofolio a where a.token = $1",[token])
    if(query.rowCount > 0){
      response = query.rows
      status = true
      message = "Berhasil"  
    }
    else{
      message = "Foto tidak ada"
    }
    res.json({
      status:status,
      message:message,
      response:response
    })
  },

  deleteImagePortofolio:async(req, res)=>{
    let status = false
    let message = ''
    try{
      const { token_foto } =req.body

      const delete_img = await pool.query("DELETE FROM image_portofolio where token_image=$1",[token_foto])

      if(delete_img.rowCount > 0){
        status = true
        message = "Berhasil"
      }
      else{
        message = "Gagal"
      }
    }catch(err){
      message = "Terjadi kesalahan data"
    }
    res.json({
      status:status,
      message:message
    })
  }

}