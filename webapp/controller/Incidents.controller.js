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
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteIncidents").attachMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function () {
                var oModel = this.getOwnerComponent().getModel();
                if (!oModel) {
                    console.error("OData Model not available");
                    return;
                }

                MessageToast.show("Refreshing Incidents Data...");

                // Get ID and auto-pad it to 8 digits
                var sRawId = (localStorage.getItem("EmployeeId") || "00000001").replace(/\s/g, "");
                var sEmployeeId = sRawId.padStart(8, '0');

                console.log("Filtering incidents for EmployeeId: [" + sEmployeeId + "]");
                var oFilter = new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId);

                // Update table binding to include filter
                var oTable = this.getView().byId("incidentsTable");
                if (oTable) {
                    var oBinding = oTable.getBinding("items");
                    if (oBinding) {
                        oBinding.filter([oFilter]);
                    } else {
                        console.warn("Table binding not found for incidentsTable");
                    }
                }

                // Explicitly read to verify result count
                oModel.read("/incidentSet", {
                    filters: [oFilter],
                    success: function (oData) {
                        var iCount = oData.results ? oData.results.length : 0;
                        MessageToast.show("Found " + iCount + " incidents for user " + sEmployeeId);
                        console.log("Incidents fetched (" + iCount + "):", oData);
                    },
                    error: function (oError) {
                        console.error("Read failed:", oError);
                        MessageToast.show("Backend error: " + (oError.statusText || "Bad Request"));
                    }
                });
            },

            onLogout: function () {
                localStorage.removeItem("EmployeeId");
                MessageToast.show("Logged out successfully");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteLogin", {}, true);
            },

            onProfilePress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteProfile");
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
