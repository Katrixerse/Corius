module.exports = {
    greyscale: (ctx, x, y, width, height) => {
        const data = ctx.getImageData(x, y, width, height);
        for (let i = 0; i < data.data.length; i += 4) {
            const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
            data.data[i] = brightness;
            data.data[i + 1] = brightness;
            data.data[i + 2] = brightness;
        }
        ctx.putImageData(data, x, y);
        return ctx;
    },
    invert: (ctx, x, y, width, height) => {
        const data = ctx.getImageData(x, y, width, height);
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = 255 - data.data[i];
            data.data[i + 1] = 255 - data.data[i + 1];
            data.data[i + 2] = 255 - data.data[i + 2];
        }
        ctx.putImageData(data, x, y);
        return ctx;
    },
    contrast: (ctx, x, y, width, height) => {
        const data = ctx.getImageData(x, y, width, height);
        const factor = (259 / 100) + 1;
        const intercept = 128 * (1 - factor);
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = (data.data[i] * factor) + intercept;
            data.data[i + 1] = (data.data[i + 1] * factor) + intercept;
            data.data[i + 2] = (data.data[i + 2] * factor) + intercept;
        }
        ctx.putImageData(data, x, y);
        return ctx;
    },
    distort: (ctx, amplitude, x, y, width, height, strideLevel = 4) => {
        const data = ctx.getImageData(x, y, width, height);
        const temp = ctx.getImageData(x, y, width, height);
        const stride = width * strideLevel;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
                const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
                const dest = (j * stride) + (i * strideLevel);
                const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
                data.data[dest] = temp.data[src];
                data.data[dest + 1] = temp.data[src + 1];
                data.data[dest + 2] = temp.data[src + 2];
            }
        }
        ctx.putImageData(data, x, y);
        return ctx;
    },
    shortenText: (ctx, text, maxWidth) => {
        let shorten = false;
        while (ctx.measureText(text).width > maxWidth) {
            if (!shorten) shorten = true;
            text = text.substr(0, text.length - 1);
        }
        return shorten ? `${text}...` : text;
    },
    wrapText: (ctx, text, maxWidth) => {
        return new Promise(resolve => {
            if (ctx.measureText(text).width < maxWidth) return resolve([text]);
            if (ctx.measureText('W').width > maxWidth) return resolve(null);
            const words = text.split(' ');
            const lines = [];
            let line = '';
            while (words.length > 0) {
                let split = false;
                while (ctx.measureText(words[0]).width >= maxWidth) {
                    const temp = words[0];
                    words[0] = temp.slice(0, -1);
                    if (split) {
                        words[1] = `${temp.slice(-1)}${words[1]}`;
                    } else {
                        split = true;
                        words.splice(1, 0, temp.slice(-1));
                    }
                }
                if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                    line += `${words.shift()} `;
                } else {
                    lines.push(line.trim());
                    line = '';
                }
                if (words.length === 0) lines.push(line.trim());
            }
            return resolve(lines);
        });
    }
};