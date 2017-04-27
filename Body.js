// Body object
var Body = function (body) {
  // Create body with id, joints and ts.
  this.id = body.trackingId;

  // Local functio for creating Joint objects
  var createJoints = function () {
    var joints = [];
    for (var j = 0; j < body.joints.length; j++) {
      joints[j] = new Joint(j, body.joints[j]);
    }
    return joints;
  }
  var joints = createJoints();
  var ts = Date.now();

  // Update body joint and ts data
  this.update = function (body) {
    for (var j = 0; j < body.joints.length; j++) {
      joints[j].update(body.joints[j]);
      ts = Date.now();
    }
  }

  // Returns joint object for specified joint
  this.getJoint = function (joint) {
    return joints[joint];
  }

  // Returns position vector for specified joint
  this.getPosition = function (joint) {
    //console.log(this.joints[joint].pos);
    return joints[joint].pos;
  }

  // Check to see if body has been updated in last 5 seconds
  this.isDead = function () {
    return Date.now() - ts > DEATH_TH
  }

  this.punch = function () {
    var isRight = false;
    var isLeft = false;

    var rightHandJoint = this.getJoint(kinectron.HANDRIGHT);
    var rightShoulderJoint = this.getJoint(kinectron.SHOULDERRIGHT);
    var rightElbowJoint = this.getJoint(kinectron.ELBOWRIGHT);

    if(rightShoulderJoint != null || rightElbowJoint != null || rightHandJoint != null)
      isRight = isPunch(rightHandJoint, rightShoulderJoint, rightElbowJoint);

    var leftHandJoint = this.getJoint(kinectron.HANDLEFT);
    var leftShoulderJoint = this.getJoint(kinectron.SHOULDERLEFT);
    var leftElbowJoint = this.getJoint(kinectron.ELBOWLEFT);

    if(leftShoulderJoint != null || leftElbowJoint != null || leftHandJoint != null)
      isLeft = isPunch(leftHandJoint, leftShoulderJoint, leftElbowJoint);

    if(isRight || isLeft)
    {
      return true;
    }
    
  }
}


function isPunch(hand, shoulder, elbow)
{
  var handAccel = hand.acceleration * 100;

    var shoulderElbowDistance = 
        distanceVector(shoulder.pos, elbow.pos);

    var elbowHandDistance = 
        distanceVector(elbow.pos, hand.pos);

    var shoulderHandDistance = 
        distanceVector(shoulder.pos, hand.pos);
    
    var combinedArmLength = shoulderElbowDistance + elbowHandDistance;

    if(abs(shoulderHandDistance - combinedArmLength) <= 8 && hand.lastState != EXTENDED_STATE) //arm is extended
    {
      
      hand.lastState = EXTENDED_STATE;
      // console.log(EXTENDED_STATE);
      if(hand.startTime != 0) //if coming from a withdrawn state
      {
        var timeDifference = millis()-hand.startTime;
        console.log(timeDifference);
        if(timeDifference < 100) //speed of punch
        {
          var shoulderZPos = shoulder.pos.z * 100;
          var handZPos = hand.pos.z * 100;
          hand.startTime = 0; //reset hand.startTime
          return true;
          
        }
      }
    }
    else if(shoulderHandDistance < shoulderElbowDistance*1.5) //if arm is back in initial position
    {
      hand.lastState = WITHDRAWN_STATE;
      // console.log(WITHDRAWN_STATE);
    }
    else //between withdrawn and extended states
    {
      if(hand.lastState === WITHDRAWN_STATE)//leaving withdrawn into motion
      {
        // console.log(hand.pos.z);
        hand.startTime = millis();//set time when leaving withdrawn
        hand.lastState = INBETWEEN_STATE;
      }
    }

    return false;
}


    
function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return 100 * Math.sqrt( dx * dx + dy * dy + dz * dz );
}