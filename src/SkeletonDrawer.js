/**
 * Draws the skeleton of a zig.js user
 */

// lines between joints
var jointConnections = [];
jointConnections[zig.Joint.LeftHand] = [zig.Joint.LeftWrist, zig.Joint.LeftElbow, zig.Joint.LeftShoulder, zig.Joint.Torso];
jointConnections[zig.Joint.RightHand] = [zig.Joint.RightWrist, zig.Joint.RightElbow, zig.Joint.RightShoulder, zig.Joint.Torso];
jointConnections[zig.Joint.Head] = [zig.Joint.Neck, zig.Joint.Torso, zig.Joint.Waist];
jointConnections[zig.Joint.LeftFoot] = [zig.Joint.LeftAnkle, zig.Joint.LeftKnee, zig.Joint.LeftHip, zig.Joint.Waist];
jointConnections[zig.Joint.RightFoot] = [zig.Joint.RightAnkle, zig.Joint.RightKnee, zig.Joint.RightHip, zig.Joint.Waist];
jointConnections[zig.Joint.LeftShoulder] = [zig.Joint.Neck, zig.Joint.RightShoulder];

var jointSize = 10;
var jointColor = "blue";
var boneColor = "red";

function SkeletonDrawer() {
    this.user = null;
}

SkeletonDrawer.prototype.setUser = function (user) {
    var id = user == null ? "null" : user.id;
    console.log("Skeleton user: " + id);
    this.user = user;
}

/**
 * draw the skeleton on the canvas, adjusting for the canvas scale.
 * @param canvas
 * @param scale scale from sensor image size to canvas size
 */
SkeletonDrawer.prototype.draw = function (canvas, scale) {
    if (this.user == null) {
        return;
    }

    // convert the pos to image space coordinates and scale the x/y values. Do not scale z
    var zigObj = zig.findZigObject();
    function toImageSpace(pos) {
        var projective = zigObj.convertWorldToImageSpace(pos);
        return [projective[0] * scale, projective[1] * scale, projective[2]];
    }

    var ctx = canvas.getContext("2d");

    // draw joints
    ctx.fillStyle = jointColor;
    for (var i in this.user.skeleton) {
        var pos = this.user.skeleton[i].position;
        var projective = toImageSpace(pos);
        ctx.fillRect(projective[0] - jointSize / 2, projective[1] - jointSize / 2, jointSize, jointSize);
        ctx.lineTo(projective[0], projective[1]);
    }

    //connect joints
    for (var i in jointConnections) {
        var jointStart = this.user.skeleton[i];
        if (jointStart != null) {  // TODO some joints were null, not sure why. Should investigate more

            var startPos = toImageSpace(this.user.skeleton[i].position);
            ctx.beginPath();
            ctx.moveTo(startPos[0], startPos[1]);

            for (var j in jointConnections[i]) {
                var nextJointId = jointConnections[i][j];
                var joint = this.user.skeleton[nextJointId];
                if (joint != null) {
                    var pos = toImageSpace(joint.position);
                    ctx.lineTo(pos[0], pos[1]);
                }
            }

            ctx.strokeStyle = boneColor;
            ctx.stroke();
        }
    }
};