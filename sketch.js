var kinectron = null;
var bm = new BodyManager();

var isPlaying = false;

var ragingBullTimes =
[0.38, 1.12, 3.12, 4.6, 8.12, 8.8, 9.3, 11.48,
17.44, 18.4, 19.05, 19.92, 20.48, 21.18, 22.18,
23.17, 24.70, 25.70, 29.00, 30.28, 33.53]; // raging bull ain't pretty no more

var pauses = [11.15, 16.15, 16.85, 17.30, 19.50, 25.45, 
26.45, 27.1, 27.9, 28.5, 29.10, 30.15, 31.25, 32.7, 
33.6, 37.05, 38.25, 41.55, 

65.5, 66.33, 67.66, 70.45, 73.66, 78.60, 80.16, 
81, 82.66, 83.66, 84.33, 85.05, 

144.16, 145.5, 147, 149.80, 150.80, 
151.5, 152.20, 152.80, 153.50, 154.2,

216.5]; //ahx


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


function preload() {
  fullVid = createVideo("/assets/restricted.mp4");
  // fullVid.size(1920 , 1080);
  // fullVid.showControls();
  fullVid.play();

}

function setup() {
  // createCanvas(windowWidth, windowHeight);

  // Define and create an instance of kinectron
  kinectron = new Kinectron("172.16.217.200");

  // CONNECT TO MICRROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();
  kinectron.startTrackedBodies(bodyTracked);
  // background(0);
  console.log("test1");
}

function draw() {
  // Get joints for live bodies
  // for(var i = 0; i < bm.getBodies.length; i++)
  // {
    // var rightHandJoint = bm.getJoints(kinectron.HANDRIGHT)[0];
    // var rightShoulderJoint = bm.getJoints(kinectron.SHOULDERRIGHT)[0];
    // var rightElbowJoint = bm.getJoints(kinectron.ELBOWRIGHT)[0];
  
    // if(rightShoulderJoint != null || rightElbowJoint != null || rightHandJoint != null)
    //   punch(rightShoulderJoint, rightElbowJoint, rightHandJoint);

    // var leftHandJoint = bm.getJoints(kinectron.HANDLEFT)[0];
    // var leftShoulderJoint = bm.getJoints(kinectron.SHOULDERLEFT)[0];
    // var leftElbowJoint = bm.getJoints(kinectron.ELBOWLEFT)[0];

    // if(leftShoulderJoint != null || leftElbowJoint != null ||leftHandJoint != null)
    //   punch(leftShoulderJoint, leftElbowJoint, leftHandJoint);


    if(fullVid.time() >= pauses[currIndex] )
    {
      canPunch = true;
      // console.log(currIndex);
      fullVid.pause();
      currIndex++;
      console.log(fullVid.time());
      // if(currIndex >= pauseTimes.length)
      // {
      //   currIndex = 0;
      // }
    }
  // }
  
}



function stomp(hip, knee, foot)
{
  //if foot and knee raised above a certain threshold
  //foot comes down within certain speed
}


var withdrawnZ;
var extendedZ;

var lastState = "";
var startTime = 0;;

var WITHDRAWN_STATE = "withdrawn";
var EXTENDED_STATE = "extended"
var INBETWEEN_STATE = "";

function punch(shoulder, elbow, hand)
{
  var shoulderElbowDistance = 
      distanceVector(shoulder.pos, elbow.pos);

  var elbowHandDistance = 
      distanceVector(elbow.pos, hand.pos);

  var shoulderHandDistance = 
      distanceVector(shoulder.pos, hand.pos);
  
  var combinedArmLength = shoulderElbowDistance + elbowHandDistance;


  if(abs(shoulderHandDistance - combinedArmLength) <= 5) //arm is extended
  {
    lastState = EXTENDED_STATE;
    if(startTime != 0) //if coming from a withdrawn state
    {
      var timeDifference = millis()-startTime;

      if(timeDifference < 500) //speed of punch
      {
        var shoulderZPos = shoulder.pos.z * 100;
        var handZPos = hand.pos.z * 100;

        if(shoulderZPos - handZPos > combinedArmLength * 0.7) // is punch in front?
        {
          punchPlay();
        }
        startTime = 0; //reset startTime
      }
    }
  }
  else if(shoulderHandDistance < 25) //if arm is back in initial position
  {
    lastState = WITHDRAWN_STATE;
  }
  else //between withdrawn and extended states
  {
    if(lastState === WITHDRAWN_STATE)//leaving withdrawn into motion
    {
      // console.log(hand.pos.z);
      startTime = millis();//set time when leaving withdrawn
      lastState = INBETWEEN_STATE;
    }
  }
}
    
function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return 100 * Math.sqrt( dx * dx + dy * dy + dz * dz );
}

function bodyTracked(body) {
  var id = body.trackingId;
  // When there is a new body, add it
  if (!bm.contains(id)) bm.add(body);
  // Otherwise, update it
  else bm.update(body);
}


function keyPressed() {
  if (keyCode == 65) {
    punchPlay();
  } 
  else if(keyCode == 66)
  {
    fullVid.pause();
  }
  return false;
}

function punchPlay()
{
  fullVid.play();
  canPunch = false;
}
