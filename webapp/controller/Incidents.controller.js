sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast"
],
    function (Controller, History, MessageToast) {
        "use strict";

        return Controller.extend("ehsm.controller.Incidents", {
            onInit: function () {
                alert("Incidents Controller: INITIALIZED");
                console.log("Incidents Controller Initialized");

                var oModel = this.getOwnerComponent().getModel();
                if (!oModel) {
                    MessageToast.show("Error: OData Model not found!");
                    return;
                }

                MessageToast.show("Fetching Incidents from Backend...");

                // Explicitly read to test connection
                oModel.read("/incidentSet", {
                    success: function (oData) {
                        MessageToast.show("Success! Fetched " + oData.results.length + " incidents.");
                        console.log("Incidents fetched:", oData);
                    },
                    error: function (oError) {
                        MessageToast.show("Failed to fetch data. Check Network tab.");
                        console.error("Read failed:", oError);
                        try {
                            var sError = JSON.parse(oError.responseText).error.message.value;
                            MessageToast.show("Error: " + sError);
                        } catch (e) {
                            // ignore parsing error
                        }
                    }
                });
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteDashboard", {}, true);
                }
            }
        });
    });
