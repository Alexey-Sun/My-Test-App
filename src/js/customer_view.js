/* 
 * Customer View
 * Responsible for UI changes
 */
function CustomerView() {
    /*
     * Default View Config
     * Maps UI elements to HTML id`s
     */
    this.config = {
        /* Map controls to button css classes */
        buttons: {
            add:    "btn-add",
            list:   "btn-list",
            about:  "btn-about",
            remove: "btn-remove",        
            clear:  "btn-clear",
            submit: "btn-submit",
            save:   "btn-save",
            update: "btn-update",
            cancel: "btn-cancel"
        },
        /* Map divs to HTML id`s */
        divs: {
            menu: {
                default: "menu-default",
                icons:   "menu-icons"
            },
            content: {
                form:    "form",
                create:  "create-button-group",
                update:  "update-button-group",
                table:   "table",
                about:   "about",
                confirm: "confirm"
            }
        },
        /* Map attributes to form input id`s */
        input: {
            name:   "user-name",
            email:  "user-email",            
            phone:  "user-phone",
            street: "user-street",
            city:   "user-city",
            state:  "user-state",
            zip :   "user-zip",
        },
        /* Map extra attributes to HTML id`s */
        util: {
            key: "email-original"
        },
        /* Maps divs to html files */
        map: {
            menu: {
                id:   "menu",
                html: "html/menu.html"
            },
            content: {
                id:   "content",
                html: [
                    "html/form.html",
                    "html/table.html",
                    "html/about.html",
                    "html/confirm.html"                    
                ]              
            }
        },
        html: {
            menu:    "html/menu.html", 
            form:    "html/form.html",
            table:   "html/table.html",
            about:   "html/about.html",
            confirm: "html/confirm.html"
        },
        /*
         * Order of table fields in UI
         */
        fields: [
            "name", "email", "phone", "address.street",
            "address.city", "address.state", "address.zip"
        ]
    };
    
    this.control = new CustomerControl();
}

/*
 * Replace default config with custom
 * @param {object} config
 */
CustomerView.prototype.configure = function(config) {
    this.config = config;  
};

/*
 * Load required HTML files in provided div
 * Loaded HTML elements are hidden by default
 */
CustomerView.prototype.init = function() {
    var f = this.setEventHandlers.bind(this);
    var deffereds = [];
    var map = this.config.map;    
    
    /* Load menu */
    deffereds.push(
        $.get(map.menu.html, "", function(data) {
            $("#" + map.menu.id).append(data);
        })
    );
    
    /* Load content */
    for(var i = 0; i < map.content.html.length; i++) {
        deffereds.push(
            $.get(map.content.html[i], "", function(data) {
                $("#" + map.content.id).append(data);
            })
        );
    }
    
    $.when.apply($, deffereds).done(function(){
        f();
    });
};

/*
 * Set event handlers for control elements
 */
CustomerView.prototype.setEventHandlers = function() {
    /* Add Button */
    var a = this.showDiv.bind(this, this.config.divs.content.form);
    var config = this.config;
    $("." + this.config.buttons.add).each(function(index, data) {
        $(data).on("click", function() {
            /* Reset CSS and form */
            for(var i in config.input) {                
                $("#" + config.input[i]).removeClass("input-invalid");                                                   
            }
            
            a();  
            $("#" + config.divs.content.create).removeClass("div-hidden");
            $("#" + config.divs.content.update).addClass("div-hidden");
            document.getElementById(config.divs.content.form)
                    .getElementsByTagName("form")[0].reset();
        });
        
    });
    
    /* Clear CSS on input fields when user selects them */
    for(var j in config.input) {
        $("#" + config.input[j]).on("focus", function() { 
            $(this).removeClass("input-invalid");                                    
        }); 
    }
    
    /* List Button */
    var b = this.drawTable.bind(this);
    $("." + this.config.buttons.list).each(function(index, data) {
        $(data).on("click", function() {
            b();            
        });
    });
    
    /* Cancel Button */
    $("." + this.config.buttons.cancel).each(function(index, data) {
        $(data).on("click", function() {
            b();
        });         
    });

    /* About Button */
    var c = this.showDiv.bind(this, this.config.divs.content.about);
    $("." + this.config.buttons.about).each(function(index, data) {
        $(data).on("click", function() {
            c();            
        });
    });
    
    /* Update Button */
    var d = this.addItem.bind(this, true);
    document.getElementById(this.config.buttons.update).addEventListener("click", function() {
        for(var i in config.input) {                
            $("#" + config.input[i]).removeClass("input-invalid");                                                   
        }
        d(config.input.email);        
    });
    
    /* Submit Button */
    var e = this.addItem.bind(this, false);
    document.getElementById(this.config.buttons.submit).addEventListener("click", function() {
        e();
    }); 
    
    /* Clear All Button */
    $("." + this.config.buttons.clear).each(function(index, data) {
        $(data).on("click", function() {
            var answer = confirm("Clear All Data?!");
            if(answer === true) {
                localStorage.clear();
            }            
        });
    });    
    
    /* Remove button */
    var g = this.deleteItem.bind(this);
    $("." + this.config.buttons.remove).on("click", function() {
        var result = confirm("Delete record?");   
        if(result === true) {
            g();                        
        }
    });
};

/* 
 * Put customer records in table 
 */
CustomerView.prototype.drawTable = function() {
    this.showDiv(this.config.divs.content.table);  
    
    var tableBody = document.getElementById(this.config.divs.content.table).getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    
    var items = this.control.getAllItems();     
    
    for(var i = 0; i < items.length; i++) {
        var tableEntry = document.createElement("tr");        
        
        /* Add row number */
        var index = document.createElement("td");
        index.innerHTML = i + 1;
        tableEntry.appendChild(index);
        
        /* Add data to table cells according to field order */
        for(var j = 0; j < this.config.fields.length; j++) {
            var tableCell = document.createElement("td");
            tableCell.innerHTML =  items[i].getValueByString(this.config.fields[j]);
            
            if(this.config.fields[j].search("address") !== -1) {
                $(tableCell).addClass("cell-hidden");
            }
            
            tableEntry.appendChild(tableCell);
        }
        
        /* Add event listener */
        var updateItem = this.updateItem.bind(this);    
        var c = this.config.fields.indexOf("email");        
        
        tableEntry.addEventListener("click", function() {   
            /* This points to table row! 
             * Add +1 to account for first index column */
            updateItem(this.getElementsByTagName("td")[c + 1].innerHTML);            
        });
        
        tableBody.appendChild(tableEntry);
    }  
};

/*
 * Validate input fields
 * @returns {Array|NodeList} - array of invalid inputs
 */
CustomerView.prototype.validate = function() {
    var invalidFields = [];
    invalidFields = document.querySelectorAll("input:invalid");
    return invalidFields;
};

/* 
 * Create new item from input form 
 * @param {boolean} update - create or update record
 * If update is true, rewrite record
 */
CustomerView.prototype.addItem = function(update) {
    /* Array of invalid input fields */
    var fields = this.validate();
    
    if(fields.length === 0) {
        var address = new Address(
            document.getElementById(this.config.input.street).value,
            document.getElementById(this.config.input.city).value,
            document.getElementById(this.config.input.state).value,
            document.getElementById(this.config.input.zip).value
        );
    
        var customer = new Customer(
                document.getElementById(this.config.input.name).value,
                document.getElementById(this.config.input.email).value,
                document.getElementById(this.config.input.phone).value,
                address
        );  
    
        console.log(customer);    

        if(update !== true && this.control.getItem(customer.email) !== null) {
            alert("Item already exists!");
            return;
        } else {
            if(update === true) {
                var key = document.getElementById(this.config.util.key).value;
                console.log(key);
                this.control.updateItem(key, customer);  
            } else {
                this.control.saveItem(customer);                  
            }
        } 
        
        this.hideContent();
        this.drawTable();
    } else {
        for(var i = 0; i < fields.length; i++) {
            $(fields[i]).addClass("input-invalid");        
        }     
    }
};

/*
 * Remove record based on primary key
 */
CustomerView.prototype.deleteItem = function() {
    var key = document.getElementById(this.config.util.key).value;
    this.control.removeItem(key);
    this.drawTable();
};

/*
 * Hide all divs in content
 */
CustomerView.prototype.hideContent = function() {
    for(var div in this.config.divs.content) {
        $("#" + this.config.divs.content[div]).addClass("div-hidden");
    }    
};

/*
 * Show selected div and hide others
 */
CustomerView.prototype.showDiv = function(div) {
    this.hideContent();
    $("#" + div).removeClass("div-hidden");
};

/*
 * Update item
 * @param {string} key - Customer`s email
 */
CustomerView.prototype.updateItem = function(key) {    
    /* Activate different buttons for update form */
    this.showDiv(this.config.divs.content.form);
    $("#" + this.config.divs.content.create).addClass("div-hidden");
    $("#" + this.config.divs.content.update).removeClass("div-hidden");
    
    var config = this.config;
    for(var i in config.input) {                
        $("#" + config.input[i]).removeClass("input-invalid");                                                   
    }

    /* Fill input fields */
    var item = Customer.prototype.fromJSON(this.control.getItem(key));
    var j = 0;
    for(var i in this.config.input) {
        document.getElementById(this.config.input[i]).value 
                = item.getValueByString(this.config.fields[j++]);        
    }
    
    /* Reset and add hidden field with original email value */
    var hidden;
    hidden = document.getElementById(this.config.util.key);
    if(hidden !== null) {
        hidden.remove();
    }            
    hidden = document.createElement("input");
    hidden.id = this.config.util.key;
    hidden.type = "hidden";
    hidden.value = item.email;
    document.getElementById(this.config.divs.content.form).appendChild(hidden);
};