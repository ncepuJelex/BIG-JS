$(document).ready(function() {

	// 对表单进行验证操作
$('#timeValidateForm').bootstrapValidator({
	message : 'This value is not valid',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {

		effectDate : {
			validators : {
				notEmpty : {
					message : '启用日期不能为空,必须录入'
				},
				regexp : {
					regexp : /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/,
					message : '启用日期格式不正确，必须为yyyy-MM-dd格式，例如：1992-07-03'
				},
				callback :{
					message: '启用日期不能晚于停用日期',
					callback :function (value, validator, $field) {
						if($.trim($("#effectDate").val()) == "" || $.trim($("#suspendDate").val()) == ""){
							return true;
						}
						var checkDate = /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/;
						if(!checkDate.test($("#suspendDate").val()) || !checkDate.test($("#effectDate").val())){
							if(checkDate.test($("#suspendDate").val())){
								$('#timeValidateForm').bootstrapValidator('updateStatus', "suspendDate", 'NOT_VALIDATED');
							}
							return true;
						}
						if($("#suspendDate").val() < $("#effectDate").val()){
							$('#timeValidateForm').bootstrapValidator('updateStatus', "suspendDate", 'VALID');
							return false;
						}else{
							$('#timeValidateForm').bootstrapValidator('updateStatus', "suspendDate", 'VALID');
							$('#timeValidateForm').bootstrapValidator('updateStatus', "effectDate", 'VALID');
							return true;
						}
					}
				}

			}
		},
		suspendDate : {
			validators : {
				notEmpty : {
					message : '停用日期不能为空，必须录入'
				},
				regexp : {
					regexp : /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/,
					message : '停用日期格式不正确，必须为yyyy-MM-dd格式，例如：1992-07-03'
				},
				callback :{
					message: '停用日期不能早于启用日期',
					callback :function (value, validator, $field) {
						if($.trim($("#effectDate").val()) == "" || $.trim($("#suspendDate").val()) == ""){
							return true;
						}
						var checkDate = /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/;
						if(!checkDate.test($("#suspendDate").val()) || !checkDate.test($("#effectDate").val())){
							if(checkDate.test($("#effectDate").val())){
								$('#timeValidateForm').bootstrapValidator('updateStatus', "effectDate", 'NOT_VALIDATED');
							}
							return true;
						}
						if($("#suspendDate").val() < $("#effectDate").val()){
							$('#timeValidateForm').bootstrapValidator('updateStatus', "effectDate", 'VALID');
							return false;
						}else{
							$('#timeValidateForm').bootstrapValidator('updateStatus', "effectDate", 'VALID');
							$('#timeValidateForm').bootstrapValidator('updateStatus', "suspendDate", 'VALID');
							return true;
						}
					}
				}
			}
		}
      }
    }).on('success.form.bv', function(e) {
   		e.preventDefault();
		// Get the form instance
		var $form = $(e.target);
		// Get the BootstrapValidator instance
		var bv = $form.data('bootstrapValidator');
		
		// Use Ajax to submit form data
		var effectDate = $("#timeValidateForm #effectDate").val();
		var suspendDate = $("#timeValidateForm #suspendDate").val();
		
		$.post("/dept/timeValidate.do",$("#timeValidateForm").serialize());
	});
	
	//日期时间选择器
	$("#effectDate").datetimepicker({
	    format: "yyyy-mm-dd",
	    autoclose: true,
	    minView: "month",
	    maxView: "decade",
	    language: 'zh-CN',
	    todayBtn: true,
	    forceParse : false,
	    pickerPosition: "bottom-left"

	}).change(function(){
		$('#timeValidateForm').bootstrapValidator('updateStatus', "effectDate", 'NOT_VALIDATED');
		$("#timeValidateForm").data('bootstrapValidator').validateField("effectDate");
	});
	
	
	$("#suspendDate").datetimepicker({
	    //format: "yyyy-mm-dd",
	    autoclose: true,
	    minView: "month",
	    maxView: "decade",
	    language: 'zh-CN',
	    todayBtn: true,
	    forceParse : false,
	    pickerPosition: "bottom-left"
	}).change(function(){
		$('#timeValidateForm').bootstrapValidator('updateStatus', "suspendDate", 'NOT_VALIDATED');
		$("#timeValidateForm").data('bootstrapValidator').validateField("suspendDate");
	});
	$("#meeting").datetimepicker({
	    format: "yyyy-mm-dd",
	    autoclose: true,
	    minView: "month",
	    maxView: "decade",
	    language: 'zh-CN',
	    todayBtn: true,
	    forceParse : false,
	    pickerPosition: "bottom-left",
		startDate:'2016-11-11',
		//endDate:'2017-05-19'
	}).on('changeDate',function(e) {
		console.log(e.date);
		//endDay是根据业务需求所获取到的日期
		//var endDay = '2016-12-31';
		//if(e.date>new Date(endDay)) {
		//	alert('日期超过允许范围了');
		//}

		//获取当前系统时间后的30日为endDay
		var t=new Date();
		var iToDay=t.getDate();
		var iToMon=t.getMonth();
		var iToYear=t.getFullYear();
		var endDay = new Date(iToYear,iToMon,(iToDay+30));

		$("#meeting").datetimepicker('setEndDate',endDay);
	});


});