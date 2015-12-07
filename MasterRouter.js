
// A simple Routing plugin for the MasterControl JAVSCRIPT framework by Alexander Think - MIT Licensed - ThinkAcademy.io
// version 1

var MasterRouter = function (module) {

	var module = module;

	var init = function (module) {

        // select all controllers with name routing inside of the main app
        var routingController = module.querySelector("[fan-controller='routing']");

        if(routingController !== null){
            var routingAction = routingController.querySelector("[fan-action='routing']");

            // get url 
            var urlArray = window.location.pathname.split("/");
            var controller = urlArray[1];
            var action = urlArray[2];

            routingController.setAttribute("fan-controller", controller);

            if(action === ""){
            	routingAction.setAttribute("fan-action", "index");
        	}
        	else{
        		routingAction.setAttribute("fan-action", action);
        	}
        }
	};

	init(module);

}



/********************************************************************************************************************************/
/******************************************* GETTING STARTED ROUTING YOUR APPLICATION *******************************************/
/********************************************************************************************************************************/

// This will get replaced with the controller and action url names

// declare a routing Controller in HTML
// EXAMPLE:
// fan-controller='routing'

// declare a routing Action in HTML inside of controller
// EXAMPLE:
// fan-action='routing'

// FIX ROUTING ISSUES
// If there is no controller or action then the controller gets replaced with / and action is index
// If there is only a controller and no action then the controller gets called by it's name and the action is index

// QUESTION: What if there is a controller and then there's an ID but not an action? 
// ANSWER: If we declare our controller function name with - for examaple : "controllerName:id" 
// what that means is that if we can't find that action don't send error it just means that action is an id
