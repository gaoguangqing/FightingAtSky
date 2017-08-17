var main = document.getElementById("main");
//568-80
var newPlane = new myPlane(127, 488, "img/myplane.gif", "img/myplaneBoom.gif");
newPlane.createPlane();
//全局ourPlane2
var ourPlane2 = document.getElementById("ourPlane2");
//敌机数量计时器
var time = setInterval(function() {
	for (var i = 0; i < getRan(4, 6); i++) {
		var enemyNum = getRan(1, 13);
		var x, y, siezeX, sizeY, speed, imgSrc, boomSrc, hp;
		var enemySrcArr = ["img/enemy3_fly_1.png", "img/enemy2_fly_1.png", "img/enemy1_fly_1.png"];
		var enemyBoomSrc = ["img/bigPlaneBoom.gif", "img/midPlaneBoom.gif", "img/smPlaneBoom.gif"];
		if (enemyNum == 13) {
			//320-110
			x = getRan(0, 210);
			y = -164;
			sizeX = 110;
			sizeY = 164;
			speed = getRan(1, 2);
			imgSrc = enemySrcArr[0];
			boomSrc = enemyBoomSrc[0];
			hp = 9;
		} else if (enemyNum < 13 && enemyNum > 9) {
			//320-46
			x = getRan(0, 274);
			y = -60;
			sizeX = 46;
			sizeY = 60;
			speed = getRan(2, 4);
			imgSrc = enemySrcArr[1];
			boomSrc = enemyBoomSrc[1];
			hp = 3;
		} else {
			//320-34
			x = getRan(0, 286);
			y = -24;
			sizeX = 34;
			sizeY = 24;
			speed = getRan(4, 6);
			imgSrc = enemySrcArr[2];
			boomSrc = enemyBoomSrc[2];
			hp = 1;
		}
		//x,y,srcImg,boomImg,hp,speed,sizeX,sizeY
		var newEnemy = new enemy(x, y, imgSrc, boomSrc, hp, speed, sizeX, sizeY);
		newEnemy.createEnemy();
		newEnemy.enemyMove();
	}
}, 1000);

//鼠标移入main触发该事件
main.onmouseover = function() {
	main.style.cursor = "none";
}

//飞机移动mouseMove 获取鼠标的坐标
document.onmousemove = function(e) {
	//事件的默认参数 事件对象 事件对象包含了事件的属性e.clientX鼠标横坐标 e.clientY鼠标纵坐标
	var e = e || window.event;
	//	console.log(e.clientX+":"+e.clientY);
	var oLeft = e.clientX - main.offsetLeft - 33;
	var oTop = e.clientY - main.offsetTop - 40;
	if (oLeft <= 0) {
		oLeft = 0;
	}
	//320-66
	if (oLeft > 254) {
		oLeft = 254;
	}
	if (oTop < 0) {
		oTop = 0;
	}
	if (oTop >= 488) {
		oTop = 488;
	}
	ourPlane2.style.left = oLeft + "px";
	ourPlane2.style.top = oTop + "px";

	myPlane.oLeft = oLeft;
	myPlane.oTop = oTop;
	//调用创建子弹的方法
	document.onmousedown = function() {
		shoot();
		myPlane.time = setInterval(function(){shoot();}, 100); //第一次执行shoot需等到500ms以后
	}
	document.onmouseup = function() {
		clearInterval(myPlane.time);
	}

	function shoot() {
		var oBullet = new bullet(myPlane.oLeft + 30, myPlane.oTop - 20, 5, "img/bullet1.png");
		oBullet.createBullet();
		oBullet.bulletMove();
	}

}

//阻止浏览器默认行为 防止出现禁止拖拽
main.onmousedown = function(e) {
		var e = e || window.event;
		e.preventDefault();
	}
	//获取随机函数
function getRan(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(getRan(1, 3))
	//本方飞机类
function myPlane(x, y, imgSrc, boomImg) {
	this.x = x;
	this.y = y;
	this.imgSrc = imgSrc;
	this.boomImg = boomImg;
	this.createPlane = function() {

		//创建元素的方法
		var ourPlane = document.createElement("img");
		ourPlane.style.position = "absolute";
		ourPlane.style.left = this.x + "px";
		ourPlane.style.top = this.y + "px";
		ourPlane.style.width = "66px";
		ourPlane.style.height = "80px";
		ourPlane.id = "ourPlane2";
		ourPlane.src = this.imgSrc;
		//把创建出来的元素添加进main元素当中
		main.appendChild(ourPlane);
	}
}
//子弹类
function bullet(x, y, speed, imgSrc) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.imgSrc = imgSrc;
}
//创建子弹的方法
bullet.prototype.createBullet = function() {
	this.bullets = document.createElement("img");
	this.bullets.style.position = "absolute";
	this.bullets.style.left = this.x + "px";
	this.bullets.style.top = this.y + "px";
	this.bullets.style.width = "6px";
	this.bullets.style.height = "14px";
	this.bullets.src = this.imgSrc;
	main.appendChild(this.bullets);
}
bullet.prototype.bulletMove = function(){
	var initTop = this.y;
	var that = this;
	this.time = setInterval(function(){
		initTop -= that.speed;
		that.bullets.style.top = initTop + "px";
		if(initTop<=(-14)){
			clearInterval(that.time);
			main.removeChild(that.bullets);
		}
		var allEnemy = document.getElementsByClassName("enemy");
		var nowBulletLeft = parseInt(that.bullets.style.left);// XXpx
		var nowBulletTop = parseInt(that.bullets.style.top);
		for(var i=0;i<allEnemy.length;i++){
			if(nowBulletLeft>=(parseInt(allEnemy[i].style.left)-6)
			&&nowBulletLeft<=(parseInt(allEnemy[i].style.left)+parseInt(allEnemy[i].style.width))
			&&nowBulletTop<=(parseInt(allEnemy[i].style.top)+parseInt(allEnemy[i].style.height))
			&&nowBulletTop>=parseInt(allEnemy[i].style.top)){
				if(that.bullets){
					clearInterval(that.time);
					main.removeChild(that.bullets);
					allEnemy[i].hp--;
				}
			}
		}
	},10)
}
	//敌方类
function enemy(x,y,imgSrc,boomImg,hp,speed,sizeX,sizeY){
	this.x = x;
	this.y = y;
	this.imgSrc = imgSrc;
	this.boomImg = boomImg;
	this.hp = hp;
	this.speed = speed;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
}
enemy.prototype.createEnemy = function(){
	this.oEnemy = document.createElement("img");
	this.oEnemy.style.position = "absolute";
	this.oEnemy.style.left = this.x +"px";
	this.oEnemy.style.top = this.y +"px";
	this.oEnemy.style.width = this.sizeX+"px";
	this.oEnemy.style.height = this.sizeY+"px";
	this.oEnemy.src = this.imgSrc;
	this.oEnemy.className = "enemy";
	this.oEnemy.hp = this.hp;
	main.appendChild(this.oEnemy);
}
enemy.prototype.enemyMove = function(){
	var that = this;
	this.oEnemy.time = setInterval(function(){
		that.y += that.speed;
		that.oEnemy.style.top = that.y+"px";
		if(that.y>=568){
			clearInterval(that.time);
			main.removeChild(that.oEnemy);
		}
		if(that.oEnemy.hp<=0){
			main.removeChild(that.oEnemy);
			clearInterval(that.time);
		}
	},20)
}
