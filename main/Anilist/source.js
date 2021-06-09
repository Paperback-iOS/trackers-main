(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    var _a;
    let time;
    let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
class Tracker {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Tracker = Tracker;

},{}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./Tracker"), exports);

},{"./Source":2,"./Tracker":3}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./APIWrapper"), exports);

},{"./APIWrapper":1,"./base":4,"./models":42}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],7:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],8:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],9:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],10:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],11:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],12:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],13:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],14:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],15:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],16:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],17:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],18:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],19:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],20:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],21:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],22:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],23:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Button"), exports);
__exportStar(require("./Form"), exports);
__exportStar(require("./Header"), exports);
__exportStar(require("./InputField"), exports);
__exportStar(require("./Label"), exports);
__exportStar(require("./Link"), exports);
__exportStar(require("./MultilineLabel"), exports);
__exportStar(require("./NavigationButton"), exports);
__exportStar(require("./OAuthButton"), exports);
__exportStar(require("./Section"), exports);
__exportStar(require("./Select"), exports);
__exportStar(require("./Switch"), exports);
__exportStar(require("./WebViewButton"), exports);
__exportStar(require("./FormRow"), exports);

},{"./Button":9,"./Form":10,"./FormRow":11,"./Header":12,"./InputField":13,"./Label":14,"./Link":15,"./MultilineLabel":16,"./NavigationButton":17,"./OAuthButton":18,"./Section":19,"./Select":20,"./Switch":21,"./WebViewButton":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
    MangaStatus[MangaStatus["UNKNOWN"] = 2] = "UNKNOWN";
    MangaStatus[MangaStatus["ABANDONED"] = 3] = "ABANDONED";
    MangaStatus[MangaStatus["HIATUS"] = 4] = "HIATUS";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],27:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],28:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],29:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],30:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],31:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],32:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],33:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],34:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],35:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = void 0;
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],37:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],38:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],40:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],41:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],42:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./SourceStateManager"), exports);
__exportStar(require("./RequestInterceptor"), exports);
__exportStar(require("./DynamicUI"), exports);
__exportStar(require("./TrackedManga"), exports);
__exportStar(require("./SourceManga"), exports);

},{"./Chapter":6,"./ChapterDetails":7,"./Constants":8,"./DynamicUI":23,"./HomeSection":24,"./Languages":25,"./Manga":26,"./MangaTile":27,"./MangaUpdate":28,"./PagedResults":29,"./RequestHeaders":30,"./RequestInterceptor":31,"./RequestManager":32,"./RequestObject":33,"./ResponseObject":34,"./SearchRequest":35,"./SourceInfo":36,"./SourceManga":37,"./SourceStateManager":38,"./SourceTag":39,"./TagSection":40,"./TrackedManga":41}],43:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anilist = exports.AnilistInfo = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const graphql_queries_1 = require("./models/graphql-queries");
const anilist_result_1 = require("./models/anilist-result");
const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co/';
const FALLBACK_IMAGE = 'https://via.placeholder.com/100x150';
exports.AnilistInfo = {
    name: 'Anilist',
    author: 'Faizan Durrani',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '1.0.1',
    description: 'Anilist Tracker',
    authorWebsite: 'faizandurrani.github.io',
    websiteBaseURL: 'https://anilist.co'
};
class Anilist extends paperback_extensions_common_1.Tracker {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 5,
            requestTimeout: 20000,
            interceptor: {
                // Authorization injector
                interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const accessToken = yield this.accessToken.get();
                    request.headers = Object.assign(Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), ({
                        'content-type': 'application/json',
                        'accept': 'application/json',
                    })), (accessToken != null ? {
                        'authorization': `Bearer ${accessToken}`
                    } : {}));
                    return request;
                }),
                interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () {
                    return response;
                })
            }
        });
        this.stateManager = createSourceStateManager({});
        this.accessToken = {
            get: () => __awaiter(this, void 0, void 0, function* () {
                return this.stateManager.keychain.retrieve('access_token');
            }),
            set: (token) => __awaiter(this, void 0, void 0, function* () {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                yield this.stateManager.keychain.store('access_token', token);
                yield this.userInfo.refresh();
            }),
            isValid: () => __awaiter(this, void 0, void 0, function* () {
                return (yield this.accessToken.get()) != null;
            })
        };
        this.userInfo = {
            get: () => __awaiter(this, void 0, void 0, function* () {
                return this.stateManager.retrieve('userInfo');
            }),
            isLoggedIn: () => __awaiter(this, void 0, void 0, function* () {
                return (yield this.userInfo.get()) != null;
            }),
            refresh: () => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const accessToken = yield this.accessToken.get();
                if (accessToken == null) {
                    return this.stateManager.store('userInfo', undefined);
                }
                const response = yield this.requestManager.schedule(createRequestObject({
                    url: ANILIST_GRAPHQL_ENDPOINT,
                    method: 'POST',
                    data: graphql_queries_1.userProfileQuery()
                }), 0);
                const userInfo = (_b = anilist_result_1.AnilistResult(response.data).data) === null || _b === void 0 ? void 0 : _b.Viewer;
                yield this.stateManager.store('userInfo', userInfo);
            })
        };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getSearchResults(query, metadata) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const pageInfo = metadata;
            // If there are no more results, we dont want to make extra calls to Anilist
            if ((pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.hasNextPage) === false) {
                return createPagedResults({ results: [], metadata: pageInfo });
            }
            const nextPage = ((_a = pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.currentPage) !== null && _a !== void 0 ? _a : 0) + 1;
            const response = yield this.requestManager.schedule(createRequestObject({
                url: ANILIST_GRAPHQL_ENDPOINT,
                method: 'POST',
                data: graphql_queries_1.searchMangaQuery(nextPage, (_b = query.title) !== null && _b !== void 0 ? _b : '')
            }), 1);
            const anilistPage = (_c = anilist_result_1.AnilistResult(response.data).data) === null || _c === void 0 ? void 0 : _c.Page;
            return createPagedResults({
                results: (_d = anilistPage === null || anilistPage === void 0 ? void 0 : anilistPage.media.map(manga => {
                    var _a;
                    return createMangaTile({
                        id: manga.id.toString(),
                        image: (_a = manga.coverImage.large) !== null && _a !== void 0 ? _a : '',
                        title: createIconText({
                            text: manga.title.userPreferred
                        })
                    });
                })) !== null && _d !== void 0 ? _d : [],
                metadata: anilistPage === null || anilistPage === void 0 ? void 0 : anilistPage.pageInfo
            });
        });
    }
    // @ts-ignore
    getMangaForm(mangaId) {
        return createForm({
            sections: () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const responseTask = this.requestManager.schedule(createRequestObject({
                    url: ANILIST_GRAPHQL_ENDPOINT,
                    method: 'POST',
                    data: graphql_queries_1.getMangaProgressQuery(parseInt(mangaId))
                }), 1);
                // Make sure the user settings are up to date
                const refreshTask = this.userInfo.refresh();
                const response = (yield Promise.all([responseTask, refreshTask]))[0];
                const anilistManga = (_a = anilist_result_1.AnilistResult(response.data).data) === null || _a === void 0 ? void 0 : _a.Media;
                const user = yield this.userInfo.get();
                if (user == null) {
                    return [
                        createSection({
                            id: 'notLoggedInSection',
                            rows: () => __awaiter(this, void 0, void 0, function* () {
                                return [
                                    createLabel({
                                        id: 'notLoggedIn',
                                        label: 'Not Logged In',
                                        value: undefined
                                    })
                                ];
                            })
                        })
                    ];
                }
                if (anilistManga == null) {
                    return Promise.reject();
                }
                return [
                    createSection({
                        id: 'userInfo',
                        rows: () => __awaiter(this, void 0, void 0, function* () {
                            var _b, _c, _d;
                            return [
                                createHeader({
                                    id: 'header',
                                    imageUrl: (_c = (_b = user.avatar) === null || _b === void 0 ? void 0 : _b.large) !== null && _c !== void 0 ? _c : FALLBACK_IMAGE,
                                    title: (_d = user.name) !== null && _d !== void 0 ? _d : 'NOT LOGGED IN',
                                    subtitle: '',
                                    value: undefined
                                })
                            ];
                        })
                    }),
                    createSection({
                        id: 'information',
                        header: 'Information',
                        rows: () => __awaiter(this, void 0, void 0, function* () {
                            var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                            return [
                                // This allows us to get the id when the form is submitted
                                ...(anilistManga.mediaListEntry != null ? [createLabel({
                                        id: 'id',
                                        label: 'Entry ID',
                                        value: (_f = (_e = anilistManga.mediaListEntry) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.toString()
                                    })] : []),
                                createLabel({
                                    id: 'mediaId',
                                    label: 'Manga ID',
                                    value: (_h = (_g = anilistManga.id) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : 'UNKNOWN',
                                }),
                                createLabel({
                                    id: 'title',
                                    label: 'Title',
                                    value: (_k = (_j = anilistManga.title) === null || _j === void 0 ? void 0 : _j.userPreferred) !== null && _k !== void 0 ? _k : 'UNKNOWN',
                                }),
                                createLabel({
                                    id: 'popularity',
                                    value: (_m = (_l = anilistManga.popularity) === null || _l === void 0 ? void 0 : _l.toString()) !== null && _m !== void 0 ? _m : 'UNKNOWN',
                                    label: 'Popularity'
                                }),
                                createLabel({
                                    id: 'rating',
                                    value: (_p = (_o = anilistManga.averageScore) === null || _o === void 0 ? void 0 : _o.toString()) !== null && _p !== void 0 ? _p : 'UNKNOWN',
                                    label: 'Rating'
                                }),
                                createLabel({
                                    id: 'status',
                                    value: (_q = anilistManga.status) !== null && _q !== void 0 ? _q : 'UNKNOWN',
                                    label: 'Status'
                                }),
                                createLabel({
                                    id: 'isAdult',
                                    value: (_s = (_r = anilistManga.isAdult) === null || _r === void 0 ? void 0 : _r.toString()) !== null && _s !== void 0 ? _s : 'UNKNOWN',
                                    label: 'Is Adult'
                                })
                            ];
                        })
                    }),
                    createSection({
                        id: 'trackStatus',
                        header: 'Manga Status',
                        footer: 'Warning: Setting this to NONE will delete the listing from Anilist',
                        rows: () => __awaiter(this, void 0, void 0, function* () {
                            var _t, _u;
                            return [
                                createSelect({
                                    id: 'status',
                                    value: [(_u = (_t = anilistManga.mediaListEntry) === null || _t === void 0 ? void 0 : _t.status) !== null && _u !== void 0 ? _u : 'NONE'],
                                    allowsMultiselect: false,
                                    label: 'Status',
                                    displayLabel: (value) => {
                                        switch (value) {
                                            case 'CURRENT': return 'Reading';
                                            case 'PLANNING': return 'Planned';
                                            case 'COMPLETED': return 'Completed';
                                            case 'DROPPED': return 'Dropped';
                                            case 'PAUSED': return 'On-Hold';
                                            case 'REPEATING': return 'Re-Reading';
                                            default: return 'None';
                                        }
                                    },
                                    options: [
                                        'NONE',
                                        'CURRENT',
                                        'PLANNING',
                                        'COMPLETED',
                                        'DROPPED',
                                        'PAUSED',
                                        'REPEATING'
                                    ]
                                })
                            ];
                        })
                    }),
                    createSection({
                        id: 'manage',
                        header: 'Progress',
                        rows: () => __awaiter(this, void 0, void 0, function* () {
                            var _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
                            return [
                                //@ts-ignore
                                createStepper({
                                    id: 'progress',
                                    label: 'Chapter',
                                    value: (_w = (_v = anilistManga.mediaListEntry) === null || _v === void 0 ? void 0 : _v.progress) !== null && _w !== void 0 ? _w : 0,
                                    min: 0,
                                    step: 1
                                }),
                                //@ts-ignore
                                createStepper({
                                    id: 'progressVolumes',
                                    label: 'Volume',
                                    value: (_y = (_x = anilistManga.mediaListEntry) === null || _x === void 0 ? void 0 : _x.progressVolumes) !== null && _y !== void 0 ? _y : 0,
                                    min: 0,
                                    step: 1
                                }),
                                //@ts-ignore
                                createStepper({
                                    id: 'score',
                                    label: 'Score',
                                    value: (_z = anilistManga.mediaListEntry) === null || _z === void 0 ? void 0 : _z.score,
                                    min: 0,
                                    max: this.scoreFormatLimit((_1 = (_0 = user.mediaListOptions) === null || _0 === void 0 ? void 0 : _0.scoreFormat) !== null && _1 !== void 0 ? _1 : 'POINT_10'),
                                    step: ((_3 = (_2 = user.mediaListOptions) === null || _2 === void 0 ? void 0 : _2.scoreFormat) === null || _3 === void 0 ? void 0 : _3.includes('DECIMAL')) === true ? 0.1 : 1
                                }),
                                createInputField({
                                    id: 'notes',
                                    label: 'Notes',
                                    placeholder: 'Notes',
                                    value: (_5 = (_4 = anilistManga.mediaListEntry) === null || _4 === void 0 ? void 0 : _4.notes) !== null && _5 !== void 0 ? _5 : '',
                                    maskInput: false
                                })
                            ];
                        })
                    })
                ];
            }),
            onSubmit: (values) => __awaiter(this, void 0, void 0, function* () {
                var _6, _7;
                let mutation;
                const status = (_7 = (_6 = values['status']) === null || _6 === void 0 ? void 0 : _6[0]) !== null && _7 !== void 0 ? _7 : '';
                const id = values['id'] != null ? Number(values['id']) : undefined;
                if (status == 'NONE' && id != null) {
                    mutation = graphql_queries_1.deleteMangaProgressMutation(id);
                }
                else {
                    mutation = graphql_queries_1.saveMangaProgressMutation({
                        id: id,
                        mediaId: Number(values['mediaId']),
                        status: status,
                        notes: values['notes'],
                        progress: Number(values['progress']),
                        progressVolumes: Number(values['progressVolumes']),
                        score: Number(values['score'])
                    });
                }
                console.log(JSON.stringify(mutation, null, 2));
                yield this.requestManager.schedule(createRequestObject({
                    url: ANILIST_GRAPHQL_ENDPOINT,
                    method: 'POST',
                    data: mutation
                }), 1);
            }),
            validate: (_values) => __awaiter(this, void 0, void 0, function* () { return true; })
        });
    }
    getTrackedManga(mangaId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.requestManager.schedule(createRequestObject({
                url: ANILIST_GRAPHQL_ENDPOINT,
                method: 'POST',
                data: graphql_queries_1.getMangaQuery(parseInt(mangaId))
            }), 1);
            const anilistManga = (_a = anilist_result_1.AnilistResult(response.data).data) === null || _a === void 0 ? void 0 : _a.Media;
            if (anilistManga == null) {
                return Promise.reject();
            }
            return createTrackedManga({
                id: mangaId,
                mangaInfo: createMangaInfo({
                    image: (_c = (_b = anilistManga.coverImage) === null || _b === void 0 ? void 0 : _b.extraLarge) !== null && _c !== void 0 ? _c : '',
                    titles: [
                        (_d = anilistManga.title) === null || _d === void 0 ? void 0 : _d.romaji,
                        (_e = anilistManga.title) === null || _e === void 0 ? void 0 : _e.english,
                        (_f = anilistManga.title) === null || _f === void 0 ? void 0 : _f.native
                    ].filter(x => x != null),
                    artist: (_m = (_l = (_k = (_j = (_h = (_g = anilistManga.staff) === null || _g === void 0 ? void 0 : _g.edges) === null || _h === void 0 ? void 0 : _h.find(x => { var _a; return ((_a = x === null || x === void 0 ? void 0 : x.role) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'art'; })) === null || _j === void 0 ? void 0 : _j.node) === null || _k === void 0 ? void 0 : _k.name) === null || _l === void 0 ? void 0 : _l.full) !== null && _m !== void 0 ? _m : 'Unknown',
                    author: (_t = (_s = (_r = (_q = (_p = (_o = anilistManga.staff) === null || _o === void 0 ? void 0 : _o.edges) === null || _p === void 0 ? void 0 : _p.find(x => { var _a; return ((_a = x === null || x === void 0 ? void 0 : x.role) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'story'; })) === null || _q === void 0 ? void 0 : _q.node) === null || _r === void 0 ? void 0 : _r.name) === null || _s === void 0 ? void 0 : _s.full) !== null && _t !== void 0 ? _t : 'Unknown',
                    desc: anilistManga.description,
                    hentai: anilistManga.isAdult,
                    rating: anilistManga.averageScore,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    status: anilistManga.status,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    banner: anilistManga.bannerImage
                })
            });
        });
    }
    getSourceMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return createSection({
                id: 'sourceMenu',
                header: 'Source Menu',
                rows: () => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const isLoggedIn = yield this.userInfo.isLoggedIn();
                    if (isLoggedIn)
                        return [
                            createLabel({
                                id: 'userInfo',
                                label: 'Logged-in as',
                                value: (_b = (_a = (yield this.userInfo.get())) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'ERROR'
                            }),
                            createButton({
                                id: 'logout',
                                label: 'Logout',
                                value: undefined,
                                onTap: () => __awaiter(this, void 0, void 0, function* () {
                                    yield this.accessToken.set(undefined);
                                })
                            })
                        ];
                    else
                        return [
                            createOAuthButton({
                                id: 'anilistLogin',
                                authorizeEndpoint: 'https://anilist.co/api/v2/oauth/authorize',
                                clientId: '5459',
                                redirectUri: 'paperback://oauth-callback',
                                label: 'Login with Anilist',
                                responseType: {
                                    type: 'token'
                                },
                                value: undefined,
                                successHandler: (token, _refreshToken) => __awaiter(this, void 0, void 0, function* () {
                                    yield this.accessToken.set(token);
                                })
                            })
                        ];
                })
            });
        });
    }
    scoreFormatLimit(format) {
        var _a;
        const extracted = (_a = /\d+/gi.exec(format)) === null || _a === void 0 ? void 0 : _a[0];
        return extracted != null ? Number(extracted) : undefined;
    }
}
exports.Anilist = Anilist;

},{"./models/anilist-result":44,"./models/graphql-queries":45,"paperback-extensions-common":5}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMangaProgressMutation = exports.saveMangaProgressMutation = exports.getMangaProgressQuery = exports.getMangaQuery = exports.searchMangaQuery = exports.userProfileQuery = void 0;
const userProfileQuery = () => ({
    query: `{
        Viewer {
            id
            name
            mediaListOptions {
                scoreFormat
            }
            siteUrl
        }
    }`
});
exports.userProfileQuery = userProfileQuery;
const searchMangaQuery = (page, search) => ({
    query: `query($page: Int, $search: String) {
        Page(page: $page) {
            pageInfo {
                currentPage
                hasNextPage
            }
            media(type: MANGA, search: $search) {
                id
                title {
                    userPreferred
                }
                coverImage {
                    large
                }
            }
        }
    }`,
    variables: {
        page,
        search
    }
});
exports.searchMangaQuery = searchMangaQuery;
const getMangaQuery = (id) => ({
    query: `query($id: Int){
        Media(id: $id){
            id
            description(asHtml: false)
            title {
                romaji
                english
                native
            }
            coverImage{
                extraLarge
            }
            bannerImage
            averageScore
            isAdult
            popularity
            characters(sort: RELEVANCE, perPage: 25) {
                edges {
                    node {
                        image {
                            large
                        }
                        age
                    }
                    name
                    role
                }
            }
            staff {
                edges {
                    node {
                        name {
                            full
                        }
                        image {
                            large
                        }
                    }
                    role
                }
            }
            status
        }
    }`,
    variables: {
        id
    }
});
exports.getMangaQuery = getMangaQuery;
const getMangaProgressQuery = (id) => ({
    query: `query($id: Int) {
        Media(id: $id) {
            id
            mediaListEntry {
                id
                status
                progress
                progressVolumes
                private
                score
                notes
                advancedScores
            }
            title {
                romaji
                english
                native
                userPreferred
            }
            coverImage {
                extraLarge
            }
            bannerImage
            averageScore
            isAdult
            popularity
            status
        }
    }`,
    variables: { id }
});
exports.getMangaProgressQuery = getMangaProgressQuery;
const saveMangaProgressMutation = (variables) => ({
    query: `mutation($id: Int, $mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int, $progressVolumes: Int, $notes: String) {
        SaveMediaListEntry(id: $id, mediaId: $mediaId, status: $status, score: $score, progress: $progress, progressVolumes: $progressVolumes, notes: $notes){
            id
        }
    }`,
    variables: variables
});
exports.saveMangaProgressMutation = saveMangaProgressMutation;
const deleteMangaProgressMutation = (id) => ({
    query: `mutation($id: Int) {
        DeleteMediaListEntry(id: $id){
            deleted
        }
    }`,
    variables: { id }
});
exports.deleteMangaProgressMutation = deleteMangaProgressMutation;

},{}]},{},[43])(43)
});
