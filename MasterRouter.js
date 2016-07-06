// A simple Routing plugin for the MasterControl JAVSCRIPT framework by Alexander Think - MIT Licensed
// version 1.5 currently on works with HTML 5 browsers using history.js plugin
//https://github.com/browserstate/history.js/

// TODO: Check to see if user has declaired same controller name and same action name using html so that there is no double call
(function(window, undefined) {

    var Router = function(app, ishash) {

        this.APPmodule = null;
        this.$$routingList = [];
        // check to see if master control is installed
        this.init = function() {

            APPmodule = document.querySelector("[fan-routing-view]");

            if (ishash === null) {
                ishash = false;
            }

            if (APPmodule !== null) {

                if (ishash === true) {
                    var controller = getController(window.location.hash.split("/"));
                    var action = getAction(window.location.hash.split("/"));
                    // if controller is empty then try running non hash check
                    if (controller === '' || controller === undefined) {
                        var nonHashController = getController(window.location.pathname.split("/"));
                        var nonHashAction = getAction(window.location.pathname.split("/"));
                        digest(nonHashController, nonHashAction);

                    } else {
                        digest(controller, action);
                    }

                    // this starts listening to url hash changes
                    window.onhashchange = function() {
                        var controller = getController(window.location.hash.split("/"));
                        var action = getAction(window.location.hash.split("/"));
                        digest(controller, action);
                    };

                } else {
                    var controller = getController(window.location.pathname.split("/"));
                    var action = getAction(window.location.pathname.split("/"));
                    digest(controller, action);
                }

            }
        };

        this.getController = function(urlArray) {
            return urlArray[1];
        };

        this.getAction = function(urlArray) {
            return urlArray[2];
        };

        this.digest = function(controller, action) {

            if (action === '' || action === undefined) {
                action = "index";
            }


            if ($$routingList.length > -1) {

                var calledController = false;
                var calledAction = false;

                for (var r = 0; $$routingList.length > r; r++) {

                    // reset the url if slash or empty same thing
                    if ($$routingList[r].controllerURL === "/") {
                        $$routingList[r].controllerURL = "";
                    }

                    if ($$routingList[r].actionURL === "") {
                        $$routingList[r].actionURL = "index";
                    }

                    if ($$routingList[r].controllerURL === controller) {
                        calledController = true;
                        // CALL MASTERCONTROLLER CONTROLLER WITH SAME NAME
                        var error404MSG = app.callController($$routingList[r].controller, APPmodule);
                        // should return null
                        if (error404MSG !== null) {
                            // then call 404Error controller in master controller
                            var errorMSG = app.callController("error404", APPmodule);
                            if (errorMSG !== null) {
                                var errorMessage = "Error cannot find controller with name error404. please make an error controller to continue";
                                throw new Error(errorMessage);
                            }
                        } else {

                            if ($$routingList[r].actionURL === action) {
                                app.callAction($$routingList[r].action, $$routingList[r].controller, APPmodule);
                                calledAction = true;
                            }
                        }
                    } else {


                    }

                }

                if (calledController === false) {
                    // CALL MASTERCONTROLLER CONTROLLER WITH SAME NAME
                    if (!controller) {
                        var errorMessage = "Error controller is blank or couldn't find route with empty name";
                        throw new Error(errorMessage);
                    } else {

                        var error404MSG = app.callController(controller, APPmodule);
                        // should return null if ok
                        if (error404MSG !== null) {
                            // then call 404Error controller in master controller
                            var errorMSG = app.callController("error404", APPmodule);
                            if (errorMSG !== null) {
                                throw new Error("Error cannot find controller with name error404. please make one to continue");
                            }

                        } else {
                            if (calledAction === false) {
                                app.callAction(action, controller, APPmodule);
                            }
                        }
                    }
                }

            } else {
                if (!controller) {
                    var errorMessage = "Error controller is blank or couldn't find route with empty name";
                    throw new Error(errorMessage);
                } else {
                    // CALL MASTERCONTROLLER CONTROLLER WITH SAME NAME
                    var error404MSG = app.callController(controller, APPmodule);
                    // should return null if ok
                    if (error404MSG !== null) {
                        // then call 404Error controller in master controller
                        var errorMSG = app.callController("error404", APPmodule);
                        if (errorMSG !== null) {
                            var errorMessage = "Error cannot find controller with name error404. please make one to continue";
                            throw new Error(errorMessage);
                        }
                    } else {
                        app.callAction(action, controller, APPmodule);
                    }
                }
            }
        };


        return {
            routeTo: function(controllerURL, actionURL, controller, action) {

                var routing = {
                    controllerURL: controllerURL,
                    actionURL: actionURL,
                    controller: controller,
                    action: action
                };

                $$routingList.push(routing);
                return this;

            },

            start: function() {
                if (typeof app == "object") {
                    init();
                } else {
                    throw new Error("Master Control plugin needs to be installed first");

                }
                return this;
            }

        };

    };

    window.MasterRouter = Router;
})(window);


/********************************************************************************************************************************/
/******************************************* GETTING STARTED ROUTING YOUR APPLICATION *******************************************/
/********************************************************************************************************************************/

/*
    We add fan-routing-view to the app declaration then on page load we read the url and parse out controller and action
    we then call those functions controller and action using Master controller plugin
*/

// setup server to foward all incoming calls to your index.html page so that routing can be handled by master router

// declare master router inside master controller module
// EXAMPLE:
/*

var app = MasterControl();

app.module("myapp", function(scope){

    // delaire your MasterRouter and setup routes and then start the routing
    MasterRouter(app).routeTo("/", "", "home", "index").start();

}
*/

// declare master router in HTML page

// add fan-routing-view to div you want to be the master container
// example 
/*
<body class="" fan-app="myapp" fan-routing-view>
</body>

*/

/*
    IF NO CONTOLLER IS FOUND: error404:
    if Master Router cannot find a controller with the URL name then it will defualt to calling "error404" controler name so you must declare a error404 contoller using MasterController plugin


*/


/* 

TO CONCLUDE:
 So when you visit a URL master controller will pick that url up and call the contoller and action associated with that name
FOR EXAMPLE: 
    URL: WWW.myapp.com/login

Master Router will call the controller with name login and since  there is no action name it will use index as the default action name by calling index action

*/
