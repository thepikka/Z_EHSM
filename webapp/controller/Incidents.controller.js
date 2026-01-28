sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    function (Controller, History) {
        "use strict";

        return Controller.extend("ehsm.controller.Incidents", {
            onInit: function () {
                // Check for user ID from login if filtering is needed. 
                // Currently binding directly to /incidentSet as per standard view
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
