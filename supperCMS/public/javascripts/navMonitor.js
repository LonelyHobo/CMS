var navdata=[];
	$.ajax({
		type: "post",
		url: "/users/navdata",
		async: true,
		success: function(data) {
			if(data.state == 200) {
				var data_=[];
				$.each(data.data, function(index) {
					var jsons = {
						id: this.id,
						name: this.nav_name,
						pid: this.nav_parent,
						class: this.nav_class,
						rank: this.nav_rank,
						show: this.nav_show
					};
					data_.push(jsons);
					navdata[this.id]=jsons;
				})
				$.each(data_,function(){
					$('select[name="nav-parent"]').append('<option value="'+this.id+'" data-class="'+this.class+'" data-rank="'+this.rank+'" data-pid="'+this.pid+'">'+this.name+'('+this.rank+'级)</option>');
				});
				$("#navList").ProTree({
					arr: data_,
					close: true,
					simIcon: "fa fa-file-o", //单个标题字体图标 不传默认glyphicon-file
					mouIconOpen: "fa fa-folder-open-o", //含多个标题的打开字体图标  不传默认glyphicon-folder-open
					mouIconClose: "fa fa-folder-o", //含多个标题的关闭的字体图标  不传默认glyphicon-folder-close
					callback: formchange
				})
			} else {
				layer.msg(data.marked, {
					icon: 2,
					time: 1000
				});
			}
		},
		error: function(data) {
			console.log(data);
		}
	});
	var formchange=function(id){
		form_.val('navform', {
			"nav-name":navdata[id].name,
			"nav-rank": navdata[id].rank,
			"nav-class":navdata[id].class,
			"nav-show": navdata[id].show+'',
			"nav-parent":navdata[id].pid,
			"id":navdata[id].id
		});
		var p = $('select[name="nav-parent"]').parent();
		if(navdata[id].pid==0)$('input[name="nav-class"]').attr('disabled',false);
		p.find('dl dd').show();
		p.find('dl dd[lay-value="'+navdata[id].id+'"]').hide();
		$('select[name="nav-parent"] option[data-class="'+navdata[id].class+'"]').each(function(){
			if(Number($(this).attr('data-rank'))>Number(navdata[id].rank)){
				p.find('dl dd[lay-value="'+$(this).val()+'"]').hide();
			}
		})
	};
	var form_;
	layui.use(['form', 'layedit', 'laydate'], function() {
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;

		//监听提交
		form.on('submit(save)', function(data) {
			$.ajax({
				type: "post",
				url: "/users/navedit",
				async: true,
				data: data.field,
				success: function(data) {
					if(data.state == 200) {
						layer.msg(data.marked, {
							icon: 1,
							time: 1000
						}, function() {
							location.reload()
						});
					} else if(data.state == 500) {
						layer.msg(data.marked, {
							icon: 2,
							time: 1000
						}, function() {
							location.reload()
						});
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
		});
		form.on('submit(del)', function(data) {
			
		});
		form.on('select(nav-parent)', function(data){
			if(data.value != '0'){
				$('input[name="nav-class"]').val($(data.elem).find('option[value="'+data.value+'"]').attr('data-class')).attr('disabled',true);
				$('input[name="nav-rank"]').val(+$(data.elem).find('option[value="'+data.value+'"]').attr('data-rank')+1);
			}else{
				$('input[name="nav-rank"]').val('1');
				$('input[name="nav-class"]').val('').attr('placeholder','请输入分类').attr('disabled',false);
			}
		})
		//表单初始赋值
		form_=form;
	});