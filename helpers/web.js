const buttonEdit=(refId)=>{
  return '<button type="button" class="btn btn-success btn-elevate btn-pill btn-sm update" data-refid="'+refId+'"><span class="fa fa-edit fa-sm"></span></button>'
}

const buttonDelete=(refId)=>{
  return '<button type="button" class="btn btn-danger btn-elevate btn-pill btn-sm delete" data-refid="'+refId+'"><span class="fa fa-trash fa-sm"></span></button>'
}

const printJson=(status, message, response)=>{
  const json = {
    status:status,
    message: message,
    response:response
  }
  JSON.stringify(json,null,4)
}

module.exports ={
  buttonDelete, buttonEdit, printJson
}