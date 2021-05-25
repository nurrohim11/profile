const pool = require('../config/db')
const web_helper = require('../helpers/web')

module.exports ={

  skill:async(req, res)=>{
    var baseUrl = req.protocol + '://' + req.get('host')
    try {
      res.render('skill/skill',{
        url:req.originalUrl,
        js:'<script src="'+baseUrl+'/js/skill/skill.js"></script>'
      })
    }catch(err){
      res.render('skill/skill')
    }
  },

  dataSkill:async(req, res)=>{
    try{
      var baseUrl = req.protocol + '://' + req.get('host')
      pool.query("SELECT * from tb_skill a where a.status=1", async(err, result) => {
        const data = []
        const rows = result.rows
        for(let i=0; i < rows.length; i++){
          await data.push([
            i+1, 
            rows[i].skill,
            rows[i].point,
            '<img src="'+baseUrl+"/"+rows[i].icon+'" style="width:100%; "/>',
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

  processSkill:async(req, res)=>{
    const { skill, point, id } = req.body
    const file = req.file
    let status = false
    let message = ''

    if(id == ''){
      if(file == undefined) {
        message : 'Gambar icon tidak boleh kosong'
      }
      else{
        await pool
          .query(
            "INSERT INTO tb_skill (skill,point,icon) VALUES ($1,$2,$3) RETURNING *",
            [skill,point,`images/skill/${file.filename}`]
          )
          .then((response)=>{
            console.log(response)
            status = true
            message = "Skill berhasil disimpan"
          })
          .catch(err=>{
            console.log(err)
            message = "Terjadi kesalahan pada server"
          })
      }
    }
    else{
      try {
        await pool.query('BEGIN')
        // get data skill by id
        const idSkill = await (await pool.query("SELECT * FROM tb_skill a where a.id=$1 ",[id])).rows[0]

        // process update skill
        let icon = (file == undefined) ? idSkill.icon : `images/skill/${file.filename}`
        const query = 'UPDATE tb_skill set skill=$1, point=$2, icon=$3, update_at=now() where id =$4  RETURNING *'
        await pool.query(query, [skill,point,icon,id])
        await pool.query('COMMIT')
        status = true;
        message = "Skill berhasil diupdate"
      } catch (e) {
        console.log(e)
        await pool.query('ROLLBACK')
        message = "Skill gagal diupdate"
      }
    }
    res.json({
      status : status,
      message : message
    })
  },

  deleteSkill:async(req, res)=>{
    const { id } = req.body
    let status = false;
    let message = ""

    await pool
      .query("UPDATE tb_skill set status = 0 where id = $1",
      [id])
      .then(async(res)=>{
        console.log('res',res)
        if(res.rowCount == 1){
          status = true
          message = "Skill berhasil dihapus"
        }
        else{
          message = "Skill gagal dihapus"
        }
      })
      .catch(err=>{
        console.log(err)
        message = "Skill berhasil dihapus"
      })
      res.json({
        status:status,
        message : message
      })
  },

  idSkill:async(req, res)=>{
    const { id } = req.body
    let status = false;
    let message = ''
    let response = []
    console.log(id)
    await pool
      .query("SELECT * FROM tb_skill a where a.id = $1",[id])
      .then((res)=>{
        if(res.rowCount > 0){
          status = true
          message = "Berhasil"
          response = res.rows[0]
        }
        else{
          message = "Data skill tidak ditemukan"
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