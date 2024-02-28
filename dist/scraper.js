"use strict";
// import type { Page } from "puppeteer";
// import puppeteer from "puppeteer";
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
const puppeteer_1 = __importDefault(require("puppeteer"));
const sitemapper_1 = __importDefault(require("sitemapper"));
function getArtists(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use evaluate to capture text content
            const artists = yield page.evaluate(() => {
                function getTextContent(element) {
                    let text = "";
                    // Iterate over child nodes
                    element.childNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            text += ` ${node.textContent} `;
                        }
                        else if (node.nodeType === Node.ELEMENT_NODE) {
                            text += ` ${getTextContent(node)} `;
                        }
                    });
                    return text;
                }
                const container = document.querySelector(".eventitem-title");
                if (!container) {
                    return [];
                }
                const titleText = getTextContent(container).trim();
                return titleText.split(",").map((item) => item.trim());
            });
            return artists;
        }
        catch (e) {
            console.error(`[!!!] something broke, ${e}`);
            return [];
        }
    });
}
function getDate(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use evaluate to capture text content
            const date = yield page.evaluate(() => {
                function getTextContent(element) {
                    let text = "";
                    // Iterate over child nodes
                    element.childNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            text += ` ${node.textContent} `;
                        }
                        else if (node.nodeType === Node.ELEMENT_NODE) {
                            text += ` ${getTextContent(node)} `;
                        }
                    });
                    return text;
                }
                const container = document.querySelector(".event-date");
                if (!container) {
                    return [];
                }
                const titleText = getTextContent(container).trim();
                return titleText.split(",").map((item) => item.trim());
            });
            return date;
        }
        catch (e) {
            console.error(`[!!!] something broke, ${e}`);
            return [];
        }
    });
}
function getTime(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use evaluate to capture text content
            const time = yield page.evaluate(() => {
                function getTextContent(element) {
                    let text = "";
                    // Iterate over child nodes
                    element.childNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            text += ` ${node.textContent} `;
                        }
                        else if (node.nodeType === Node.ELEMENT_NODE) {
                            text += ` ${getTextContent(node)} `;
                        }
                    });
                    return text;
                }
                const container = document.querySelector(".event-time-12hr-start");
                if (!container) {
                    return [];
                }
                const titleText = getTextContent(container).trim();
                return titleText.split(",").map((item) => item.trim());
            });
            return time;
        }
        catch (e) {
            console.error(`[!!!] something broke, ${e}`);
            return [];
        }
    });
}
function scrapeEvent(url, browser) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        yield page.goto(url);
        const eventArtists = yield getArtists(page);
        const eventDate = yield getDate(page);
        const eventTime = yield getTime(page);
        // Combine date and time and convert to Date object
        const combinedDate = eventDate.join(" ");
        const combinedTime = eventTime[0];
        const dateTimeString = `${combinedDate} ${combinedTime}`;
        const dateTime = new Date(dateTimeString);
        console.log({
            dateTime,
            eventDate,
            eventTime,
            url,
            eventArtists,
        });
    });
}
// async function scrape() {
//   const sitemap = new Sitemapper({});
//   const browser = await puppeteer.launch();
//   const response = await sitemap.fetch(
//     "https://www.cometpingpong.com/sitemap.xml"
//   );
//   const { sites } = response;
//   for (const s of sites) {
//     await scrapeEvent(s, browser);
//   }
//   await browser.close();
// }
function scrape() {
    return __awaiter(this, void 0, void 0, function* () {
        const sitemap = new sitemapper_1.default({});
        const browser = yield puppeteer_1.default.launch();
        const response = yield sitemap.fetch("https://www.cometpingpong.com/sitemap.xml");
        const { sites } = response;
        const filteredSites = sites.filter(site => site.includes('live-music-calendar'));
        for (const s of filteredSites) {
            yield scrapeEvent(s, browser);
        }
        yield browser.close();
    });
}
scrape();
