/* 
 * Application Class
 */
function Application() {
    
    /* View Objects */
    this.views = {
        customer: null
    };
    
    /* JS file list */
    this.js = [
        "js/customer.js",
        "js/customer_control.js",
        "js/customer_view.js"
    ];
};

/*
 * Load required js files and configure objects
 */
Application.prototype.init = function() {
    var f = this.configure.bind(this);
    this.load(f);
};

/*
 * Create view objects
 */
Application.prototype.configure = function() {
    this.views.customer = new CustomerView();
    this.views.customer.init();
};

/*
 * Load js files
 */
Application.prototype.load = function(callback) {
    var deffereds = [];
    for(var i = 0; i < this.js.length; i++) {
        deffereds.push(
            $.get(this.js[i], "", function(data) {
                $("head").append($("<script />", {html: data}));                
            })
        );
    }
    
    $.when.apply($, deffereds).done(function() {
        callback();        
    });
};

(function() {
    app = new Application;
    app.init();    
})();


