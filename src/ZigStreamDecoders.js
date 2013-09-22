/**
 * Decoders for zig.js sensor's streams (rgb, depth)
 */

/**
 * Decoders the sensor's image stream (rgb)
 * @param zigPlugin
 * @returns {HTMLElement} canvas containing the decoded image
 */
function imageToCanvas(zigPlugin) {
    var buffer = document.createElement('canvas');
    var ctx = buffer.getContext("2d");
    buffer.width = 160;
    buffer.height = 120;
    var pix = ctx.createImageData(160, 120); // http://stackoverflow.com/questions/9543248/access-kinect-rgb-image-data-from-zigjs
    var data = pix.data;
    var srcData = Base64.decode(zigPlugin.imageMap);
    for (var i = 0; i < 160 * 120; i++) {
        data[i * 4] = srcData[i * 3 + 2];
        data[i * 4 + 1] = srcData[i * 3 + 1];
        data[i * 4 + 2] = srcData[i * 3 + 0];
        data[i * 4 + 3] = 255;
    }
    ctx.putImageData(pix, 0, 0);
    return buffer;
}