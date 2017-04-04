(function(window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;

    function FormHandler(selector) {
        if (!selector) {
            throw new Error('No selector provided');
        }
        this.$formElement = $(selector);
        if (this.$formElement.length === 0) {
            throw new Error('Could not find element with selector: ' + selector);
        }
    }
    FormHandler.prototype.addSubmitHandler = function(fn) {
        console.log('Setting submit handler for form');
        this.$formElement.on('submit', function(event) {
            event.preventDefault();
            var data = {};
            $(this).serializeArray().forEach(function(item) {
                data[item.name] = item.value;
                console.log(item.name + ' is ' + item.value);
            });

            console.log(data);
            fn(data)
                .then(function() {
                    this.reset();
                    this.elements[0].focus();
                }.bind(this));
        });
    };
    FormHandler.prototype.addInputHandler = function(fn) {
        console.log('Setting input handler for form');
        this.$formElement.on('input', '[name="emailAddress"]', function(event) {
            var emailAddress = event.target.value;
            var message = '';
            if (fn(emailAddress)) {
                event.target.setCustomValidity('');
            } else {
                message = emailAddress + ' is not an authorized email address!';
                event.target.setCustomValidity(message);
            }
        });
    };
    FormHandler.prototype.addSilverChallengeDecafHandler = function(fn) {
        var message = 'Decaf must have Caffeine level under 20';
        var coffee;
        this.$formElement.on('input', '[name="coffee"]', function(event) {
            coffee = event.target;
            var data = {};
            this.$formElement.serializeArray().forEach(function(item) {
                if (item.name === 'coffee' || item.name === 'strength') {
                    data[item.name] = item.value;
                }
            });
            if (fn(data.coffee, data.strength)) {
                event.target.setCustomValidity('');
            } else {
                event.target.setCustomValidity(message);
            }
        }.bind(this));
        this.$formElement.on('change', '[name="strength"]', function(event) {
            var data = {};
            this.$formElement.serializeArray().forEach(function(item) {
                if (item.name === 'coffee' || item.name === 'strength') {
                    data[item.name] = item.value;
                }
            });
            if (fn(data.coffee, data.strength)) {
                if (coffee) {
                    coffee.setCustomValidity('');
                }
                event.target.setCustomValidity('');
            } else {
                event.target.setCustomValidity(message);
            }
        }.bind(this));
    };


    FormHandler.prototype.addEmailAvailableHandler = function(db) {
        console.log('Setting duplicate email input handler for form');
        var emailInput = $('[data-coffee-order="email"]');

        var emailInputNojQuery = document.querySelector('[data-coffee-order="email"]');

        var cb = function(serverResponse) {
            var message = 'This email already has an order';
            if (serverResponse === null) {
                emailInput.setCustomValidity(message);
            } else {
                message = emailInput.val() + ' already has an order!';
                emailInput.setCustomValidity(message);
            }

            console.log(emailInputNojQuery.validationMessage);
            console.log(emailInputNojQuery.validity);
            console.log(emailInputNojQuery.validity.customError);
        }; // end cb(serverResponse)

        emailInput.on('input', function(event) {
            var email = event.target.value;
            if (/.+@me\.com$/.test(email)) {
                db.get(email, cb);
            } // end if
        });
    },






        App.FormHandler = FormHandler;
    window.App = App;
})(window);
