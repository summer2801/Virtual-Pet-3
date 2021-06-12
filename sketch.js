//Create variables here


var dog,dogImg,happyDog,database,foodS,foodStock

var fedTime
var lastFed
var foodObj
var GameState = "Hungry"
var readState
var garden,washroom,bedroom


function preload()
{
  //load images here
  dogImg = loadImage("dog.png")
  happyDog = loadImage("happydog.png")
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
  bedroom=loadImage("Bed Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500,600);

  foodObj = new Food();

  foodStock = database.ref('Food')
  foodStock.on("value",readStock)
  
  readState = database.ref('GameState')
  readState.on("value",function(data){
    GameState = data.val();
  })

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data){
    lastFed = data.val();
  })

  dog = createSprite(270,500,20,60)
  dog.addImage(dogImg)
  dog.scale = 0.16

  feed=createButton("Feed the dog");
  feed.position(550,100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(650,100);
  addFood.mousePressed(addFoods);

  
}

function draw() { 
  background("green") 
  //foodObj.display();

  
 
  
  if (GameState != "Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  fill("black");
  textSize(20);
  if (lastFed >= 12) {
    text("Last Feed: " + lastFed %12 + "PM", 180, 35);
  }
  else if(lastFed == 0) {
    text("Last Feed: 12AM ", 180, 35);
  }
  else {
    text("Last Feed:  " + lastFed + "AM", 180, 35);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
 
  drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
  //console.log(foodS)
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state){
  database.ref('/').update({
    GameState:state
  })
}




