sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, History, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("ehsm.controller.Incidents", {
            onInit: function () {
                console.log("Incidents Controller Initialized");

                var oModel = this.getOwnerComponent().getModel();
                if (!oModel) {
                    MessageToast.show("Error: OData Model not found!");
                    console.error("OData Model not available");
                    return;
                }

                MessageToast.show("Fetching Incidents from Backend...");

                var sEmployeeId = (localStorage.getItem("EmployeeId") || "00000001").replace(/\s/g, "");
                console.log("Using EmployeeId for filter: [" + sEmployeeId + "]");
                var oFilter = new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId);

                // Update table binding to include filter
                var oTable = this.getView().byId("incidentsTable");
                if (oTable) {
                    var oBinding = oTable.getBinding("items");
                    if (oBinding) {
                        oBinding.filter([oFilter]);
                    }
                }

                // Explicitly read to test connection (with filter)
                oModel.read("/incidentSet", {
                    filters: [oFilter],
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
