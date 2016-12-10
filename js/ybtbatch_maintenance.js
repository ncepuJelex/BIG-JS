$(document).ready(function() {
	/*
	 初始化银行和任务数据
	 */
	maintenanceEdit.createBanks();
	document.getElementById('bank').onchange = maintenanceEdit.bankChange;

	// 对表单进行验证操作
	$('#ybtbatchForm').bootstrapValidator({
		message : 'This value is not valid',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
			bank: {
				validators: {
					notEmpty: {
						message: '银行为必输项'
					}
				}
			},
			task: {
				validators: {
					notEmpty: {
						message: '任务为必输项'
					},
					callback: {
						message: ' ',
						callback: function(value, validator) {
						console.log(value,validator);
							var downloadTasks = ['policy','fApply','BQApply','invalidBank','fresultBank','sresultBank'];
							if($.inArray(value, downloadTasks) > -1) {
								$("#ybtbatchForm #download").prop("disabled",false);
								$("#ybtbatchForm #downloadcheck").prop("disabled",false);
							} else {
								/*下面注释的两行和下一有效行二选其一*/
								//$("input[type='radio']").removeAttr('checked');
								//validator.updateStatus('inlineRadioOptions', 'INVALID');

								$("input[type='radio'][value='2']").prop('checked',true);

								$("#ybtbatchForm #download").prop("disabled",true);
								$("#ybtbatchForm #downloadcheck").prop("disabled",true);
							}
							return true;
						}
					}
				}
			},
			taskDate : {
				validators : {
					notEmpty : {
						message : '跑批日期为必输项'
					},
					regexp : {
						regexp : /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/,
						message : '跑批日期格式不正确，必须为yyyy-MM-dd格式，例如：2011-11-11'
					}
				}
			},
			inlineRadioOptions : {
				validators : {
					notEmpty : {
						message : '跑批类别为必输项'
					}
				}
			}
		},
		submitHandler: function(validator, form, submitButton) {
			alert('dm');
console.log(form);
console.log($(form[0]).serialize());
			alert($(form[0]).serialize());
			$.ajax({
				url: form.attr('action'),
				type: 'POST',
				data: $(form[0]).serialize(),
				success: function(result) {
					// ... Process the result ...
				}
			});

			/*$.post('http://www.taobao.com/', form.serialize(), function(result) {
				// The result is a JSON formatted by your back-end
				// I assume the format is as following:
				//  {
				//      valid: true,          // false if the account is not found
				//      username: 'Username', // null if the account is not found
				//  }
				if (result.valid == true || result.valid == 'true') {
					// You can reload the current location
					window.location.reload();

					// Or use Javascript to update your page, such as showing the account name
					// $('#welcome').html('Hello ' + result.username);
				} else {
					// Enable the submit buttons
					$('#ybtbatchForm').bootstrapValidator('disableSubmitButtons', false);
				}
			}, 'json');*/
		}
	}).on('success.form.fv', function(e) {
		alert(3);
		e.preventDefault();
		// Get the form instance
		var $form = $(e.target);
		// Get the BootstrapValidator instance
		var bv = $form.data('bootstrapValidator');

		// Use Ajax to submit form data
		//var bank = $("#ybtbatchForm #bank").val();
		//var task = $("#ybtbatchForm #task").val();
		//var taskDate = $("#ybtbatchForm #taskDate").val();
		//var clazz = $("input:radio[name='inlineRadioOptions']:checked").val();

		console.log($("#ybtbatchForm").serialize());
		$.post("http://www.baidu.com",$("#ybtbatchForm").serialize());
	});

	$("#taskDate").datetimepicker({
		format: "yyyy-mm-dd",
		autoclose: true,
		minView: "month",
		maxView: "decade",
		language: 'zh-CN',
		todayBtn: true,
		forceParse : false,
		pickerPosition: "bottom-left",
		//startDate:'2016-11-11',
		endDate:new Date()
	}).change(function(){
		$('#ybtbatchForm').bootstrapValidator('updateStatus', "taskDate", 'NOT_VALIDATED');
	});

});

var maintenanceEdit = {

	banks:[{'请选择':''},{'农业银行':'abc'},{'民生银行':'cmbc'},{'江苏银行':'jsbc'},
		{'北农商':'brcb'},{'广发银行':'cgb'},{'邮储银行':'psbc'},{'建设银行':'ccb'}],

	tasks:[
		[],

		[{'请选择':''},{'新保承保保单对账':'policy'},{'非实时出单流水明细':'fApply'},{'保全交易申请文件':'BQApply'},
			{'退保犹撤数据文件':'invalid'},
			{'退保犹撤数据文件-银行回盘':'invalidBank'},{'非实时出单结果文件-银行回盘':'fresultBank'},
			{'手工单数据文件/明细文件':'sresult'},{'手工单结果文件-银行回盘':'sresultBank'}],

		[{'请选择':''},{'犹豫期退保日结对账':'hesitateCheckBill'},{'民生退保同步':'surrenderCheckBill'},{'新保承保':'proposalCheckBill'}],

		[{'请选择':''},{'日结对账':'xx'}],

		[{'请选择':''},{'新契约业务对账':'brcbCheckBill'},{'保单状态同步':'xx'}],

		[{'请选择':''},{'网金日终对账':'proposalCheckBill'},{'网银和柜面对账':'ybtCheckBill'}],

		[{'请选择':''},{'承保对账':'xx'},{'保全日结对账':'xx'},{'非实时对账':'xx'}],
		[{'请选择':''},{'日终对账':'xx'}]
	],

	createBanks : function() {
		var bank = document.getElementById('bank');
		var banks = maintenanceEdit.banks;
		console.log(banks);
		for(var i in banks) {
			var op;
			for(var key in banks[i]) {
				op = new Option(key,banks[i][key]);
			}
			bank.options.add(op);
		}
	},

	bankChange : function() {
		var index = document.getElementById('bank').selectedIndex;
		var task = document.getElementById('task');
		task.options.length = 0;
		var tasks = maintenanceEdit.tasks[index];
		for(var i in tasks) {
			var op;
			for(var key in tasks[i]) {
				op = new Option(key,tasks[i][key]);
			}
			task.options.add(op);
		}
	}

};