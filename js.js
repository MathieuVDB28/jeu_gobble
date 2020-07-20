var canvas = document.getElementById('game'); 
var ctx = canvas.getContext('2d'); 
var canvas2 = document.getElementById('info'); 
var ctx2 = canvas2.getContext('2d'); 
var audioelement = document.getElementById("audio"); 
audio.controls=false; 
var imageBouton = new Image(); 
imageBouton.src = "try-again.png"; 
function Game(numberBalls,level) { 
this.state=true; 
this.level=level; 
this.numberBalls=numberBalls; 
this.numberBallsRouge=numberBalls/2; 
this.Balls=[]; 
this.initialize=function() { 
this.state=true; 
ctx.clearRect(0, 0, canvas.width, canvas.height); 
ctx2.clearRect(0, 0, canvas.width, canvas.height); 
this.ball=new Ball(150,280,10,"#00FF00"); 
for (i=0;i<=numberBalls/2-1;i++) { 
this.Balls[i]=new BallMobiles(Math.random()*canvas.width,Math.random()*canvas.height,10,"#0000FF",(Math.random()-0.5)*2,(Math.random()-0.5)*2); 
} 
for (i=numberBalls/2;i<=numberBalls-1;i++) { 
this.Balls[i]=new BallMobiles(Math.random()*canvas.width,Math.random()*canvas.height,10,"#FF0000",(Math.random()-0.5)*2,(Math.random()-0.5)*2); 
} 
for (i=0;i<=numberBalls-1;i++) { 
if (reglage(this.ball,this.Balls[i])==false) { 
this.initialize(); 
} 
} 
this.setupInput(); 
this.loop(); 
} 
var KEY_CODES = { 37:'gauche', 38:'haut', 40 :'bas' , 39:'droite',13: 'enter' }; 
this.keys={}; 
this.setupInput=function() { 
window.addEventListener('keydown',function(e) { 
if (KEY_CODES[e.keyCode]) { 
Partie.keys[KEY_CODES[e.keyCode]]=true; 
e.preventDefault(); 
} 
},false); 
window.addEventListener('keyup',function(e) { 
if (KEY_CODES[e.keyCode]) { 
Partie.keys[KEY_CODES[e.keyCode]]=false; 
e.preventDefault(); 
} 
},false); 
} 
this.loop=function() { 
ctx.clearRect(0, 0, canvas.width, canvas.height); 
Partie.ball.move(); 
Partie.ball.draw(); 
for (i=0;i<=Partie.Balls.length-1;i++) { 
Partie.Balls[i].draw(); 
Partie.Balls[i].move(); 
} 
} 
this.changelevel=function() { 
window.removeEventListener("click", Partie.changelevel); 
if (this.state==true) { 
this.level +=1; 
this.numberBalls +=2; 
this.state==false; 
} 
Partie=new Game(Partie.numberBalls,Partie.level);//On crée une nouvelle partie 
Partie.initialize(); 
refresh=setInterval(Partie.loop,30); 
console.log(Partie.numberBalls,Partie.level); 
} 
}//Fin de l'objet Game 
function Ball(x,y,r,colour) { 
this.x=x; 
this.y=y; 
this.r=r; 
this.colour=colour; 
this.draw=function() { 
ctx.fillStyle=this.colour; 
ctx.beginPath(); 
ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); 
ctx.fill(); 
} 
this.move=function() { 
if (Partie.keys['gauche']==true) {this.x -=5-Partie.level/2;}; 
if (Partie.keys['droite']==true) {this.x +=5-Partie.level/2;}; 
if (Partie.keys['bas']==true) {this.y +=5-Partie.level/2;}; 
if (Partie.keys['haut']==true) {this.y -=5-Partie.level/2;}; 
if (this.x<this.r) {this.x=this.r}; 
if (this.x>canvas.width-this.r) {this.x=canvas.width-this.r}; 
if (this.y<this.r) {this.y=this.r}; 
if (this.y>canvas.height-this.r) {this.y=canvas.height-this.r}; 
for (i=0;i<=Partie.Balls.length-1;i++) { 
if (this.r<300) { 
if (collide(this,Partie.Balls[i]) && Partie.Balls[i].colour=="#0000FF") { 
this.r +=1.8; 
Partie.state=false; 
audio.src="sirp.mp3"; 
audioelement.play(); 
} 
if (collide(this,Partie.Balls[i]) && Partie.Balls[i].colour=="#FF0000") { 
this.r+=1.5; 
Partie.Balls.splice(i,1); 
Partie.numberBallsRouge -=1; 
audio.src="pop.mp3"; 
audioelement.play(); 
} 
} 
if (this.r>300) { 
ctx2.fillStyle = "#000000"; 
ctx2.textAlign = "center"; 
ctx2.font = "bold 40px bangers"; 
niveau=Partie.level+1; 
ctx2.fillText("GAME OVER",canvas.width/2,canvas.height/2); 
ctx2.fillText("Level "+niveau,canvas.width/2,canvas.height/2-40); 
this.r=300; 
ctx2.drawImage(imageBouton,canvas.width/2-100,canvas.height/2); 
clearInterval(refresh); 
window.addEventListener("click", Partie.changelevel); 
} 
if (Partie.numberBallsRouge==0 && this.r<200) { 
Partie.changelevel(); 
} 
} 
} 
}//Fin de l'objet Ball 
BallMobiles.prototype=new Ball(); 
function BallMobiles(x,y,r,colour,speedx,speedy) { 
this.x=x; 
this.y=y; 
this.r=r; 
this.colour=colour; 
this.speedx=speedx; 
this.speedy=speedy; 
this.move=function() { 
this.x +=this.speedx; 
this.y +=this.speedy; 
if (this.x<this.r) {this.speedx=-this.speedx}; 
if (this.x>canvas.width-this.r) {this.speedx=-this.speedx}; 
if (this.y<this.r) {this.speedy=-this.speedy}; 
if (this.y>canvas.height-this.r) {this.speedy=-this.speedy}; 
} 
} 
function collide(ball1,ball2) { 
var distancex=ball2.x-ball1.x; 
var distancey=ball2.y-ball1.y; 
var distance=Math.sqrt(distancex*distancex+distancey*distancey); 
if (distance<ball1.r+ball2.r) { 
return true;} else { 
return false; 
} 
} 
function reglage(ball1,ball2) { 
var distancex=ball2.x-ball1.x; 
var distancey=ball2.y-ball1.y; 
var distance=Math.sqrt(distancex*distancex+distancey*distancey); 
if (distance>100) { 
return true; 
} else { 
return false; 
} 
} 
window.addEventListener("load",function() { 
Partie=new Game(20,0); 
Partie.initialize(); 
refresh=setInterval(Partie.loop,30); 
}) 
