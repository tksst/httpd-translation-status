//   Copyright 2014 Takashi Sato
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import * as React from "react";
import * as ReactDOM from "react-dom";
import "core-js/es/object";

// UTF-8
const NBSP = "\u00A0";

// 12345678 -> 12 345 678
function addThousandsSeparator(num: number) {
    return num == null ? null : String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${NBSP}`);
}

function docUrl(ver: string, filename: string) {
    let url = `http://httpd.apache.org/docs/${ver}/`;
    url += langfile(filename).replace(/^(.+)\.xml$/g, "$1.html");
    return url;
}

function viewvcUrl(ver: string, base: string, lang?: string) {
    let url = "http://svn.apache.org/viewvc/httpd/httpd/";
    url += ver === "trunk" ? "trunk" : `branches/${ver}.x`;
    url += `/docs/manual/${langfile(base, lang)}`;
    return url;
}

function viewvcDiffUrl(ver: string, base: string, rev: number, trrev: number, format?: string) {
    let url = `${viewvcUrl(ver, base)}?r1=${trrev}&r2=${rev}`;
    if (format !== undefined) {
        url += `&diff_format=${format}`;
    }
    return url;
}

function langfile(base: string, lang: string = "en") {
    if (base === "style/lang/") {
        return `${base}${lang}.xml`;
    }
    if (lang === "en") {
        return base;
    }
    return `${base}.${lang}`;
}

function showMsg(text: string, cname: string) {
    ReactDOM.render(<div className={cname}>{text}</div>, document.getElementsByTagName("main")[0]);
}

function getVersion() {
    const h = location.hash.substr(1);
    if (h === "") {
        return "trunk";
    }
    if (["trunk", "2.4", "2.2", "2.0"].indexOf(h) < 0) {
        return null;
    }
    return h;
}

function changeVersionLinkStyle(ver: string) {
    ["trunk", "2.4", "2.2", "2.0"].forEach((v, index, array) => {
        document.getElementById(`link_${v}`).className = ver === v ? "strongLink" : "normalLink";
    });
}

const translations2Array = (langs: string[], translations) =>
    langs.map(it => (translations.hasOwnProperty(it) ? translations[it] : null));

const TableBody = ({ ver, resutlObj }) => {
    const result = Object.entries(resutlObj.files).map(([filename, value2]) => {
        const value = value2 as any;

        const englishRev = value.rev;

        const translationcells = translations2Array(resutlObj.langs, value.translations).map(
            (translationRev, index) => {
                const lang = resutlObj.langs[index];

                if (translationRev === null) {
                    return <td />;
                }

                if (translationRev === "error") {
                    return (
                        <td className="error">
                            <a href={viewvcUrl(ver, filename, lang)}>{translationRev}</a>
                        </td>
                    );
                }

                if (translationRev < englishRev) {
                    return (
                        <td className="outdated">
                            <a href={viewvcUrl(ver, filename, lang)}>{addThousandsSeparator(translationRev)}</a>
                            {NBSP}
                            {NBSP}
                            <a href={viewvcDiffUrl(ver, filename, englishRev, translationRev, "l")}>diff</a>
                        </td>
                    );
                }
                return (
                    <td className="uptodate">
                        <a href={viewvcUrl(ver, filename, lang)}>{addThousandsSeparator(translationRev)}</a>
                    </td>
                );
            }
        );

        return (
            <tr>
                <td className="filename">
                    <a href={docUrl(ver, filename)}>{filename}</a>
                </td>
                <td>
                    <a href={viewvcUrl(ver, filename)}>{addThousandsSeparator(englishRev)}</a>
                </td>
                {translationcells}
            </tr>
        );
    });

    return <>{result}</>;
};

const TableHead = ({ langs }) => (
    <tr>
        <th />
        <th>en</th>
        {langs.map(it => (
            <th>{it}</th>
        ))}
    </tr>
);

const load = (ver: string, r: boolean, e: Event) => {
    showMsg("loading...", "infomsg");

    if (ver === null) {
        ver = getVersion();
        if (ver === null) {
            showMsg("unknown version", "errormsg");
            return r;
        }
    }
    changeVersionLinkStyle(ver);

    const req = new XMLHttpRequest();
    req.open("GET", `${ver}.json`, true);
    req.onload = () => {
        if (req.status !== 200) {
            showMsg(`HTTP ${req.status} Error`, "errormsg");
        }
        const obj = JSON.parse(req.responseText);

        ReactDOM.render(
            <table>
                <thead>
                    <TableHead langs={obj.langs} />
                </thead>
                <tbody>
                    <TableBody ver={ver} resutlObj={obj} />
                </tbody>
                <tfoot>
                    <TableHead langs={obj.langs} />
                </tfoot>
            </table>,
            document.getElementsByTagName("main")[0]
        );
    };
    req.onerror = () => {
        showMsg("Unknown Error", "errormsg");
    };
    req.send(null);
    return r;
};

window.addEventListener("DOMContentLoaded", load.bind(null, null, true));
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("link_trunk").addEventListener("click", load.bind(null, "trunk", false));
    document.getElementById("link_2.4").addEventListener("click", load.bind(null, "2.4", false));
    document.getElementById("link_2.2").addEventListener("click", load.bind(null, "2.2", false));
    document.getElementById("link_2.0").addEventListener("click", load.bind(null, "2.0", false));

    const foo = `<p>This page reads the JSONs below and display the translation status. The JSONs are generated hourly with <a href="translation-status.tar.xz">this script</a></p>
    <p><a href='trunk.json'>trunk.json</a> <a href="2.4.json">2.4.json</a> <a href="2.2.json">2.2.json</a> <a href="2.0.json">2.0.json</a></p>`;
    document.getElementsByTagName("header")[0].insertAdjacentHTML("afterbegin", foo);
});
