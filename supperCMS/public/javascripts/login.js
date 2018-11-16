$(function() {
	$('#submit').click(function() {
		$.ajax({
			type: "post",
			url: "/users/loginInquire",
			async: true,
			data: {
				name: $('input[name="name"]').val(),
				password: $('input[name="password"]').val()
			},
			success: function(data) {
				if(data.state == 200) {
					layer.msg(data.marked, {
						icon: 1,
						time: 1000
					}, function() {
						location.href = '/cmsadmin/index'
					});
				} else if(data.state == 400) {
					layer.msg(data.marked, {
						icon: 2,
						time: 1000
					});
				} else if(data.state == 500) {
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
	})
})
document.onkeydown = keydown;

function keydown(e) {
	var currKey = 0,
		e = e || event;
	currKey = e.keyCode || e.which || e.charCode; //支持IE、FF 
	if(currKey == 13) {
		if(event) {
			e.returnValue = false;
		} else {
			e.preventDefault();
		}
		$('#submit').click();
	}
}