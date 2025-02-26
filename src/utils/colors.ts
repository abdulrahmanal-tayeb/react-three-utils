type RGB = [number, number, number];


/**
 * Convert a color representation to **normalized** RGB's
 */
export function toRGB(color: string): RGB {
    color = color.trim().toLowerCase();

    if (color.startsWith('#')) {
        return parseHex(color);
    } else if (color.startsWith('rgb')) {
        return parseRGB(color);
    } else if (color.startsWith('hsl')) {
        return parseHSL(color);
    }
    throw new Error(`${color} is not supported. You can only use hex, hsl or rgb colors.`);
}


/**
 * Converts Hex colors to **normalized** RGBs
 */
export function parseHex(hex: string): RGB {
    hex = hex.replace(/^#/, '');
    let expanded = hex;

    if ([3, 4].includes(hex.length)) {
        expanded = hex.split('').map(c => c + c).join('');
    }

    if ([6, 8].includes(expanded.length)) {
        return [
            parseInt(expanded.substring(0, 2), 16) / 255,
            parseInt(expanded.substring(2, 4), 16) / 255,
            parseInt(expanded.substring(4, 6), 16) / 255
        ]
    }
    throw new Error('Invalid hex color');
}



/**
 * Converts an RGB string (e.g. rgb(255, 255, 255)) to a **normalized** RGB values.
 */
export function parseRGB(rgbStr: string): RGB {
    const match = rgbStr.match(/rgba?\(\s*([\d.%]+)\s*,\s*([\d.%]+)\s*,\s*([\d.%]+)/i);
    if (!match) throw new Error('Invalid RGB format');

    const parse = (val: string) => {
        if (val.endsWith('%')) return parseFloat(val) / 100;
        return parseFloat(val) / 255;
    };

    return [
        clamp(parse(match[1])),
        clamp(parse(match[2])),
        clamp(parse(match[3]))
    ];
}


/**
 * Converts an HSL representation to a **normalized** RGB values.
 */
export function parseHSL(hslStr: string): RGB {
    const match = hslStr.match(/hsla?\(\s*([\d.]+)(deg|rad|grad|turn)?\s*,\s*([\d.%]+)%\s*,\s*([\d.%]+)%/i);
    if (!match) throw new Error('Invalid HSL format');

    let h = parseFloat(match[1]);
    const unit = match[2] || 'deg';
    const s = parseFloat(match[3]) / 100;
    const l = parseFloat(match[4]) / 100;

    // Convert hue to degrees
    h = convertHue(h, unit) % 360 / 360;

    return hslToRGB(h, s, l);
}


export function convertHue(value: number, unit: string): number {
    switch (unit) {
        case 'rad': return value * 180 / Math.PI;
        case 'grad': return value * 0.9;
        case 'turn': return value * 360;
        default: return value;
    }
}


/**
 * Converts HSL to RGB
 */
export function hslToRGB(h: number, s: number, l: number): RGB {
    if (s === 0) return [l, l, l];

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return [
        clamp(hueToRGB(p, q, h + 1 / 3)),
        clamp(hueToRGB(p, q, h)),
        clamp(hueToRGB(p, q, h - 1 / 3))
    ]
}


/**
 * Hue to RGB :) 
 */
export function hueToRGB(p: number, q: number, t: number): number {
    let nt = t;
    if (nt < 0) nt += 1;
    if (nt > 1) nt -= 1;

    if (nt < 1 / 6) return p + (q - p) * 6 * nt;
    if (nt < 1 / 2) return q;
    if (nt < 2 / 3) return p + (q - p) * (2 / 3 - nt) * 6;
    return p;
}


/**
 * Clamps a value between 0 and 1
 * 
 * **:)**
 */
export function clamp(value: number): number {
    return Math.min(1, Math.max(0, value));
}