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
                alert("Dashboard: Navigating to Incidents...");
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

            onLogoutPress: function () {
                MessageToast.show("Logged Out");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteLogin");
            }
        });
    });
