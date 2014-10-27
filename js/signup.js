/*Tiffany Tung, Signup, Info 343
	10/26/14*/
"use strict";

//main method, called when page loads
function onReady() {
	populateList();

	var occupation = document.getElementById("occupation");
	occupation.addEventListener("change", checkOther);

	var cancelButton = document.getElementById("cancelButton");
	cancelButton.addEventListener("click", confirmExit);

	var submit = document.getElementById("signup");
	submit.addEventListener("submit", onSubmit);
}

//calls onReady() when page loads
document.addEventListener("DOMContentLoaded", onReady);

//populates state list with given list of states
function populateList() {
	var options = document.getElementById("signup").elements["state"];
	for (var i = 0; i < usStates.length; i++) {
		var tempOption = document.createElement("OPTION");
		tempOption.text = usStates[i].name;
		tempOption.value = usStates[i].code;
		options.appendChild(tempOption);	
	}
}

//displays or hides other occupation description if needed
function checkOther() {
	var value = this.value;
	var occupationOther = document.getElementById("signup").elements["occupationOther"];
	if (value === 'other') {
		occupationOther.style.display = 'block';
	} else {
		occupationOther.style.display = 'none';
	}
}

//confirms if user would like to leave or not, redirects to google
function confirmExit() {
	if (window.confirm("Are you sure you want to leave?")) {
		window.location = 'https://google.com';
	}
}

//final checks before form submission, catches errors
function onSubmit(evt) {
	try {
		var valid = validateForm(this);
	} catch (e) {
		console.log(e);
	}
	//prevents submission if invalid fields
	if (!valid && evt.preventDefault) {
		evt.preventDefault();
	}
	evt.returnValue = false;
    return false;
}

//checks all required fields for validity
//takes in the form as a parameter
//returns true if valid, false if not
function validateForm(form) {
	var requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'birthdate', 'occupation'];
	var idx;
	var formValid = true;

	for (idx = 0; idx < requiredFields.length; idx++) {
		var currentElement = form.elements[requiredFields[idx]]
		//checks if occupation is other, if so, checks other occupation description for validity
		if(requiredFields[idx] === 'occupation' && currentElement.value === "other") {
			invalidAlert(true, currentElement);
			currentElement = form.elements['occupationOther'];
		}
		formValid &= validateRequiredField(currentElement);

	}
	return formValid;
}

//validates individual fields
function validateRequiredField(field) {
	var value = field.value.trim();
	var valid = value.length > 0;
	var form = document.getElementById("signup");
	//checks for valid zip code, must contain 5 digits
	if (valid && field === form.elements['zip']) {
		var zipRegExp = new RegExp('^\\d{5}$');
		valid = zipRegExp.test(value);
	} 
	//checks for valid age, must be 13 or older
	//alerts if not old enough
	else if(valid && field === form.elements['birthdate']) {
		var dob = new Date(field.value);
		var msg = document.getElementById("birthdateMessage")
		if (calculateAge(dob) < 13) {
			msg.innerHTML = "Must be 13 years or older to join!";
			valid = false;
		} else {
			msg.innerHTML = "";
			valid = true;
		}
	}
	invalidAlert(valid, field);
	return valid;
}

//visably alerts user that required fields are invalid
function invalidAlert(valid, field) {
	if (!valid) {
		field.style.border = '1px solid #FF0000';
	} else {
		field.style.border = 'none';
	}
}

//calculates and returns age
function calculateAge(dob) {
	var today = new Date();
    dob = new Date(dob);
    var yearsDiff = today.getFullYear() - dob.getUTCFullYear();
    var monthsDiff = today.getMonth() - dob.getUTCMonth();
    var daysDiff = today.getDate() - dob.getUTCDate();

    if (monthsDiff < 0 || (0 === monthsDiff && daysDiff < 0)) { 
        yearsDiff--;
    }

    return yearsDiff;
}
