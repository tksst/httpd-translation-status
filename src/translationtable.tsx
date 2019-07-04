//   Copyright 2019 Takashi Sato
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
import { Data, File } from "./statusData";

// UTF-8
const NBSP = "\u00A0";

function langfile(base: string, lang: string = "en"): string {
    if (base === "style/lang/") {
        return `${base}${lang}.xml`;
    }
    if (lang === "en") {
        return base;
    }
    return `${base}.${lang}`;
}

function docUrl(ver: string, filename: string): string {
    let url = `http://httpd.apache.org/docs/${ver}/`;
    url += langfile(filename).replace(/^(.+)\.xml$/g, "$1.html");
    return url;
}

function viewvcUrl(ver: string, base: string, lang?: string): string {
    let url = "http://svn.apache.org/viewvc/httpd/httpd/";
    url += ver === "trunk" ? "trunk" : `branches/${ver}.x`;
    url += `/docs/manual/${langfile(base, lang)}`;
    return url;
}

function viewvcDiffUrl(ver: string, base: string, rev: number, trrev: number, format?: string): string {
    let url = `${viewvcUrl(ver, base)}?r1=${trrev}&r2=${rev}`;
    if (format !== undefined) {
        url += `&diff_format=${format}`;
    }
    return url;
}

const TableBody: React.FC<{ files: File[]; langs: string[]; ver: string }> = props => (
    <>
        {props.files.map(file => (
            <FileRow key={file.name} file={file} {...props} />
        ))}
    </>
);

const FileRow: React.FC<{ file: File; langs: string[]; ver: string }> = props => (
    <tr>
        <FileCell {...props} />
        <EnglishCell {...props} />
        {props.langs.map(it => (
            <TranslationCell key={`${props.file.name}_${it}`} lang={it} {...props} />
        ))}
    </tr>
);

const FileCell: React.FC<{ file: File; ver: string }> = ({ file, ver }) => (
    <td className="filename">
        <a href={docUrl(ver, file.name)}>{file.name}</a>
    </td>
);

const EnglishCell: React.FC<{ file: File; ver: string }> = ({ file, ver }) => (
    <td>
        <a href={viewvcUrl(ver, file.name)}>{file.en.toLocaleString()}</a>
    </td>
);

const TranslationCell: React.FC<{ file: File; lang: string; ver: string }> = ({ file, lang, ver }) => {
    const rev = file.translations[lang];
    const viewvc = viewvcUrl(ver, file.name, lang);

    if (rev === null || rev === undefined) {
        return <td />;
    }

    if (rev === "error") {
        return (
            <td className="error">
                <a href={viewvc}>{rev}</a>
            </td>
        );
    }

    if (rev < file.en) {
        return (
            <td className="outdated">
                <a href={viewvc}>{rev.toLocaleString()}</a>
                {NBSP}
                {NBSP}
                <a href={viewvcDiffUrl(ver, file.name, file.en, rev, "l")}>diff</a>
            </td>
        );
    }

    return (
        <td className="uptodate">
            <a href={viewvc}>{rev.toLocaleString()}</a>
        </td>
    );
};

const TableHead: React.FC<{ langs: string[] }> = ({ langs }) => (
    <tr>
        <th />
        <th>en</th>
        {langs.map(it => (
            <th>{it}</th>
        ))}
    </tr>
);

export const TranslationTable: React.FC<{ obj: Data; ver: string }> = ({ obj, ver }) => (
    <table className="translations">
        <thead>
            <TableHead langs={obj.langs} />
        </thead>
        <tbody>
            <TableBody ver={ver} langs={obj.langs} files={obj.files} />
        </tbody>
        <tfoot>
            <TableHead langs={obj.langs} />
        </tfoot>
    </table>
);
