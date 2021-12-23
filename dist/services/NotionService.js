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
exports.createQTPage = exports.createQTDatabase = void 0;
const client_1 = require("@notionhq/client");
const services_1 = require("../services");
const utils_1 = require("../utils");
const createQTDatabase = ({ notion_auth, page_id, }) => __awaiter(void 0, void 0, void 0, function* () {
    const notion = new client_1.Client({ auth: notion_auth });
    const data = yield notion.databases.create({
        parent: { page_id },
        icon: { emoji: "📖" },
        title: [{ text: { content: `QT 말씀` } }],
        properties: {
            title: { title: {} },
            아멘: { people: {} },
            큐티책: { rich_text: {} },
            날짜: { date: {} },
        },
    });
    yield notion.databases.query({
        database_id: data.id,
        sorts: [{ property: "날짜", direction: "descending" }],
    });
    return data;
});
exports.createQTDatabase = createQTDatabase;
const createQTPage = ({ notion_auth, database_id, contentType, }) => __awaiter(void 0, void 0, void 0, function* () {
    const notion = new client_1.Client({ auth: notion_auth });
    const content = yield services_1.CrawlerService.parse(contentType);
    if (!content)
        return;
    return notion.pages.create({
        parent: { database_id },
        icon: { emoji: "🤲🏻" },
        properties: {
            title: { title: [{ text: { content: content.range } }] },
            큐티책: { rich_text: [{ text: { content: contentType } }] },
            날짜: { date: { start: utils_1.Time.toYMD() } },
        },
        children: [
            {
                heading_1: { text: [{ text: { content: content.title } }] },
            },
            {
                paragraph: { text: [{ text: { content: content.range } }] },
            },
            { paragraph: { text: [] } },
            ...content.verses.reduce((ac, { verse, text }, i) => {
                if (!verse) {
                    return [
                        ...ac,
                        // 첫 제목이 아닐 때
                        i && { paragraph: { text: [] } },
                        { heading_3: { text: [{ text: { content: text } }] } },
                        { divider: {} },
                    ].filter((v) => !!v);
                }
                return [
                    ...ac,
                    !i && { divider: {} },
                    {
                        paragraph: { text: [{ text: { content: `${verse}.   ${text}` } }] },
                    },
                    { divider: {} },
                ].filter((v) => !!v);
            }, []),
            { paragraph: { text: [] } },
            {
                toggle: {
                    text: [{ text: { content: "본문해설" } }],
                    children: [
                        { divider: {} },
                        ...content.commentaries.map((text) => 2 < text.length && text.length < 30
                            ? { heading_3: { text: [{ text: { content: text } }] } }
                            : { paragraph: { text: [{ text: { content: text } }] } }),
                        { divider: {} },
                    ],
                },
            },
        ],
    });
});
exports.createQTPage = createQTPage;
//# sourceMappingURL=NotionService.js.map