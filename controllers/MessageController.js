const pool = require('../config/db')

module.exports={

  message:async(req, res)=>{
    var baseUrl = req.protocol + '://' + req.get('host')
    try {
      res.render('message/message',{
        url:req.originalUrl,
        js:'<script src="'+baseUrl+'/js/message/message.js"></script>'
      })
    }catch(err){
      res.render('message/message')
    }
  },
  
  dataMessage:async(req, res)=>{
    try{
      pool.query("SELECT * from tb_message", async(err, result) => {
        const data = []
        const rows = result.rows
        for(let i=0; i < rows.length; i++){
          await data.push([
            i+1, 
            rows[i].nama,
            rows[i].email,
            rows[i].no_telp,
            rows[i].message,
          ])
        }
        res.json({data:data})
      });
    }
    catch(err){
      res.json({data:[]})
    }
  },

}