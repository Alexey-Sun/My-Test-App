/*
 * Customer Controller
 * Responsible for saving, updating and removing data
 * Data is stored in browser local storage
 * @returns {CustomerControl}
 */
function CustomerControl() {
    this.items = []; 
}

/* 
 * Get all items from local storage and convert to objects 
 * @returns {Array|Customer}
 */
CustomerControl.prototype.getAllItems = function() {
    var items = [];
    var keys = Object.keys(localStorage);    
    
    for(var key in keys) {        
        var a = localStorage.getItem(keys[key]);        
        var b = JSON.parse(a);
        items.push(Customer.prototype.fromJSON(b));
    }
    
    return items;    
};

/* 
 * Remove item from local storage based on key 
 * @param {string} key
 */
CustomerControl.prototype.removeItem = function(key) {
    localStorage.removeItem(key);    
};

/* 
 * Update item in local storage 
 * @param {string} key - record key in local storage
 * @param {Customer} item - customer
 */
CustomerControl.prototype.updateItem = function(key, item) {
    this.removeItem(key);
    this.saveItem(item);
};

/* 
 * Save item in local storage, use email as primary key 
 * @param {Customer} item - customer
 */
CustomerControl.prototype.saveItem = function(item) {
    if(!(item instanceof Customer)) {
        throw "Item is not Customer";
    }
    
    if(this.getItem(item.email) !== null) {
        throw "Already exists!";
    }
    
    var str = JSON.stringify(item);
    localStorage.setItem(item.email.toString(), str);
};

/* 
 * Get customer record using email as key 
 * @param {string} key
 * @return {json} item
 */
CustomerControl.prototype.getItem = function(key) {
    var item = localStorage.getItem(key.toString());
    return JSON.parse(item);    
};