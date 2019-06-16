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
import * as ReactDOM from "react-dom";
import "core-js/es/promise";
import "whatwg-fetch";

import "normalize.css";
import "react-tabs/style/react-tabs.css";
import "./style.scss";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import TranslationTable from "./translationtable";

type Version = "trunk" | "2.4" | "2.2" | "2.0";

const fetchTranslationsData = async (ver: string) => {
    const response = await fetch(`${ver}.json`);
    if (!response.ok) {
        throw response.status;
    }
    return response.json();
};

class VersionPane extends React.Component<
    { ver: Version },
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

const versions: readonly Version[] = ["trunk", "2.4", "2.2", "2.0"];
const getVersionIndex = () => {
    // ignores leading "#"
    const hash = window.location.hash.substring(1);
    const i = versions.indexOf(hash as any);
    return i >= 0 ? i : 0;
};
const setHash = i => {
    window.location.hash = versions[i];
};

const TabArea: React.FC = () => (
    <Tabs onSelect={setHash} defaultIndex={getVersionIndex()} forceRenderTabPanel>
        <TabList>
            {versions.map(it => (
                <Tab>{it}</Tab>
            ))}
        </TabList>
        {versions.map(it => (
            <TabPanel>
                <VersionPane ver={it} />
            </TabPanel>
        ))}
    </Tabs>
);

ReactDOM.render(
    <React.StrictMode>
        <TabArea />
    </React.StrictMode>,
    document.getElementsByTagName("main")[0]
);
