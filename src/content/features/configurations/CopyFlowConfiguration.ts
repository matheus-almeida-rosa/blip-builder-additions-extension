import Storager from "../../../shared/Storager";
import Utils from "../../../shared/Utils";
import { inject } from "../../Content";
import IConfiguration from "./Configuration";

export default class CopyFlowConfiguration implements IConfiguration {
    private botIdentifier = "";

    public onLoadConfiguration = (): void => {
        const url = window.location.href;
        const names = url.split("/");
        this.botIdentifier = names[names.length-4];
        document.getElementById("copy-flow-btn").addEventListener("click", this.handleCopyFlow);
    }

    private handleCopyFlow = () => {
        console.log(this.botIdentifier);
    }
}
