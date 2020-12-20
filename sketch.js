var dog, dogImage;
var dogImage1;
var database;
var fedTime, lastFed;
var feed, addFood, foodObj;
var foodStock, foodS, feedDog;

function preload()
{
  dogImage1 = loadImage("images/dogImg1.png");
  dogImage = loadImage("images/dogImg.png")
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFood)
  
  dog = createSprite(800, 200, 10, 10);
  dog.addImage(dogImage);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  
  textSize(20);
}


function draw() {  
  background(46, 139, 87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  //if(keyWentDown(UP_ARROW)) {
    //writeStock(foodStock);
    //dog.addImage(dogImage1);
  //}

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM", 350, 30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM", 350, 30);
  }else{
    text("Last Feed : "+ lastFed + "AM", 350, 30);
  }

  drawSprites();

}
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}

function writeStock(x) {

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog()
{
  dog.addImage(dogImage1);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFood()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
