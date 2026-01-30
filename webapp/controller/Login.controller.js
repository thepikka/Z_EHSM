sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
            console.log("Login Controller Loaded");
        },

        onLoginPress: function () {
            var oUsername = this.getView().byId("usernameInput").getValue();
            var oPassword = this.getView().byId("passwordInput").getValue();

            if (oUsername && oPassword) {
                // Navigate to Dashboard
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDashboard");
                MessageToast.show("Login Successful");
            } else {
                MessageToast.show("Please enter username and password");
            }
        }
    });
});
