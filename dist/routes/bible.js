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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
const router = express_1.default.Router();
router.use("/", (req, res, next) => {
    req.url = decodeURIComponent(req.url);
    next();
});
router.get("/:contentType", (0, express_validator_1.param)("contentType").notEmpty().isIn(services_1.CrawlerService.crawlerKeyList), middlewares_1.validatorErrorChecker, (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield services_1.CrawlerService.parse(req.params.contentType);
    res.send(content);
})));
exports.default = router;
//# sourceMappingURL=bible.js.map