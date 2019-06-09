export const eventPromise = async (element: EventTarget, event: string) => {
    return new Promise<void>(resolve => {
        const foo = () => {
            element.removeEventListener(event, foo);
            resolve();
        };

        element.addEventListener(event, foo);
    });
};

export const documentDomContentLoaded = async () => {
    const loaded = eventPromise(document, "DOMContentLoaded");

    if (document.readyState === "interactive" || document.readyState === "complete") {
        return Promise.resolve();
    }

    return loaded;
};
