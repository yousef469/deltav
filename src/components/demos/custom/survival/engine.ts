/**
 * Nova Survival Engine - High Fidelity Port
 * Logic for Rescue, Celestial Navigation, and Chess Rules
 */

// --- RESCUE ENGINE ---
interface RescuePoint {
    name: string;
    lat: number;
    lon: number;
    type: string;
}

export const RESCUE_POINTS: RescuePoint[] = [
    { name: "Cairo", lat: 30.0444, lon: 31.2357, type: "CITY" },
    { name: "Siwa Oasis", lat: 29.2032, lon: 25.5195, type: "OASIS" },
    { name: "New York", lat: 40.7128, lon: -74.0060, type: "CITY" },
    { name: "London", lat: 51.5074, lon: -0.1278, type: "CITY" },
    { name: "Riyadh", lat: 24.7136, lon: 46.6753, type: "CITY" },
    { name: "Dubai", lat: 25.2048, lon: 55.2708, type: "CITY" },
    { name: "Jeddah", lat: 21.4858, lon: 39.1925, type: "CITY" },
    { name: "Mecca", lat: 21.3891, lon: 39.8579, type: "CITY" },
    { name: "Medina", lat: 24.5247, lon: 39.5692, type: "CITY" },
    { name: "Dammam", lat: 26.4207, lon: 50.0888, type: "CITY" },
    { name: "Tabuk", lat: 28.3835, lon: 36.5662, type: "CITY" },
    { name: "Abha", lat: 18.2164, lon: 42.5053, type: "CITY" },
    { name: "Hail", lat: 27.5219, lon: 41.6907, type: "CITY" },
    { name: "Paris", lat: 48.8566, lon: 2.3522, type: "CITY" },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, type: "CITY" },
    { name: "Sydney", lat: -33.8688, lon: 151.2093, type: "CITY" },
    { name: "Cape Town", lat: -33.9249, lon: 18.4241, type: "CITY" },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437, type: "CITY" },
    { name: "Chicago", lat: 41.8781, lon: -87.6298, type: "CITY" },
    { name: "Houston", lat: 29.7604, lon: -95.3698, type: "CITY" },
    { name: "Phoenix", lat: 33.4484, lon: -112.0740, type: "CITY" },
    { name: "Philadelphia", lat: 39.9526, lon: -75.1652, type: "CITY" },
    { name: "San Antonio", lat: 29.4241, lon: -98.4936, type: "CITY" },
    { name: "San Diego", lat: 32.7157, lon: -117.1611, type: "CITY" },
    { name: "Dallas", lat: 32.7767, lon: -96.7970, type: "CITY" },
    { name: "San Jose", lat: 37.3382, lon: -121.8863, type: "CITY" },
    { name: "Austin", lat: 30.2672, lon: -97.7431, type: "CITY" },
    { name: "Boston", lat: 42.3601, lon: -71.0589, type: "CITY" },
    { name: "Miami", lat: 25.7617, lon: -80.1918, type: "CITY" },
    { name: "Seattle", lat: 47.6062, lon: -122.3321, type: "CITY" },
    { name: "Denver", lat: 39.7392, lon: -104.9903, type: "CITY" }
];

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    const brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
};

export const findNearestCivilization = (lat: number, lon: number) => {
    let nearest = RESCUE_POINTS[0];
    let minDist = calculateDistance(lat, lon, nearest.lat, nearest.lon);
    for (const point of RESCUE_POINTS) {
        const d = calculateDistance(lat, lon, point.lat, point.lon);
        if (d < minDist) { minDist = d; nearest = point; }
    }
    return { point: nearest, distance: minDist };
};

export const getCelestialGuidance = (currentLat: number, currentLon: number, targetLat: number, targetLon: number, lang: 'en' | 'ar' | 'zh' = 'en') => {
    const bearing = calculateBearing(currentLat, currentLon, targetLat, targetLon);
    const isNorth = currentLat >= 0;

    const starNames = {
        en: isNorth ? "North Star (Polaris)" : "Southern Cross",
        ar: isNorth ? "نجم الشمال (بولاريس)" : "صليب الجنوب",
        zh: isNorth ? "北极星 (Polaris)" : "南十字座"
    };

    let relativeBearing = isNorth ? bearing : (bearing + 180) % 360;
    let instruction = "";

    const messages = {
        en: {
            straight: "Walk STRAIGHT towards the star.",
            left: (d: number) => `Keep the star ${d}° to your LEFT.`,
            behind: "Walk with the star directly BEHIND you.",
            right: (d: number) => `Keep the star ${d}° to your RIGHT.`
        },
        ar: {
            straight: "امشِ مباشرة باتجاه النجم.",
            left: (d: number) => `اجعل النجم ${d} درجة على يسارك.`,
            behind: "امشِ والنجم خلفك مباشرة.",
            right: (d: number) => `اجعل النجم ${d} درجة على يمينك.`
        },
        zh: {
            straight: "笔直朝星星走去。",
            left: (d: number) => `保持星星在你的左侧 ${d}°。`,
            behind: "背对着星星直走。",
            right: (d: number) => `保持星星在你的右侧 ${d}°。`
        }
    };

    const m = messages[lang] || messages.en;

    if (relativeBearing < 15 || relativeBearing > 345) instruction = m.straight;
    else if (relativeBearing <= 165) instruction = m.left(Math.round(relativeBearing));
    else if (relativeBearing < 195) instruction = m.behind;
    else instruction = m.right(Math.round(360 - relativeBearing));

    return { star: starNames[lang] || starNames.en, instruction };
};

// --- CHESS ENGINE (Piece Validation) ---
interface Coordinate { r: number; c: number; }

export const validateMove = (piece: string, from: Coordinate, to: Coordinate, board: string[][]) => {
    const r1 = from.r, c1 = from.c, r2 = to.r, c2 = to.c;
    const dr = r2 - r1, dc = c2 - c1;
    const isWhite = piece === piece.toUpperCase();
    const targetPiece = board[r2][c2];

    // Cannot capture own piece
    if (targetPiece !== '.' && (targetPiece === targetPiece.toUpperCase()) === isWhite) return false;

    const isCapture = targetPiece !== '.' && (targetPiece === targetPiece.toUpperCase()) !== isWhite;
    const adr = Math.abs(dr);
    const adc = Math.abs(dc);

    switch (piece.toLowerCase()) {
        case 'p': // Pawn
            const dir = isWhite ? -1 : 1;
            if (dc === 0 && !isCapture) {
                if (dr === dir) return board[r2][c2] === '.';
                if (dr === 2 * dir && (isWhite ? r1 === 6 : r1 === 1)) {
                    return board[r1 + dir][c1] === '.' && board[r2][c2] === '.';
                }
            } else if (adc === 1 && dr === dir && isCapture) {
                return true;
            }
            return false;

        case 'r': // Rook
            if (dr !== 0 && dc !== 0) return false;
            return isPathClear(from, to, board);

        case 'n': // Knight
            return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);

        case 'b': // Bishop
            if (adr !== adc) return false;
            return isPathClear(from, to, board);

        case 'q': // Queen
            if (adr !== adc && dr !== 0 && dc !== 0) return false;
            return isPathClear(from, to, board);

        case 'k': // King
            return adr <= 1 && adc <= 1;

        default: return false;
    }
};

const isPathClear = (from: Coordinate, to: Coordinate, board: string[][]) => {
    let r = from.r, c = from.c;
    const dr = Math.sign(to.r - from.r);
    const dc = Math.sign(to.c - from.c);

    r += dr; c += dc;
    while (r !== to.r || c !== to.c) {
        if (board[r][c] !== '.') return false;
        r += dr; c += dc;
    }
    return true;
};
