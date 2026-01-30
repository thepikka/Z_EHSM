sap.ui.define([
    "sap/ui/core/UIComponent",
    "ehsm/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("ehsm.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // Debug OData Model
            const oModel = this.getModel();
            if (!oModel) {
                alert("CRITICAL: OData Model is MISSING in Component!");
                console.error("Component.js: Default Model is UNDEFINED");
            } else {
                // alert("Component: OData Model Found"); // Commented out to reduce noise, but can enable if needed.
                console.log("Component.js: Default Model found");
                oModel.attachMetadataFailed((oEvent) => {
                    console.error("OData Metadata Failed:", oEvent.getParameters());
                });
                oModel.attachRequestFailed((oEvent) => {
                    console.error("OData Request Failed:", oEvent.getParameters());
                });
                oModel.attachRequestCompleted((oEvent) => {
                    console.log("OData Request Completed:", oEvent.getParameters());
                });
                console.log("OData Model Listeners Attached");
            }
        }
    });
});