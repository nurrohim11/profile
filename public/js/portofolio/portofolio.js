var table = $("#tbl-portofolio").DataTable({
	processing : true,
	responsive :true,
	language : {
		processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size:36px;"></i><span class="sr-only"></span> '
	},
	ajax : '/portofolio/data_portofolio',
	columns : [
		{'orderable' : false},
		null,
		null,
		null,
		{'orderable' : false},
	]
});

const clear_form=()=>{
  $('#form').trigger('reset')
  $('#id').val('')
  $('#token').val('')
}

const validator =  $('#form').validate({
  rules:{
    title:{
      required:true
    },
    content:{
      required:true
    },
  }
})

var rand = function() {
  return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
  return rand() + rand(); // to make it longer
};

Dropzone.autoDiscover = false;

var foto_upload= new Dropzone("#kt_dropzone_3",{
	url: base_url+"portofolio/upload_image_portofolio",
	maxFilesize: 10,
	method:"post",
	acceptedFiles:"image/*",
	paramName:"userfile",
	dictInvalidFileType:"Type file ini tidak dizinkan",
	addRemoveLinks:true,
  //Menghapus file dari database menggunakan ajax
	removedfile: function(file) {
		$.ajax({
			type: 'POST',
			url: base_url+"portofolio/delete_image_portofolio",
			data: {token_foto: file.token},
			sucess: function(data){
				console.log('success: ' + data);
			}
		});
		var ref;
		if((ref = file.previewElement) != null){
			return ref.parentNode.removeChild(file.previewElement);        
		}
		return false;
  },
});

//Event ketika Memulai mengupload
foto_upload.on("sending",function(a,b,c){
	a.token=Math.random();
	c.append("size",a.size); //Size foto
	c.append("token_foto",a.token); //Menmpersiapkan token untuk masing masing foto
	c.append("token",$('#token').val())
});

$('#add').click(()=>{
  $('#modal').modal('show')
  clear_form()
  $('#token').val(token())
  validator.resetForm()
	$('.dz-preview').remove()
	$(".dropzone.dz-started .dz-message").css({ 'display' : ''});
	$.get(base_url+"portofolio/image_portofolio/"+$('#token').val(), function(data) {
		$.each(data, async(key,value)=>{
			if(key == 'response'){
				await console.log(value+" "+key);
				if (value.length > 0) {
					var i;
					for (i = 0; i < value.length; i++) {
						var mockFile = { name: value[i].name_image, token: value[i].token_foto,size:value[i].size  };
						foto_upload.options.addedfile.call(foto_upload, mockFile);
						foto_upload.options.thumbnail.call(foto_upload, mockFile, base_url+"/"+value[i].image);	
					}
				}
			}
		});
	});
})

const $form = $('#form')

$form.on('submit', submitHandler)

function submitHandler (e) {
  e.preventDefault()

  KTApp.block('#modal .modal-content', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'primary',
    message: 'Please wait...'
  });

  $.ajax({
    url: '/portofolio/process_portofolio',
    type:'POST',
    data: $form.serialize()
  })
	.done(response => {
    KTApp.unblock('#modal .modal-content');
		if(response.status == true){
			toastr.success(response.message)
			$('#modal').modal('hide')
			table.ajax.reload(null, false)
		}
		else{
			toastr.warning(response.message)
		}
  })
}

$(document).on('click','.delete',function(){
	swal({
		text: "Apakah anda yakin ingin menghapus data ini",
		icon :"warning",
		buttons :true,
		dangerMode:true
	})
	.then((willDelete)=>{
		if(willDelete){
			const refid = $(this).data('refid')
			$.post('/portofolio/delete_portofolio',{id:refid},
				(data, status, xhr)=>{
					if(data.status){
						toastr.success(data.message)
						$('#modal').modal('hide')
						table.ajax.reload(null, false)
					}
					else{
						toastr.error('Data tidak ditemukan')
					}
				},"json"
			)
		}
	})
})

$(document).on('click','.update',function(){
	const id = $(this).data('refid')
	$.post('/portofolio/id_portofolio',{id : id},
		(data, status, xhr)=>{
			if(data.status){
				console.log(data.response)
				$('#modal').modal('show')
				$('#id').val(data.response.id)
				$('#token').val(data.response.token)
				$('#title').val(data.response.title)
				$('#technology').val(data.response.technology)
				$('#content').val(data.response.content)

				$.get(base_url+"portofolio/image_portofolio/"+data.response.token, function(data) {
				$.each(data, function(key,value){
					if(key === 'response'){
						console.log('key'+key+" value"+value)
						if (value.length > 0) {
							var i;
							for (i = 0; i < value.length; i++) {
								var mockFile = { name: value[i].name_image, token: value[i].token_foto,size:value[i].size  };
								foto_upload.options.addedfile.call(foto_upload, mockFile);
								foto_upload.options.thumbnail.call(foto_upload, mockFile, base_url+value[i].image);	
							}
						}
					}
				});
			});
			}
			else{
				toastr.error('Data tidak ditemukan')
			}
		},"json"
	)
})