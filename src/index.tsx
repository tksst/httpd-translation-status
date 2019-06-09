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
import "core-js/es/promise";
import "whatwg-fetch";

import "normalize.css";
import "react-tabs/style/react-tabs.css";
import "./style.scss";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// UTF-8
const NBSP = "\u00A0";

function langfile(base: string, lang: string = "en") {
    if (base === "style/lang/") {
        return `${base}${lang}.xml`;
    }
    if (lang === "en") {
        return base;
    }
    return `${base}.${lang}`;
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
                            <a href={viewvcUrl(ver, filename, lang)}>{translationRev.toLocaleString()}</a>
                            {NBSP}
                            {NBSP}
                            <a href={viewvcDiffUrl(ver, filename, englishRev, translationRev, "l")}>diff</a>
                        </td>
                    );
                }
                return (
                    <td className="uptodate">
                        <a href={viewvcUrl(ver, filename, lang)}>{translationRev.toLocaleString()}</a>
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
                    <a href={viewvcUrl(ver, filename)}>{englishRev.toLocaleString()}</a>
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

const fetchTranslationsData = async (ver: string) => {
    const response = await fetch(`${ver}.json`);
    if (!response.ok) {
        throw response.status;
    }
    return response.json();
};

class VersionPane extends React.Component<
    { ver: "trunk" | "2.4" | "2.2" | "2.0" },
    { status: "success" | "loading" | "error"; obj?: any; error?: string }
> {
    public constructor(props) {
        super(props);
        this.state = { status: "loading" };
    }

    public async componentDidMount() {
        try {
            this.setState({
                status: "success",
                obj: await fetchTranslationsData(this.props.ver),
            });
        } catch (error) {
            this.setState({
                status: "error",
                error: typeof error === "number" ? `HTTP ${error} Error` : error.toString(),
            });
        }
    }

    public render() {
        switch (this.state.status) {
            case "loading":
                return <div className="infomsg">loading...</div>;
            case "success":
                return <TranslationTable obj={this.state.obj} ver={this.props.ver} />;
            case "error":
                // TODO: リロードボタン
                return <div className="errormsg">{this.state.error}</div>;
            default:
                return <div className="errormsg">System Error. Something went wrong.</div>;
        }
    }
}

const TabArea: React.FC = () => (
    <Tabs forceRenderTabPanel>
        <TabList>
            <Tab>trunk</Tab>
            <Tab>2.4</Tab>
            <Tab>2.2</Tab>
            <Tab>2.0</Tab>
        </TabList>
        <TabPanel>
            <VersionPane ver="trunk" />
        </TabPanel>
        <TabPanel>
            <VersionPane ver="2.4" />
        </TabPanel>
        <TabPanel>
            <VersionPane ver="2.2" />
        </TabPanel>
        <TabPanel>
            <VersionPane ver="2.0" />
        </TabPanel>
    </Tabs>
);

const TranslationTable: React.FC<{ obj: any; ver: string }> = ({ obj, ver }) => (
    <table className="translations">
        <thead>
            <TableHead langs={obj.langs} />
        </thead>
        <tbody>
            <TableBody ver={ver} resutlObj={obj} />
        </tbody>
        <tfoot>
            <TableHead langs={obj.langs} />
        </tfoot>
    </table>
);

ReactDOM.render(
    <React.StrictMode>
        <TabArea />
    </React.StrictMode>,
    document.getElementsByTagName("main")[0]
);
