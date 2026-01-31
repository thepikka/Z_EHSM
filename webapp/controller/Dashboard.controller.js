sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("ehsm.controller.Dashboard", {
            onInit: function () {
            },

            onIncidentTilePress: function () {
                console.log("Navigating to Incidents");
                MessageToast.show("Navigating to Incidents...");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteIncidents");
            },

            onRiskTilePress: function () {
                console.log("Navigating to Risks");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteRisks");
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
            }
        });
    });
