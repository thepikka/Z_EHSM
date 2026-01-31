sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, History, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Profile", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteProfile").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var sEmployeeId = localStorage.getItem("EmployeeId") || "N/A";
            this.getView().byId("employeeIdText").setText(sEmployeeId);
        },

        onLogout: function () {
            localStorage.removeItem("EmployeeId");
            MessageToast.show("Logged out successfully");
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin", {}, true);
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDashboard", {}, true);
            }
        }
    });
});
