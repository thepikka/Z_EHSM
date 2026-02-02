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

                // Use direct entity path because GET_ENTITYSET might not be implemented
                var sPath = oModel.createKey("/loginSet", {
                    EmployeeId: sEmployeeId,
                    Password: oPassword
                });

                oModel.read(sPath, {
                    success: function (oData) {
                        oView.setBusy(false);
                        if (oData) {
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
                        // If 404 or missing, it means invalid credentials in many SAP implementations
                        if (oError.statusCode === "404") {
                            MessageToast.show("Invalid Employee ID or Password");
                        } else if (oError.statusCode === "501") {
                            MessageToast.show("Backend Error: Login logic not implemented on SAP server");
                        } else {
                            MessageToast.show("Backend Authentication Error");
                        }
                    }
                });
            } else {
                MessageToast.show("Please enter username and password");
            }
        }
    });
});
