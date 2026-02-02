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
            var oView = this.getView();
            var oUsername = oView.byId("usernameInput").getValue();
            var oPassword = oView.byId("passwordInput").getValue();
            var oModel = this.getOwnerComponent().getModel();

            if (oUsername && oPassword) {
                // Strip ALL whitespace characters
                var sEmployeeId = oUsername.replace(/\s/g, "").padStart(8, '0');

                oView.setBusy(true);

                // Filter by both ID and Password for real validation
                var aFilters = [
                    new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, sEmployeeId),
                    new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, oPassword)
                ];

                oModel.read("/loginSet", {
                    filters: aFilters,
                    success: function (oData) {
                        oView.setBusy(false);
                        if (oData.results && oData.results.length > 0) {
                            console.log("Login Successful for: " + sEmployeeId);
                            localStorage.setItem("EmployeeId", sEmployeeId);

                            var oRouter = UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteDashboard");
                            MessageToast.show("Login Successful");
                        } else {
                            MessageToast.show("Invalid Employee ID or Password");
                        }
                    }.bind(this),
                    error: function (oError) {
                        oView.setBusy(false);
                        console.error("Login Check Failed:", oError);
                        MessageToast.show("Backend Authentication Error");
                    }
                });
            } else {
                MessageToast.show("Please enter username and password");
            }
        }
    });
});
