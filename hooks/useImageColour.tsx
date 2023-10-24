import { useEffect, useState, useCallback } from "react";

export default function useImageColour(url: string) {
    const [colour, setColour] = useState<string>()

    const mainColour = useCallback(
        (results: Array<any>) => {
            var lightnesses: Array<number> = []
            for (var i = 0; i < results.length; i++) {
                var r = results[i][0][0] / 255
                var g = results[i][0][1] / 255
                var b = results[i][0][2] / 255
                var colour = [r, g, b]
                for (var j = 0; j < colour.length; j++) {
                    if (colour[j] <= 0.04045) {
                        colour[j] = colour[j] / 12.92;
                    } else {
                        colour[j] = Math.pow((( colour[j] + 0.055)/1.055),2.4);
                    }
                }
                var luminance = (0.2126 * colour[0] + 0.7152 * colour[1] + 0.0722 * colour[2])
                if ( luminance <= (216/24389)) {       // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
                    var lightness = luminance * (24389/27);  // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
                } else {
                    var lightness = Math.pow(luminance,(1/3)) * 116 - 16;
                }
        
                lightnesses.push(lightness)
        
                if (lightness > 10 && lightness < 90) {
                    return [results[i]]
                }
            }
            if (lightnesses[0] < 10) {
                return [[255, 255, 255]]
            } else {
                return [[0, 0, 0]]
            }
        },[])

    const th = useCallback(
        (i: number) => {
            var h = Math.round(i).toString(16);
            return h.length == 1 ? '0'+h : h;
        },[])

    const rgbToHex = useCallback(
        (rgb: Array<number>) => {
            return '#' + th(rgb[0]) + th(rgb[1]) + th(rgb[2]);
    },[th])

    const calculateCenter = useCallback(
        (points: Array<Array<number>>, n: number) => {
            if (points.length === 0) return [];
            var vals = []
            var plen = 0;
            for (var i = 0; i < n; i++) { vals.push(0); }
            for (var i = 0, l = points.length; i < l; i++) {
              plen++;
              for (var j = 0; j < n; j++) {
                vals[j] += points[i][j];
              }
            }
            for (var i = 0; i < n; i++) {
              vals[i] = vals[i] / plen;
            }
            return vals;
        },[])

    const euclidean = useCallback(
        (p1: Array<number>, p2: Array<number>) => {
            var s = 0;
            for (var i = 0, l = p1.length; i < l; i++) {
              s += Math.pow(p1[i] - p2[i], 2)
            }
            if (Number.isNaN(s)) {
                throw new Error("NaN encountered in euclidean.")
            }
            return s;
    },[])

    const kmeans = useCallback(
        (points: Array<Array<number>>, k: number, min_diff: number) => {
            var plen = points.length;
            var clusters: Array<any> = [];    
            var seen: Array<number> = [];
            while (clusters.length < k) {
              idx = Math.round(Math.random() * plen);
              var found = false;
              for (var i = 0; i < seen.length; i++ ) {
                if (idx === seen[i]) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                seen.push(idx);
                clusters.push([points[idx], [points[idx]]]);
              }
            }
        
            while (true) {
              var plists: Array<Array<Array<number>>> = [];
              for (var i = 0; i < k; i++) {
                plists.push([]);
              }
        
              for (var j = 0; j < plen; j++) {
                var p = points[j]
                var smallest_distance = 1000000000
                var idx = 0;
                for (var i = 0; i < k; i++) {
                  var distance = euclidean(p, clusters[i][0]);
                  if (distance < smallest_distance) {
                    smallest_distance = distance;
                    idx = i;
                  }
                }
                plists[idx].push(p);
              }
        
              var diff = 0;
              for (var i = 0; i < k; i++) {
                var old = clusters[i]
                var list = plists[i]
                if (list.length > 0) {
                    var center = calculateCenter(plists[i], 3)
                } else {
                    var idx = Math.round(Math.random() * plen);
                    var center = points[idx]
                }
                var new_cluster = [center, (plists[i])]
                var dist = euclidean(old[0], center);
                clusters[i] = new_cluster
                diff = diff > dist ? diff : dist;
              }
              if (diff < min_diff) {
                break;
              }
            }

            var sortedClusters = clusters.sort(function(a,b) {
              return b[1].length - a[1].length
            })
            return sortedClusters;
    },[euclidean, calculateCenter])

    const processImage = useCallback(
        (img: HTMLImageElement, context: CanvasRenderingContext2D) => {
            var points = [];
            context.drawImage(img, 0, 0, 64, 64);
            var data = context.getImageData(0, 0, 64, 64).data;
            for (var i = 0, l = data.length; i < l;  i += 4) {
                var r = data[i]
                , g = data[i+1]
                , b = data[i+2];
                points.push([r, g, b]);
            }
            var kmeansResults = kmeans(points, 3, 1)
            var results = mainColour(kmeansResults)
            var hex = [];
            for (var i = 0; i < results.length; i++) {
                hex.push(rgbToHex(results[i][0]));
            }
            return hex;
    },[kmeans, rgbToHex, mainColour])

    useEffect(() => {
        const context = document.createElement('canvas').getContext('2d')
        const img = new Image();
        img.setAttribute('crossOrigin', '');
        if (!context || !(context instanceof CanvasRenderingContext2D)) {
            throw new Error('Failed to get 2D context in colourExtractor');
        }
        img.onload = function() {
            var mainColour = processImage(img, context)[0]
            setColour(mainColour)
        }
        img.src = url;
    }, [url, processImage])

    return colour
}
