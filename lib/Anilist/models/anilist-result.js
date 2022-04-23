"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnilistResult = void 0;
function AnilistResult(json) {
    var _a, _b, _c;
    const result = typeof json == 'string' ? JSON.parse(json) : json;
    if ((_b = (_a = result.errors) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 > 0) {
        (_c = result.errors) === null || _c === void 0 ? void 0 : _c.map(error => {
            console.log(`[ANILIST-ERROR(${error.status})] ${error.message}`);
        });
        throw new Error('Error while fetching data from Anilist, check logs for more info');
    }
    return result;
}
exports.AnilistResult = AnilistResult;
