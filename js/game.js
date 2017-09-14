var Game = function(){
	//dom元素
	var gameDiv;
	var nextDiv;
	var timeDiv;
	var scoreDiv;
	var score = 0;

	var initData =function(x,y){
		var data=[];
		for(var i=0;i<y;i++){
			var item=[];
			for(var j=0;j<x;j++){
				item.push(0);
			}
			data.push(item)
		}
		return data;
	}

	//var nextData = initData(4,4);
	var gameData = initData(10,20);
	//当前方块
	var cur;
	//下一个方块
	var next;
	//divs
	var nextDivs=[];
	var gameDivs=[];
	//初始化Div
	var initDiv= function(container,data,divs){

		for (var i = 0; i <data.length; i++) {
			var div =[];
			for (var j = 0; j < data[0].length; j++) {
				var newNode = document.createElement('div');
				newNode.className='none';
				newNode.style.top=(i*20)+'px';
				newNode.style.left=(j*20)+'px';
				container.appendChild(newNode);
				div.push(newNode);
			}
			divs.push(div);
		}
	}

	var refreshDiv = function(data,divs){
		for (var i = 0; i <data.length; i++) {
			for (var j = 0; j < data[0].length; j++) {
				if (data[i][j]==0){
					divs[i][j].className ='none';
				}else if (data[i][j]==1){
					divs[i][j].className ='done';
				}else if (data[i][j]==2){
					divs[i][j].className ='current';
				}
			}
		}
	}


	// 检测点是否合法
	var check =function(pos,x,y){
		if(pos.x +x<0){
			return false;
		} else if(pos.x +x>=gameData.length){
			return false;
		} else if(pos.y +y<0){
			return false;
		} else if(pos.y +y>=gameData[0].length){
			return false;
		} else if(gameData[pos.x+x][pos.y+y]==1){
			return false;
		} else{
			return true;
		}
	}

	//检测数据是否合法
	var isValid =function(pos,data){
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < data[0].length; j++) {
				if(data[i][j]!=0){
					if(!check(pos,i,j)){
						return false;
					}
				}
			}
		}
		return true;
	}

	// 清楚数据
	var clearData =function(){
		for (var i = 0; i < cur.data.length; i++) {
			for (var j = 0; j < cur.data[0].length; j++) {
				if(check(cur.origin,i,j)){
					gameData[cur.origin.x+i][cur.origin.y+j] = 0;
				}
			}
		}
	}
	// 设置数据
	var setData =function(){
		for (var i = 0; i < cur.data.length; i++) {
			for (var j = 0; j < cur.data[0].length; j++) {
				if(check(cur.origin,i,j)){
					gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j]
				}
			}
		}
	}

	// 设置时间 
	var setTime = function(time){
		timeDiv.innerHTML = time;
	}

	// 固定
	var fixed =function(){
		for (var i = 0; i < cur.data.length; i++) {
			for (var j = 0; j < cur.data[0].length; j++) {
				if(check(cur.origin,i,j)){
					if(gameData[cur.origin.x + i][cur.origin.y + j] == 2){
						gameData[cur.origin.x + i][cur.origin.y + j] = 1;
					}
				}
			}
		}
		refreshDiv(gameData,gameDivs);
	}

	var onGameOver = function(win){
		if(win){

		} else{

		}
	}

	// 检测游戏是否结束
	var checkGameOver = function($row =0){
		$row = $row + 1;
		var isGameOver = false;
		for(var i = 0;i<gameData[0].length;i++)
		{
			if (gameData[$row][i] == 1)
			{
				isGameOver = true;
				break;
			}	
		}
		return isGameOver;
	}

	// 展示下一个
	var performNext = function(type,dir){
		cur = next;
		setData();
		next = SquareFactory.prototype.make(type,dir);
		refreshDiv(gameData,gameDivs);
		refreshDiv(next.data,nextDivs)
		if(next.canDown(isValid)){
			return true;
		}
		else{
			return false;
		}
	}

	// 消行
	var checkClear = function(){
		var line = 0;
		var length = (cur.origin.x + cur.data.length) > gameData.length ? gameData.length : cur.origin.x + cur.data.length ;
		for (var i = cur.origin.x; i < length ; i++) {
			var canClear = true;
			for(var j = 0;j < gameData[0].length;j++){
				if(gameData[i][j] == 0){
					canClear = false;
					break;
				}
			}
			if (canClear){
				line = line + 1;
				removeRow(i);
			}
		}
		return line;
	}

	// 加分
	var addScore = function(line){
		var s =10;
		switch(line){
			case 1:
				s =10;
				break;
			case 2:
				s =30;
				break;
			case 3:
				s =60;
				break;
			case 4:
				s =100;
				break;
			default:
				break;
		}
		score =score + s;
		scoreDiv.innerHTML = score;
	}

	// 消行
	var removeRow = function(rowid){
		for(var i = 0;i < gameData[0].length;i++){
			for (var j = rowid; j > 0; j--) {
				gameData[j][i] = gameData[j-1][i];
			}
			gameData[0][i] = 0;
		}
	}

	// 增行
	var addRow = function(){
		for(var i = 0;i < gameData[0].length;i++){
			for (var j = 0; j < gameData.length-1; j++) {
				gameData[j][i] = gameData[j+1][i];
			}
			gameData[gameData.length -1][i] = 1;
		}
	}

	// 下移
	var down =function(){
		if(cur.canDown(isValid)){
			clearData();
			cur.down();
			setData();
			refreshDiv(gameData,gameDivs);
			return true;
		} else {
			return false;
		}
	}

	// 左移
	var left =function(){
		if(cur.canLeft(isValid)){
			clearData();
			cur.left();
			setData();
			refreshDiv(gameData,gameDivs);
			return true;
		} 
	}


	// 右移
	var right =function(){
		if(cur.canRight(isValid)){
			clearData();
			cur.right();
			setData();
			refreshDiv(gameData,gameDivs);
			return true;
		} 
	}

	// 旋转
	var rotate = function(){
		if(cur.canRotate(isValid)){
			clearData();
			cur.rotate();
			setData();
			refreshDiv(gameData,gameDivs);
			return true;
		} 
	}

	// 初始化
	var init=function(doms,type,dir){
		gameDiv=doms.gameDiv;
		nextDiv =doms.nextDiv;
		timeDiv = doms.timeDiv;
		scoreDiv = doms.scoreDiv;
		next = SquareFactory.prototype.make(type,dir);
		initDiv(gameDiv,gameData,gameDivs);
		initDiv(nextDiv,next.data,nextDivs);
		refreshDiv(next.data,nextDivs)
	}
	// 导出API
	this.init = init;
	this.down = down;
	this.left = left;
	this.right = right;
	this.rotate =rotate;
	this.fall = function(){while(down());}
	this.fixed = fixed;
	this.performNext = performNext;
	this.checkClear = checkClear;
	this.checkGameOver = checkGameOver;
	this.onGameOver = onGameOver;
    this.addRow = addRow;
    this.setTime = setTime;
    this.addScore = addScore;
}