sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, History, MessageToast, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("ehsm.controller.Incidents", {
            onInit: function () {
                console.log("Incidents Controller Initialized");
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteIncidents").attachMatched(this._onRouteMatched, this);

                // Initialize JSON Model for table display to bypass OData deduplication
                this.getView().setModel(new JSONModel({ results: [] }), "incidentModel");
            },

            _onRouteMatched: function () {
                var oModel = this.getOwnerComponent().getModel();
                var oIncidentModel = this.getView().getModel("incidentModel");

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

                // Explicitly read to bypass OData model's deduplication issue
                oModel.read("/incidentSet", {
                    filters: [oFilter],
                    urlParameters: {
                        "sap-cache-id": Date.now().toString()
                    },
                    success: function (oData) {
                        var aResults = oData.results || [];
                        oIncidentModel.setData({ results: aResults });

                        MessageToast.show("Found " + aResults.length + " incidents");
                        console.log("Incidents fetched:", aResults.map(r => r.IncidentId));
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
