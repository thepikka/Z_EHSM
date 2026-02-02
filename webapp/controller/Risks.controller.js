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

        return Controller.extend("ehsm.controller.Risks", {
            onInit: function () {
                console.log("Risks Controller Initialized");
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteRisks").attachMatched(this._onRouteMatched, this);

                // Initialize local model to bypass OData deduplication
                this.getView().setModel(new JSONModel({ results: [] }), "riskModel");
            },

            _onRouteMatched: function () {
                var oModel = this.getOwnerComponent().getModel();
                var oRiskModel = this.getView().getModel("riskModel");

                if (!oModel) {
                    console.error("OData Model not available");
                    return;
                }

                MessageToast.show("Refreshing Risks Data...");

                // Get ID and auto-pad it to 8 digits (SAP standard Alpha format)
                var sRawId = (localStorage.getItem("EmployeeId") || "00000001").replace(/\s/g, "");
                var sEmployeeId = sRawId.padStart(8, '0');

                console.log("Filtering risks for EmployeeId: [" + sEmployeeId + "]");
                var oFilter = new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId);

                // Explicitly read data to bypass OData key uniqueing issue
                // Optimization: Use $select to limit fields and $top to limit records (prevents 504 timeouts)
                oModel.read("/RiskSet", {
                    filters: [oFilter],
                    urlParameters: {
                        "$top": 20,
                        "$select": "RiskId,RiskDescription,RiskCategory,RiskSeverity,MitigationMeasures,Likelihood"
                    },
                    success: function (oData) {
                        var aResults = oData.results || [];
                        oRiskModel.setData({ results: aResults });

                        MessageToast.show("Found " + aResults.length + " risks");
                        console.log("Risks fetched:", aResults);
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
