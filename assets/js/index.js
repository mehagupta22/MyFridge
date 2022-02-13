//Need the following globals for when form resets
var expiration_date;
var food_item;
var amount;

// Global variable to hold all items in the fridge.
var allFridgeItems = [
    {foodItem:"butter", foodAmount: "1", foodExpDate: "02/17/2022"},
    {foodItem:"milk", foodAmount: "2", foodExpDate: "02/20/2022"},
    {foodItem:"eggs", foodAmount: "12", foodExpDate: "02/25/2022"}, 
    {foodItem:"apples", foodAmount: "2", foodExpDate: "02/20/2022"},
    {foodItem:"pickles", foodAmount: "1", foodExpDate: "12/01/2022"},
    {foodItem:"ham", foodAmount: "2", foodExpDate: "02/20/2022"},
    {foodItem:"milk", foodAmount: "2", foodExpDate: "02/20/2022"}];

//EXPIRATION FUNCTIONS

function addExpirationInput() {

    var has_exp = document.getElementById("has-exp").value;

    if (has_exp=="Yes") {
        var node = "<div class='col-6 col-12-xsmall' flex='50'>\
                        <input type='text' name='demo-email' id='food-exp-date' value='' placeholder='Expiration Date mm/dd/yyyy' style='margin-top: 1%;'/>\
                    <div/>";                          
        document.getElementById ("food-form").insertAdjacentHTML('beforeEnd', node);
    }
    else{
        var node = "<div class='col-12' id='food-exp-date'>\
                        <select name='food-type' id='food-type' style='margin-top: 1%;'>\
                        <option value=''>Select Food Type</option>\
                        <option value='Fresh meat'>Fresh meat - steak, beef flank</option>\
                        <option value='Fresh poultry'>Fresh poultry - chicken breast, turkey breast</option>\
                        <option value='Fresh fish'>Fresh fish - salmon, tuna</option>\
                        <option value='Deli meats'>Deli meats - ham</option>\
                        <option value='Eggs'>Eggs</option>\
                        <option value='Berries'>Berries - raspberries, blueberries</option>\
                        <option value='Stem'>Edible plant stem – celery, asparagus</option>\
                        <option value='Marrow'>Marrow – cucumber, zucchini</option>\
                        <option value='Allium'>Allium - garlic, onion</option>\
                        <option value='Leafy'>Leafy Greens - lettuce, spinach</option>\
                        <option value='Cruciferous'>Cruciferous - broccoli, cabbage</option>\
                    </select>\
                </div>";                        
        document.getElementById ("food-form").insertAdjacentHTML('beforeEnd', node);
    }
    var old_submit = document.getElementById("set-input");
    old_submit.remove();
}

function addExpiration() {

    food_item = document.getElementById("food-item").value;//update food item global variable
    amount = document.getElementById("food-amt").value;//update amount global

    var expires_in = 0;
    var has_exp = document.getElementById("has-exp").value;

    if (has_exp=="No"){
        var type = document.getElementById("food-type").value;
        if (type=="Fresh poultry"||type=="Fresh fish"){
            expires_in = 2;
        }
        if (type=="Stem"){
            expires_in = 4;
        }
        if (type=="Marrow"||type=="Leafy"||type=="Cruciferous"||type=="Fresh meat"){
            expires_in = 5;
        }
        if (type=="Berries"){
            expires_in = 14;
        }
        if (type=="Allium"){
            expires_in = 30;
        }
        
        if (type=="Eggs"){
            expires_in = 35;
        }
        sendAlert("No",expires_in);
    }
    else{
        sendAlert("Yes",0);
    }		
    //Need to reset form and re-add submit button
    clearForm();
}

function sendAlert(has_exp,expires_in){
    var input = food_item.toLowerCase();
    var today= new Date();
    var expiration_datetime;
    //For calculated expiry date
    if(has_exp=="No"){
        expiration_datetime = new Date();
        expiration_datetime.setDate(today.getDate()+expires_in);
        var dd = String(expiration_datetime.getDate()).padStart(2, '0');
        var mm = String(expiration_datetime.getMonth() + 1).padStart(2, '0'); 
        var yyyy = expiration_datetime.getFullYear();
        expiration_date = mm + '/' + dd + '/' + yyyy;
    }
    //For user given expiry date
    else{
        expiration_date = document.getElementById("food-exp-date").value;
        var today= new Date();
        expiration_datetime = new Date(expiration_date.slice(6,10),expiration_date.slice(0,2),expiration_date.slice(3,5));
    }
    alert("Hey there! That " + input + " expires on " + expiration_date + ".");
    if (Math.abs(expiration_datetime - today)<=2431245248){
        alert("Watch out! That " + input + " expires tomorrow!");
    }
}

function clearForm(){
    var form = document.getElementById ("food-info");
    var old_input = document.getElementById("food-exp-date");
    var new_submit = "<input style='margin-top: 1%;' type='submit' onclick='addExpirationInput();' id='set-input' />";
    document.getElementById ("dropdown").insertAdjacentHTML('beforeEnd', new_submit);
    form.reset();
    old_input.remove();	
}

//FRIDGE FUNCTIONS

populateTable();

//Function to populate fridge table.
function populateTable() {
    const tbody = document.querySelector('tbody');

    //Clear out previous table entries.
    document.querySelectorAll("table tbody tr").forEach(function(e){e.remove()})

    //Order table entries so that earliest expiration date is on top.
    allFridgeItems.sort((a,b) => (a.foodExpDate > b.foodExpDate) ? 1 : (b.foodExpDate > a.foodExpDate) ? -1 : 0);

    allFridgeItems.forEach(item => {
        const tr = tbody.insertRow();
        tr.insertCell().innerText = item.foodItem;
        tr.insertCell().innerText = item.foodExpDate;
        tr.insertCell().innerText = item.foodAmount;
    })
}

//Function to save inputted food items.
function saveFoodItem() {
    var foodObj = { 
        foodItem: food_item, 
        foodAmount: amount, 
        foodExpDate: expiration_date
    };

    //Add new object to allFridgeItems.
    allFridgeItems.push(foodObj);

    //Add new object to fridge table.
    populateTable();
}

//Function to delete food item.
function deleteFoodItem() {
    var foodItemToDelete = food_item;
    var amountToDelete = amount;
    for (var i = 0; i < allFridgeItems.length; i++) {
        if (allFridgeItems[i].foodItem === foodItemToDelete) {
            //Case 1: deleting amount is less than remaining.
            if (allFridgeItems[i].foodAmount > amountToDelete) {
                allFridgeItems[i].foodAmount = allFridgeItems[i].foodAmount - amountToDelete;
                populateTable();
            }
            //Case 2: deleting all remaining amount.
            else {
                allFridgeItems.splice(i, 1);
                populateTable();
            }
        }
    }
}