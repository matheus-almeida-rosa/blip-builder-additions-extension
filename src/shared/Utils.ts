export default class Utils {
    public static interceptFunction = (path: string, func: string, action: () => void) => {
        window.addEventListener("message", (ev: MessageEvent) => {
            if (ev.data && ev.data.type === "intercept-function-result" && ev.data.id === path + func) {
                action();
            }
        });

        window.postMessage({
            function: func,
            route: path,
            type: "intercept-function",
        }, "*");
    }

    public static injectPageScript = async (file: string) => {
        const brow = chrome || browser;
        const src = brow.extension.getURL(file);

        const element = document.createElement("script");
        element.src = src;

        document.head.appendChild(element);

        return new Promise((resolve) => {
            element.addEventListener("load", () => {
                resolve();
            });
        });
    }

    public static getRandomId() {
        return Math.random().toString(36).substr(2, 9);
    }

    public static async getBuilderControllerVariable(path: string): Promise<any> {
        if (!this.getBuilderControllerVariableInjected) {
            await Utils.injectPageScript("js/inject.js");
            this.getBuilderControllerVariableInjected = true;
        }

        return new Promise((resolve) => {
            const identifier = this.getRandomId();

            const listener = (ev: MessageEvent) => {
                if (ev.data && ev.data.type === "controller-variable-result" && ev.data.id === identifier) {
                    window.removeEventListener("message", listener);
                    return resolve(ev.data.value);
                }
            };

            window.addEventListener("message", listener);

            window.postMessage({
                id: identifier,
                route: path,
                type: "controller-variable",
            }, "*");
        });
    }

    private static getBuilderControllerVariableInjected: boolean = false;
}