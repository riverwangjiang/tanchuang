/*
* 定义window模块
* //requireJs默认将文件名和模块名有一个对应关系；在底下会自动去找jquery.js这个文件,然后动态把它加载进来
* //有时候我们下载的jquery会带着版本号等，它不是直接的jquery.js,它带版本号和压缩等，我们不需要在define上写一个带一大串版本号的文件，不存在直接的映射关系
* //如果没有可以指明，默认是模块名和文件名刚好对应
* //手动的指定映射关系，require.config
* 把jquery
*/
//连缀语法的关键：然后this
define(['widget','jquery','jqueryUI'],function(widget,$,$UI){

	function Window(){
		//config是个字典格式，这里（构造函数中）用于设置默认值
		this.config = {
			title : '系统消息',
			width : 500,
			height: 'auto',
			content: '',
			hasCloseBtn : false,
			hasMask : true,
			isDraggable: true,
			dragHandle : null,
			//设置alert的文案
			textForAlertBtn : '确定',
			//设置confirm的文案
			textForConfirmBtn : '确定',
			textForCancelBtn  : '取消',
			//设置prompt的文案
			textForPromptBtn  : '确定',
			defaultValueForPrompt:'',
			isPromptInputPassword : false,
			maxlengthForPrompt :10,
			skinClassName : null,
			handlerForAlert : null,
			handlerForClose : null,
			handlerForConfirm : null,
			handlerForCancel  : null,
			handlerForPrompt  : null
		};
		
		//1、定义一个空字典
		this.handlers = {};
	};
	
	//$.extend把一个大的字典混合成一个新的字典
	Window.prototype = $.extend({},new widget.Widget(),{
		renderUI : function(){
			
			var footerContent = '';
			switch(this.config.winType){
				case "alert":
					footerContent = '<input type="button" value="'+this.config.textForAlertBtn+'" class="window_alertBtn" />';
				break;
				case "confirm":
					var confirm_footer_html = '';
					confirm_footer_html += '<input type="button" value="'+this.config.textForConfirmBtn+'" class="window_confirmBtn" />';
					confirm_footer_html += '<input type="button" value="'+this.config.textForCancelBtn+'" class="window_cancelBtn" />'
					footerContent = confirm_footer_html;
				break;
				case "prompt":
					this.config.content += '<p class="window_promptInputWrapper">';
						this.config.content += '<input type="'+(this.config.isPromptInputPassword ? "password" : "text")+'" value="'+this.config.defaultValueForPrompt+'" '
											+ 'maxlength="'+this.maxlengthForPrompt+'" class="window_promptInput"'
											+ ' />'
					this.config.content += '</p>';
					
					var prompt_footer_html = '';
					prompt_footer_html += '<input type="button" value="'+this.config.textForPromptBtn+'" class="window_promptBtn" />';
					prompt_footer_html += '<input type="button" value="'+this.config.textForCancelBtn+'" class="window_cancelBtn" />'
					footerContent = prompt_footer_html;
				break;
			};
			
			
			
			var boundingBox_html = '';
				boundingBox_html += '<div class="window_boundingBox">';
					boundingBox_html += '<div class="window_body">'+this.config.content+'</div>';		
				boundingBox_html += '</div>';	
			this.boundingBox = $(boundingBox_html);
			
			if(this.config.winType != 'common'){
				this.boundingBox.prepend('<div class="window_header">'+this.config.title+'</div>');
				this.boundingBox.append('<div class="window_footer">'+footerContent+'</div>');
			}
			
			
			if(this.config.hasMask){
				this._mask = $('<div class="window_mask"></div>');
				this._mask.appendTo("body");
			}
			
			if(this.config.hasCloseBtn){
				this.boundingBox.append('<span class="window_closeBtn">×</span>');
			}
			
			this.boundingBox.appendTo(document.body);
			
			this._promptInput = this.boundingBox.find(".window_promptInput");
		},
		bindUI : function(){
			var that = this;
			
			this.boundingBox.delegate(".window_alertBtn","click",function(){
				that.fire("alert");
				that.destroy();
			}).delegate(".window_closeBtn","click",function(){
				that.fire("close");
				that.destroy();
			}).delegate(".window_confirmBtn","click",function(){
				that.fire("confirm");
				that.destroy();
			}).delegate(".window_cancelBtn","click",function(){
				that.fire("cancel");
				that.destroy();
			}).delegate(".window_promptBtn","click",function(){
				that.fire("prompt",that._promptInput.val());
				that.destroy();
			});
			
			if(this.config.handlerForClose){
				this.on("close",this.config.handlerForClose);
			}
			
			if(this.config.handlerForAlert){
				this.on("alert",this.config.handlerForAlert);
			};
			
			if(this.config.handlerForConfirm){
				this.on("close",this.config.handlerForConfirm);
			}
			
			if(this.config.handlerForCancel){
				this.on("alert",this.config.handlerForCancel);
			};
			
			if(this.config.handlerForPrompt){
				this.on("prompt",this.config.handlerForPrompt);
			};
		},
		syncUI : function(){
			this.boundingBox.css({
				width : this.config.width + 'px',
				height: this.config.height+ 'px',
				left  : (this.config.x || (window.innerWidth - this.config.width) / 2) + 'px',
				top   : (this.config.y || (window.innerHeight - this.config.height) / 2) + 'px'   	
			});
			
			if(this.config.skinClassName){
				this.boundingBox.addClass(this.config.skinClassName);
			}
			
			if(this.config.isDraggable){
				if(this.config.dragHandle){
					this.boundingBox.draggable({handle:this.config.dragHandle});
				}else{
					this.boundingBox.draggable();
				}
				
			}
		},
		destructor : function(){
			this._mask && this._mask.remove();
		},
		alert : function(config){
			$.extend(this.config,config,{winType:'alert'});
			this.render();
			return this;
		},
		confirm : function(config){
			$.extend(this.config,config,{winType:'confirm'});
			this.render();
			return this;
		},
		prompt : function(config){
			$.extend(this.config,config,{winType:'prompt'});
			this.render();
			this._promptInput.focus();
			return this;
		},
		common : function(config){
			$.extend(this.config,config,{winType:'common'});
			this.render();
			return this;
		}
	});
	
	return {Window : Window};
});


