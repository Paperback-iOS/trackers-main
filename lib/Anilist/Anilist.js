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
    version: '1.0.6',
    description: 'Anilist Tracker',
    authorWebsite: 'faizandurrani.github.io',
    websiteBaseURL: 'https://anilist.co'
};
class Anilist extends paperback_extensions_common_1.Tracker {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 2.5,
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
            console.log(JSON.stringify(anilistPage, null, 2));
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
                            var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
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
                                    value: (_g = anilistManga.id) === null || _g === void 0 ? void 0 : _g.toString(),
                                }),
                                createLabel({
                                    id: 'mangaTitle',
                                    label: 'Title',
                                    value: (_j = (_h = anilistManga.title) === null || _h === void 0 ? void 0 : _h.userPreferred) !== null && _j !== void 0 ? _j : 'N/A',
                                }),
                                createLabel({
                                    id: 'mangaPopularity',
                                    value: (_l = (_k = anilistManga.popularity) === null || _k === void 0 ? void 0 : _k.toString()) !== null && _l !== void 0 ? _l : 'N/A',
                                    label: 'Popularity'
                                }),
                                createLabel({
                                    id: 'mangaRating',
                                    value: (_o = (_m = anilistManga.averageScore) === null || _m === void 0 ? void 0 : _m.toString()) !== null && _o !== void 0 ? _o : 'N/A',
                                    label: 'Rating'
                                }),
                                createLabel({
                                    id: 'mangaStatus',
                                    value: (_p = anilistManga.status) !== null && _p !== void 0 ? _p : 'N/A',
                                    label: 'Status'
                                }),
                                createLabel({
                                    id: 'mangaIsAdult',
                                    value: (_r = (_q = anilistManga.isAdult) === null || _q === void 0 ? void 0 : _q.toString()) !== null && _r !== void 0 ? _r : 'N/A',
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
                            var _s, _t;
                            return [
                                createSelect({
                                    id: 'status',
                                    value: [(_t = (_s = anilistManga.mediaListEntry) === null || _s === void 0 ? void 0 : _s.status) !== null && _t !== void 0 ? _t : 'NONE'],
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
                            var _u, _v, _w, _x;
                            return [
                                //@ts-ignore
                                createStepper({
                                    id: 'progress',
                                    label: 'Chapter',
                                    value: (_v = (_u = anilistManga.mediaListEntry) === null || _u === void 0 ? void 0 : _u.progress) !== null && _v !== void 0 ? _v : 0,
                                    min: 0,
                                    step: 1
                                }),
                                //@ts-ignore
                                createStepper({
                                    id: 'progressVolumes',
                                    label: 'Volume',
                                    value: (_x = (_w = anilistManga.mediaListEntry) === null || _w === void 0 ? void 0 : _w.progressVolumes) !== null && _x !== void 0 ? _x : 0,
                                    min: 0,
                                    step: 1
                                })
                            ];
                        })
                    }),
                    createSection({
                        id: 'rateSection',
                        header: 'Rating',
                        footer: 'This uses your rating preference set on AniList',
                        rows: () => __awaiter(this, void 0, void 0, function* () {
                            var _y, _z, _0, _1, _2, _3;
                            return [
                                //@ts-ignore
                                createStepper({
                                    id: 'score',
                                    label: 'Score',
                                    value: (_z = (_y = anilistManga.mediaListEntry) === null || _y === void 0 ? void 0 : _y.score) !== null && _z !== void 0 ? _z : 0,
                                    min: 0,
                                    max: this.scoreFormatLimit((_1 = (_0 = user.mediaListOptions) === null || _0 === void 0 ? void 0 : _0.scoreFormat) !== null && _1 !== void 0 ? _1 : 'POINT_10'),
                                    step: ((_3 = (_2 = user.mediaListOptions) === null || _2 === void 0 ? void 0 : _2.scoreFormat) === null || _3 === void 0 ? void 0 : _3.includes('DECIMAL')) === true ? 0.1 : 1
                                })
                            ];
                        })
                    }),
                    createSection({
                        id: 'mangaNotes',
                        header: 'Notes',
                        rows: () => __awaiter(this, void 0, void 0, function* () {
                            var _4, _5;
                            return [
                                createInputField({
                                    id: 'notes',
                                    // @ts-ignore
                                    label: undefined,
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
                const progressVolumes = values['progressVolumes'] ? Number(values['progressVolumes']) : undefined;
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
                        progressVolumes: progressVolumes,
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
                    desc: (anilistManga === null || anilistManga === void 0 ? void 0 : anilistManga.description) || '',
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
    // @ts-ignore
    processActionQueue(actionQueue) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapterReadActions = yield actionQueue.queuedChapterReadActions();
            for (const readAction of chapterReadActions) {
                try {
                    const response = yield this.requestManager.schedule(createRequestObject({
                        url: ANILIST_GRAPHQL_ENDPOINT,
                        method: 'POST',
                        data: graphql_queries_1.saveMangaProgressMutation({
                            mediaId: readAction.mangaId,
                            progress: readAction.chapterNumber,
                            progressVolumes: readAction.volumeNumber
                        })
                    }), 0);
                    if (response.status < 400) {
                        yield actionQueue.discardChapterReadAction(readAction);
                    }
                    else {
                        yield actionQueue.retryChapterReadAction(readAction);
                    }
                }
                catch (error) {
                    console.log(error);
                    yield actionQueue.retryChapterReadAction(readAction);
                }
            }
        });
    }
    scoreFormatLimit(format) {
        var _a;
        const extracted = (_a = /\d+/gi.exec(format)) === null || _a === void 0 ? void 0 : _a[0];
        return extracted != null ? Number(extracted) : undefined;
    }
}
exports.Anilist = Anilist;
