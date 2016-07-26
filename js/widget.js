/*
* 定义widget抽象类
*/
define(['jquery'],function($){
	
	function Widget(){
		this.boundingBox = null;  //属性最外层容器
		
	}
	
	Widget.prototype = {
		on : function(type,handler){
			if(this.handlers[type] == undefined){
				this.handlers[type] = [];
			}
			
			this.handlers[type].push(handler);
			
			//return this是为了连缀写法
			return this;
		},
		fire : function(type,data){
			if(this.handlers[type] instanceof Array){
				var handlers = this.handlers[type];
				for(var i = 0, len = handlers.length; i < len; i++){
					handlers[i](data);
				}
			}
		},
		//接口，添加DOM节点
		renderUI : function(){
		
		},
		//监听事件
		bindUI   : function(){
		
		},
		//接口，初始化组件属性
		syncUI   : function(){
		
		},
		//方法：渲染组件
		render   : function(container){
			this.renderUI();
			this.handlers = {};
			this.bindUI();
			this.syncUI();
			$(container || document.body).append(this.boundingBox);
		},
		//接口：销毁前的处理函数(交由具体的子类去实现)
		destructor : function(){
		
		},
		//方法：销毁组件
		destroy : function(){
			this.destructor();
			this.boundingBox.off();
			this.boundingBox.remove();
		}
	};
	
	
	return {
		Widget : Widget
	};
	
});