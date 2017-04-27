var kinectron = null;
var bm = new BodyManager();

var isPlaying = false;

var pauses =
[0.38, 1.12, 3.12, 4.6, 8.12, 8.8, 9.3, 11.48,
17.44, 18.4, 19.05, 19.92, 20.48, 21.18, 22.18,
23.17, 24.70, 25.70, 29.00, 30.28, 33.53]; // raging bull ain't pretty no more

var pauses2 = 
[11.15, 16.15, 16.85, 17.30, 19.50, 25.45, 
26.45, 27.1, 27.9, 28.5, 29.10, 30.15, 31.25, 
32.7, 33.6, 37.05, 38.25, 41.55, 

65.5, 66.33, 67.66, 70.45, 73.66, 78.60, 80.16, 
81, 82.66, 83.66, 84.33, 85.05, 

144.16, 145.5, 147, 149.80, 150.80, 
151.5, 152.20, 152.80, 153.50, 154.2,

216.5]; //ahx
//punch ends on 30 30 is firrst kick
//41 is pause

// var pauseTimes =
// [11.217, 16.2, 16.85, 17.30, 19.60, 25.45, 26.45, 27.1, 27.5, 28.5,
// 29.25, 30.25, 31.25, 32.7, 33.6, 37.05, 38.25, 41.55]; // raging bull

// var pauseTimes2 =
// [65.5, 66.33, 67.66, 70.40, 73.66, 78.60, 80.16, 
// 81, 82.66, 83.66, 84.33, 85.05]; // fightclub

// var pauseTimes3 =
// [144.16, 145.5, 147, 149.80, 150.80, 151.5, 152.20, 152.80, 153.50, 154.2]; // fightclub

// var pauseTime4 = 216.5;


var currIndex = 0;
var canPunch = false

var isFinal = false;

var vids = [];
var vidClub;
var fullVid;


function preload() {

}

function setup() {
  // createCanvas(windowWidth, windowHeight); 
  noCanvas();

  // Define and create an instance of kinectron
  kinectron = new Kinectron("172.16.238.157");

  // CONNECT TO MICRROSTUDIO

  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");
  // imageMode(CENTER);
  // Connect with application over peer
  kinectron.makeConnection();
  kinectron.startTrackedBodies(bodyTracked);
  kinectron.setInfraredCallback(drawFeed);

  fullVid = createVideo("/assets/raging_bull.mp4");
  // fullVid.onended();
  fullVid.size(1920 , 1080);
  // fullVid.showControls();
  vidClub = createVideo("/assets/fight_club.mp4")
  vidClub.hide();
  vids.push(fullVid); //0
  vids.push(vidClub); //1

}

function onVideoLoad()
{
  vids[curr].play();
}

function drawFeed(img) {
  // Draws feed using p5 load and display image functions  
  if(isFinal)
  {
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
    });
  }
}

var curr = 0;
var prev = 0;

function draw() {
  // Get joints for live bodies
  // for(var i = 0; i < bm.getBodies.length; i++)
  // {
    
    var bodies = bm.getBodies();

    for(var i = 0; i < bodies.length; i++)
    {
      var body = bodies[i];

      // if(body.punch())
      // {
      //   switchVideo(i);
      // }
    }
}

function switchVideo(i)
{
  curr = i;

  console.log("curr: " + curr );
  console.log("prev: " + prev );
  if(prev != i)
  {
    vids[prev].stop();
    vids[prev].hide();
    vids[curr].show();
        vids[curr].time(getRandomValueFromArray(pauses));

    vids[curr].play();
  }
  prev = i;
}

function getRandomValueFromArray(array)
{
  var rand = array[Math.floor(Math.random() * array.length)];
  return rand;
}

function bodyTracked(body) {
  var id = body.trackingId;
  // When there is a new body, add it
  if (!bm.contains(id)) bm.add(body);
  // Otherwise, update it
  else bm.update(body);
}


function keyPressed() {
  console.log(keyCode);
  if (keyCode == 49) {
    switchVideo(0);
  } 
  else if(keyCode == 50)
  {
    switchVideo(1);
  }
  return false;
}


