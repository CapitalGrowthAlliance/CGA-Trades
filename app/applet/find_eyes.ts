import https from 'https';
import fs from 'fs';
import { PNG } from 'pngjs';

https.get('https://i.imgur.com/FDXo6UM.png', (res) => {
  res.pipe(new PNG())
    .on('parsed', function() {
      let maxBrightness = 0;
      let brightPixels = [];
      
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          const r = this.data[idx];
          const g = this.data[idx+1];
          const b = this.data[idx+2];
          const brightness = (r + g + b) / 3;
          
          if (brightness > 240) { // Very bright pixels
            brightPixels.push({x, y, r, g, b});
          }
        }
      }
      
      // Cluster the bright pixels to find the eyes
      console.log(`Found ${brightPixels.length} very bright pixels`);
      if (brightPixels.length > 0) {
        // Simple clustering
        let leftEye = {x: 0, y: 0, count: 0};
        let rightEye = {x: 0, y: 0, count: 0};
        
        const midX = this.width / 2;
        
        brightPixels.forEach(p => {
          if (p.x < midX) {
            leftEye.x += p.x;
            leftEye.y += p.y;
            leftEye.count++;
          } else {
            rightEye.x += p.x;
            rightEye.y += p.y;
            rightEye.count++;
          }
        });
        
        if (leftEye.count > 0) {
          leftEye.x /= leftEye.count;
          leftEye.y /= leftEye.count;
          console.log(`Left eye approx: x=${leftEye.x} (${(leftEye.x/this.width*100).toFixed(1)}%), y=${leftEye.y} (${(leftEye.y/this.height*100).toFixed(1)}%)`);
        }
        if (rightEye.count > 0) {
          rightEye.x /= rightEye.count;
          rightEye.y /= rightEye.count;
          console.log(`Right eye approx: x=${rightEye.x} (${(rightEye.x/this.width*100).toFixed(1)}%), y=${rightEye.y} (${(rightEye.y/this.height*100).toFixed(1)}%)`);
        }
      }
    });
});
