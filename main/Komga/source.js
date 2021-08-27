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

},{"./APIWrapper":1,"./base":4,"./models":45}],6:[function(require,module,exports){
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
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],24:[function(require,module,exports){
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
__exportStar(require("./Stepper"), exports);

},{"./Button":9,"./Form":10,"./FormRow":11,"./Header":12,"./InputField":13,"./Label":14,"./Link":15,"./MultilineLabel":16,"./NavigationButton":17,"./OAuthButton":18,"./Section":19,"./Select":20,"./Stepper":21,"./Switch":22,"./WebViewButton":23}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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
exports.SearchOperator = void 0;
var SearchOperator;
(function (SearchOperator) {
    SearchOperator["AND"] = "AND";
    SearchOperator["OR"] = "OR";
})(SearchOperator = exports.SearchOperator || (exports.SearchOperator = {}));

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],39:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],42:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],43:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],44:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],45:[function(require,module,exports){
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
__exportStar(require("./TrackedMangaChapterReadAction"), exports);
__exportStar(require("./TrackerActionQueue"), exports);

},{"./Chapter":6,"./ChapterDetails":7,"./Constants":8,"./DynamicUI":24,"./HomeSection":25,"./Languages":26,"./Manga":27,"./MangaTile":28,"./MangaUpdate":29,"./PagedResults":30,"./RequestHeaders":31,"./RequestInterceptor":32,"./RequestManager":33,"./RequestObject":34,"./ResponseObject":35,"./SearchRequest":36,"./SourceInfo":37,"./SourceManga":38,"./SourceStateManager":39,"./SourceTag":40,"./TagSection":41,"./TrackedManga":42,"./TrackedMangaChapterReadAction":43,"./TrackerActionQueue":44}],46:[function(require,module,exports){
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
exports.Komga = exports.KomgaInfo = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const KomgaCommon_1 = require("./KomgaCommon");
exports.KomgaInfo = {
    name: 'Komga',
    author: 'Lemon',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '1.0.0',
    description: 'Komga Tracker',
    authorWebsite: 'https://github.com/FramboisePi',
    websiteBaseURL: 'https://komga.org'
};
const PAGE_SIZE = 40;
class Komga extends paperback_extensions_common_1.Tracker {
    constructor() {
        super(...arguments);
        this.stateManager = createSourceStateManager({});
        this.requestManager = createRequestManager({
            requestsPerSecond: 5,
            requestTimeout: 20000,
            interceptor: {
                // Authorization injector
                interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const authorizationString = yield this.getAuthorizationString();
                    request.headers = Object.assign(Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), ({
                        'content-type': 'application/json',
                        'accept': 'application/json',
                    })), (authorizationString != null ? {
                        'authorization': authorizationString
                    } : {}));
                    return request;
                }),
                interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () {
                    return response;
                })
            }
        });
    }
    getAuthorizationString() {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationString = yield this.stateManager.retrieve("authorization");
            if (authorizationString === null) {
                throw new Error("Unset credentials in source settings");
            }
            return authorizationString;
        });
    }
    getKomgaAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            const komgaAPI = yield this.stateManager.retrieve("komgaAPI");
            if (komgaAPI === null) {
                throw new Error("Unset server URL in source settings");
            }
            return komgaAPI;
        });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getSearchResults(searchQuery, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            return KomgaCommon_1.KomgaCommon.searchRequest(searchQuery, metadata, this.requestManager, this.stateManager, PAGE_SIZE);
        });
    }
    // @ts-ignore
    getMangaForm(mangaId) {
        return createForm({
            sections: () => __awaiter(this, void 0, void 0, function* () {
                return [
                    createSection({
                        id: 'mangaId',
                        rows: () => __awaiter(this, void 0, void 0, function* () {
                            return [
                                createLabel({
                                    id: 'id',
                                    label: 'Manga id: ' + mangaId,
                                    value: undefined
                                }),
                                createLabel({
                                    id: 'info',
                                    label: 'The app will sync read chapters to the Komga server',
                                    value: undefined
                                })
                            ];
                        })
                    })
                ];
            }),
            onSubmit: (values) => {
                return Promise.resolve();
            },
            validate: (_values) => __awaiter(this, void 0, void 0, function* () { return true; })
        });
    }
    getTrackedManga(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const komgaAPI = yield this.getKomgaAPI();
            const request = createRequestObject({
                url: `${komgaAPI}/series/${mangaId}/`,
                method: "GET",
            });
            const response = yield this.requestManager.schedule(request, 1);
            const result = (typeof response.data) === "string" ? JSON.parse(response.data) : response.data;
            const metadata = result.metadata;
            const booksMetadata = result.booksMetadata;
            let authors = [];
            let artists = [];
            // Additional roles: colorist, inker, letterer, cover, editor
            for (let entry of booksMetadata.authors) {
                if (entry.role === "writer") {
                    authors.push(entry.name);
                }
                if (entry.role === "penciller") {
                    artists.push(entry.name);
                }
            }
            return createTrackedManga({
                id: mangaId,
                mangaInfo: createMangaInfo({
                    image: `${komgaAPI}/series/${mangaId}/thumbnail`,
                    titles: [metadata.title],
                    artist: artists.join(", "),
                    author: authors.join(", "),
                    desc: (metadata.summary ? metadata.summary : booksMetadata.summary),
                    hentai: false,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    status: 'Reading',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    banner: ""
                })
            });
        });
    }
    getSourceMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return createSection({
                id: 'information',
                header: 'Informations',
                rows: () => __awaiter(this, void 0, void 0, function* () {
                    return [
                        createMultilineLabel({
                            label: "This tracker sync read chapters from the app to the Komga server.\nNote: only titles from the Komga source can be synced.",
                            value: "",
                            id: "description"
                        }),
                        createLabel({
                            label: "Use the source settings menu to set your server credentials.",
                            value: "",
                            id: "settings"
                        })
                    ];
                })
            });
        });
    }
    // @ts-ignore
    processActionQueue(actionQueue) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapterReadActions = yield actionQueue.queuedChapterReadActions();
            const komgaAPI = yield this.getKomgaAPI();
            for (const readAction of chapterReadActions) {
                if (readAction.sourceId != "Komga") {
                    console.log(`Manga ${readAction.mangaId} from source ${readAction.sourceId} can not be used as it does not come from Komga. Discarding`);
                    yield actionQueue.discardChapterReadAction(readAction);
                }
                else {
                    try {
                        // The app only support completed read status so the last page read is not important and set to 1
                        const request = createRequestObject({
                            url: `${komgaAPI}/books/${readAction.sourceChapterId}/read-progress`,
                            method: "PATCH",
                            data: {
                                "page": 1,
                                "completed": true
                            }
                        });
                        const response = yield this.requestManager.schedule(request, 1);
                        if (response.status < 400) {
                            yield actionQueue.discardChapterReadAction(readAction);
                        }
                        else {
                            yield actionQueue.retryChapterReadAction(readAction);
                        }
                    }
                    catch (error) {
                        console.log(`Tracker action for manga id ${readAction.mangaId} failed with error:`);
                        console.log(error);
                        yield actionQueue.retryChapterReadAction(readAction);
                    }
                }
            }
        });
    }
}
exports.Komga = Komga;

},{"./KomgaCommon":47,"paperback-extensions-common":5}],47:[function(require,module,exports){
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
exports.KomgaCommon = void 0;
/*
    Common methods for the source and the tracker:
        - searchRequest
    Version 1
*/
class KomgaCommon {
    static searchRequest(searchQuery, metadata, requestManager, stateManager, page_size) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // This function is also called when the user search in an other source. It should not throw if the server is unavailable.
            // We won't use `await this.getKomgaAPI()` as we do not want to throw an error
            const komgaAPI = yield stateManager.retrieve("komgaAPI");
            if (komgaAPI === null) {
                console.log("searchRequest failed because server settings are unset");
                return createPagedResults({
                    results: this.getServerUnavailableMangaTiles(),
                });
            }
            let page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 0;
            let paramsList = [`page=${page}`, `size=${page_size}`];
            if (searchQuery.title !== undefined && searchQuery.title !== "") {
                paramsList.push("search=" + encodeURIComponent(searchQuery.title));
            }
            if (searchQuery.includedTags !== undefined) {
                searchQuery.includedTags.forEach(tag => {
                    // There are two types of tags: `tag` and `genre`
                    if (tag.id.substr(0, 4) == "tag-") {
                        paramsList.push("tag=" + encodeURIComponent(tag.id.substring(4)));
                    }
                    if (tag.id.substr(0, 6) == "genre-") {
                        paramsList.push("genre=" + encodeURIComponent(tag.id.substring(6)));
                    }
                });
            }
            let paramsString = "";
            if (paramsList.length > 0) {
                paramsString = "?" + paramsList.join("&");
            }
            const request = createRequestObject({
                url: `${komgaAPI}/series`,
                method: "GET",
                param: paramsString,
            });
            // We don't want to throw if the server is unavailable
            let data;
            try {
                data = yield requestManager.schedule(request, 1);
            }
            catch (error) {
                console.log(`searchRequest failed with error: ${error}`);
                return createPagedResults({
                    results: this.getServerUnavailableMangaTiles()
                });
            }
            const result = (typeof data.data) === "string" ? JSON.parse(data.data) : data.data;
            let tiles = [];
            for (let serie of result.content) {
                tiles.push(createMangaTile({
                    id: serie.id,
                    title: createIconText({ text: serie.metadata.title }),
                    image: `${komgaAPI}/series/${serie.id}/thumbnail`,
                }));
            }
            // If no series were returned we are on the last page
            metadata = tiles.length === 0 ? undefined : { page: page + 1 };
            return createPagedResults({
                results: tiles,
                metadata
            });
        });
    }
}
exports.KomgaCommon = KomgaCommon;
KomgaCommon.getServerUnavailableMangaTiles = () => {
    // This tile is used as a placeholder when the server is unavailable
    return [createMangaTile({
            id: "placeholder-id",
            title: createIconText({ text: "Server" }),
            image: "",
            subtitleText: createIconText({ text: "unavailable" }),
        })];
};

},{}]},{},[46])(46)
});
