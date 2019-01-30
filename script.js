$(document).ready(function(){
	//define vars
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d');
	var h = canvas.height;
	var w = canvas.width;
	var cw = 15;
	var d = 'right';
	var food;
	var score;
	var speed = 150;
	var color = "green"
	var opt = ["red","green","blue","cyan","white","orange","pink","black"];
	
	//snake array
	var snake_array;
	
	//initialiser
	function init(){
		d="right";
		create_snake();
		create_food();
		score = 0;
		
		if(typeof game_loop !="undefined") clearInterval(game_loop);
				game_loop = setInterval(paint,speed);
	}
	//calling initialiser
	init();
	
	function create_snake(){
		var length = 5;
		snake_array = [];
		for(var i = length-1;i>=0;i--)
		{
			snake_array.push({x:i,y:0});
		}
	}

		//create food on the cnvas wehav 45 positions frm left to right
	function create_food(){
		food = {
			x:Math.round(Math.random()*(w-cw)/cw),
			y:Math.round(Math.random()*(h-cw)/cw)
		}	
	}
//paint snake
function paint(){
	//paint canvas
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0,0,w,h);
		
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		
		if(d=='right') nx++;
		else if(d=='left') nx--;
		else if(d=='up') ny--;
		else if(d='down') ny++;
		
		//collide code
		if(nx == -1 || nx==w/cw || ny==-1 ||ny == h/cw ||check_collision(nx,ny,snake_array)){
			//init();
			//insert final score
			$('#final_score').html(score);
			//show overlay
			$('#overlay').show();
			return;
		}

		if(nx == food.x && ny == food.y){
			var tail = {x:nx , y:ny};
			score+=5;
			if(speed > 50) speed-=5;
			else speed=50;
			if(typeof game_loop !="undefined") clearInterval(game_loop);
				game_loop = setInterval(paint,speed);
			//create new food
			color = opt[Math.round(Math.random()*(opt.length-1))];
			ctx.fillStyle= color;
			create_food();
		} 
		else{
			var tail = snake_array.pop();
			tail.x=nx;
			tail.y=ny;
		}

		snake_array.unshift(tail);
			
		for(var i=0 ; i<snake_array.length;i++)
		{
			var c = snake_array[i];
			paint_cell(c.x,c.y);
		}
	
		paint_cell(food.x,food.y);
		
		//check score
		checkscore(score);	
		
		//display the current score
		$('#score').html('YourScore: ' + score);
	}	
	
	function paint_cell(x,y){
		ctx.fillStyle= color;
		ctx.fillRect(x*cw,y*cw,cw,cw);
		ctx.strokeStyle='white';
		ctx.strokeRect(x*cw,y*cw,cw,cw);
	}
	function check_collision(x,y,array){
		for(var i =0; i<array.length ; i++){
		if(array[i].x == x && array[i].y == y)
			return true;
		}
		return false;
	}
	
	function checkscore(score){
		if(localStorage.getItem('highscore') === null){
		//if there is no highscore	
		localStorage.setItem('highscore',score);
			
		}
		else{
			//if there is a high score
			if(score > localStorage.getItem('highscore')){
				localStorage.setItem('highscore',score);
			}
		}
		$('#high_score').html('High Score: ' +localStorage.highscore);
	}
	
	//keyboard controller
	$(document).keydown(function(e){
		var key = e.which; //for key and mouse events to figure out which key is pressed
		if(key == "37" && d!="right") d = "left";	
		else if(key == "38" && d!="down") d="up";
		else if(key == "39" && d!="left") d="right";
		else if(key == "40" && d!="up") d="down";
	});
});

function resetScore(){
	localStorage.highscore=0;
	//display reseted highscore
		highscorediv = document.getElementById('high_score');
		highscorediv.innerHTML('High Score: 0')
}