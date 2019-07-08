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
import { ContextMenuTrigger } from "react-contextmenu";

import styles from "./LeftClickContextMenuTrigger.modules.scss";

// stolen from react-contextmenu
interface ContextMenuTriggerProps {
    id: string;
    attributes?: React.HTMLAttributes<any>;
    collect?: { (data: any): any };
    disable?: boolean;
    holdToDisplay?: number;
    renderTag?: React.ReactType;
}

export const LeftClickContextMenuTrigger: React.FC<ContextMenuTriggerProps> = props => {
    // ContextMenuTrigger does provide handleContextClick,
    // but the type file does not provide it, so marked as any.
    let ct: any = null;

    // for left click
    // some conflict occurs between typescript and react, so marked as any.
    const toggleMenu = (e: any) => {
        if (ct) {
            ct.handleContextClick(e);
        }
    };

    return (
        <ContextMenuTrigger
            {...props}
            ref={(c: any) => {
                ct = c;
            }}
        >
            <button type="button" onClick={toggleMenu} className={styles.outdatedMenu}>
                {props.children}
            </button>
        </ContextMenuTrigger>
    );
};
