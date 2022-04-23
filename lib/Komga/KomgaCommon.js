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
