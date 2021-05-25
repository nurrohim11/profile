function readURL(input) {
  if (input.files && input.files[0]) {
  var reader = new FileReader();
  reader.onload = function (e) {
    $('#preview').attr('src', e.target.result);
  };
  reader.readAsDataURL(input.files[0]);
  }
}

$.get('/main/view_contact', 
  (data, status, xhr)=> {
    $('#nama').val(data.response.nama)
    $('#email').val(data.response.email)
    $('#maps').val(data.response.maps)
    $('#alamat').val(data.response.alamat)
    if(data.response.foto != '' || data.response.foto != null){
      $('#preview').removeAttr('src')
      $('#preview').attr('src',base_url+data.response.foto)
    }
	},"json"
);

$('#form').submit(function(event){
  event.preventDefault()
  KTApp.block('.kt-portlet', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'primary',
      message: 'Please wait...'
  });
  var formData = new FormData()
  formData.append('nama', document.getElementById('nama').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('image', document.getElementById('image').files[0]);
  formData.append('maps', document.getElementById('maps').value);
  formData.append('alamat', document.getElementById('alamat').value);
  $.ajax({
    type: "POST",
    url: "/contact/update_contact",
    processData: false,
    contentType: false,
    dataType: 'json',
    data: formData,
    success: async(response)=> {
      KTApp.unblock('.kt-portlet');
      console.log(response)
    },
    error:(err=>{
      KTApp.unblock('.kt-portlet');
      console.log(err)
    })
  });
})