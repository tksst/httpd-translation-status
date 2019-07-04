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

import { Version } from "./version";

export interface File {
    name: string;
    en: number;
    translations: { [key: string]: number | "error" };
}

export interface Data {
    langs: string[];
    files: File[];
}

export const fetchTranslationsData = async (ver: Version): Promise<Data> => {
    const response = await fetch(`./${ver}.json`);
    if (!response.ok) {
        throw response.status;
    }
    return response.json();
};
