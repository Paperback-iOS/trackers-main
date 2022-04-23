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
            onSubmit: () => {
                return Promise.resolve();
            },
            validate: () => __awaiter(this, void 0, void 0, function* () { return true; })
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
