var table = $("#tbl-skill").DataTable({
	processing : true,
	responsive :true,
	language : {
		processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size:36px;"></i><span class="sr-only"></span> '
	},
	ajax : '/skill/data_skill',
	columns : [
		{'orderable' : false},
		null,
		null,
		null,
		{'orderable' : false},
	]
});

$('#add').click(async()=>{
	await clearForm()
	$('#note_icon').hide()
	$('#modal').modal('show')
})

var validator = $('#form').validate({
	rules:{
		skill:{
			required:true
		},
		point:{
			required:true,
			digits:true
		}
	}
})

const clearForm=()=>{
	$('#form').trigger('reset')
	$('#id').val('')
	validator.resetForm()
}

$('#form').submit(function(event){

    if (!validator.valid()) {
        return false;
    }
		
		event.preventDefault();
		var formData = new FormData()
		formData.append('skill', document.getElementById('skill').value);
		formData.append('id', document.getElementById('id').value);
		formData.append('icon', document.getElementById('icon').files[0]);
		formData.append('point', document.getElementById('point').value);
		$.ajax({
			type: "POST",
			url: "/skill/process_skill",
			processData: false,
			contentType: false,
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
			$.post('/skill/delete_skill', {id : refId}, 
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
	$.post('/skill/idSkill',{id : id},
		(data, status, xhr)=>{
			if(data.status){
				console.log(data.response)
				$('#modal').modal('show')
				$('#id').val(data.response.id)
				$('#skill').val(data.response.skill)
				$('#point').val(data.response.point)
				if(data.response.icon != '' || data.response.icon != null){
					$('#note_icon').show()
				}
				else{
					$('#note_icon').hide()
				}
			}
			else{
				toastr.error('Data tidak ditemukan')
			}
		},"json"
	)
})