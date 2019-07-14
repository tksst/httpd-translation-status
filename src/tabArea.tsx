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

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { TranslationTable } from "./translationtable";
import { Data, fetchTranslationsData } from "./statusData";
import { Version } from "./version";

interface SuccessStatus {
    status: "success";
    obj: Data;
}

interface LoadingStatus {
    status: "loading";
}

interface ErrorStatus {
    status: "error";
    error: string;
}

const VersionPane: React.FC<{ ver: Version }> = ({ ver }) => {
    const [state, setState] = React.useState<SuccessStatus | LoadingStatus | ErrorStatus>({ status: "loading" });

    const load = () => {
        setState({ status: "loading" });
        fetchTranslationsData(ver)
            .then(obj => {
                setState({
                    status: "success",
                    obj,
                });
            })
            .catch(error => {
                setState({
                    status: "error",
                    error: typeof error === "number" ? `HTTP ${error} Error` : error.toString(),
                });
            });
    };

    React.useEffect(load, []);

    switch (state.status) {
        case "loading":
            return <div className="infomsg">loading...</div>;
        case "success":
            return <TranslationTable obj={state.obj} ver={ver} />;
        case "error":
            return (
                <>
                    <div className="errormsg">{state.error}</div>
                    <button type="button" onClick={load}>
                        reload
                    </button>
                </>
            );
        default:
            return <div className="errormsg">System Error. Something went wrong.</div>;
    }
};

const versions: readonly Version[] = ["trunk", "2.4", "2.2", "2.0"];
const getVersionIndex = () => {
    // ignores leading "#"
    const hash = window.location.hash.substring(1);
    const i = versions.indexOf(hash as any);
    return i >= 0 ? i : 0;
};
const setHash = (i: number): void => {
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

export default TabArea;
