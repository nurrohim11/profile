var table = $("#tbl-education").DataTable({
	processing : true,
	responsive :true,
	language : {
		processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size:36px;"></i><span class="sr-only"></span> '
	},
	ajax : '/education/data_education',
	columns : [
		{'orderable' : false},
		null,
		null,
		null,
		null,
		{'orderable' : false},
	]
});

$('#bulan_masuk').select2({
	width:'100%',
	placeholder:'Bulan masuk'
})
$('#bulan_keluar').select2({
	width:'100%',
	placeholder:'Bulan selesai'
})

$('#add').click(async()=>{
	await clearForm()
	$('#note_icon').hide()
	$('#modal').modal('show')
})

var validator = $('#form').validate({
	rules:{
		education:{
			required:true
		},
		bulan_masuk:{
			required:true,
		},
		tahun_masuk:{
			required:true
		},
		bulan_keluar:{
			required:true,
		},
		tahun_keluar:{
			required:true
		},
		deskripsi:{
			required:true,
		},
	}
})

const clearForm=()=>{
	$('#form').trigger('reset')
	$('#id').val('')
	$('#bulan_masuk').val('').trigger('change')
	$('#bulan_keluar').val('').trigger('change')
	validator.resetForm()
}

$('#form').submit(function(event){

    if (!validator.valid()) {
      return false;
    }
		
		event.preventDefault();
		var formData = $('#form').serialize()
		$.ajax({
			type: "POST",
			url: "/education/process_education",
			processData: false,
			dataType: 'json',
			data: formData,
			beforeSend:()=>{
				KTApp.block('#form .modal-content', {
					overlayColor: '#000000',
					type: 'v2',
					state: 'primary',
					message: 'Processing...'
				});
			},
			complete:()=>{
				KTApp.unblock('#form .modal-content');
			},
			success: async(response)=> {
				KTApp.unblock('#form .modal-content');
				if(response.status == true){
					toastr.success(response.message)
					await $('#modal').modal('hide')
					table.ajax.reload(null, false)
				}
				else{
					toastr.warning(response.message)
				}
			},
			error:(err=>{
				KTApp.unblock('#form .modal-content');
				console.log(err)
			})
		});

		return false;
})

$(document).on('click','.delete',function(){
	let refId = $(this).data('refid')
	swal({
		text: "Apakah anda yakin ingin menghapus data ini",
		icon :"warning",
		buttons :true,
		dangerMode:true
	})
	.then((willDelete)=>{
		if(willDelete){
			$.post('/education/delete_education', {id : refId}, 
				(data, status, xhr)=> {
					if(data.status){
						table.ajax.reload(null, false)
						toastr.success(data.message)
					}
					else{
						toastr.danger(data.message)
					}
				},"json"
			);
		}
	})
})

$(document).on('click','.update',function(){
	const id = $(this).data('refid')
	$.post('/education/id_education',{id : id},
		(data, status, xhr)=>{
			if(data.status){
				console.log(data.response)
				$('#modal').modal('show')
				$('#id').val(data.response.id)
				$('#education').val(data.response.education)
				$('#bulan_masuk').val(data.response.bulan_masuk).trigger('change')
				$('#tahun_masuk').val(data.response.tahun_masuk)
				$('#bulan_keluar').val(data.response.bulan_keluar).trigger('change')
				$('#tahun_keluar').val(data.response.tahun_keluar)
				$('#deskripsi').val(data.response.deskripsi)
			}
			else{
				toastr.error('Data tidak ditemukan')
			}
		},"json"
	)
})