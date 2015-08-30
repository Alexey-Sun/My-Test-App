/* 
 * Customer Entity
 * Email is used as a primary key
 */
function Customer(name, email, phone, address) {
    if(arguments.length !== 4) {
        this.name = "";
        this.email = "";
        this.phone = "";
        this.address = "";
    } else {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;        
    } 
};

/*
 * Address Entity
 */
function Address(street, city, state, zip) {
    if(arguments.length !== 4) {
        this.street = "";
        this.city = "";
        this.state = "";
        this.zip = "";                
    } else {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;        
    }
};

/*
 * Build customer object from json
 * @param {object} json
 */
Customer.prototype.fromJSON = function(json) {
    var address = new Address(
        json.address.street,
        json.address.city,
        json.address.state,
        json.address.zip
    );
    
    var customer = new Customer(
        json.name,
        json.email,
        json.phone,
        address
    );
    
    return customer;
};

/*
 * Get value of attribute including nested by single string
 * @param {string} str
 * @returns {string} attribute value
 */
Customer.prototype.getValueByString = function(str) {
    var s = str.split(".");
    var result = this;
    for(var i = 0; i < s.length; i++) {
        var v = s[i];
        result = result[v];
    }    
    return result;
};

