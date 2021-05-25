var table = $("#tbl-message").DataTable({
	processing : true,
	responsive :true,
	language : {
		processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size:36px;"></i><span class="sr-only"></span> '
	},
	ajax : '/message/data_message',
	columns : [
		{'orderable' : false},
		null,
		null,
		null,
		null,
	]
});