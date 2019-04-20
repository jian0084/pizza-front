/*
Photo by Carissa Gan on Unsplash

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@carissagan?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Carissa Gan"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Carissa Gan</span></a>

Photo by Thomas Schweighofer on Unsplash

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@thomasschweighofer_?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Thomas Schweighofer"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Thomas Schweighofer</span></a>
*/

/*
When removeItem from localStorage? Sign out and... when login? When load the homepage?
Not isStaff users can access list pizzas/ingredients? Review prepareInitialScreen
*/

let webPizza = {
    KEY: 'PizzaShopKey',
    //BASEURL: 'http://mad9124.rocks',
    //BASEURL: 'https://jsonplaceholder.typicode.com/',
    BASEURL: 'http://127.0.0.1:3030',
    init: function () {
        document.addEventListener("DOMContentLoaded", webPizza.ready,false);
    },
    ready: function () {
        webPizza.prepareInitialScreen();
        webPizza.addListeners();
    },
    addListeners: function(){
        // Add Event Listeners of Sign In page
        let signin = document.getElementById("form-sign-in");
        if (signin !== null) {
            console.log("Sign-In");
            document.getElementById('signin-btn-signin').addEventListener('click', webPizza.doLogin);
            document.getElementById('signin-show-password').addEventListener('change', webPizza.showPassword);
        } else {
            let ingred = document.getElementById("form-ingredients");
            if (ingred !== null) {
                console.log("Ingredients");
                document.getElementById('add').addEventListener('click', webPizza.prepareAddScreen);
            }
        }
    },
    doLogin: function (ev) {
        ev.preventDefault();

        //console.log("doLogin");
        
        // remove invalid feedback (if exists)
        webPizza.removeInvalidFeedback();
        
        // check if the input fields are valid
        let InvalidInput = webPizza.validateSignIn();

        // If there's no invalid input, then try to login
        if (InvalidInput.length === 0) {
            
            //define the end point for the request
            let url = webPizza.BASEURL + "/auth/tokens";

            //prepare the data to send to the server
            let LoggedInUser = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            let jsonData = JSON.stringify(LoggedInUser);
            //console.log(jsonData);

            //create a Headers object
            let headers = new Headers();
            //append the Authorization header
            headers.append('Content-Type', 'application/json;charset=UTF-8');

            //create a Request Object
            let req = new Request(url, {
                headers: headers,
                method: 'POST',
                mode: 'cors',
                //credentials: 'include',
                body: jsonData
            });

            fetch(req)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error ' + response.status + ' ' + response.statusText);
                    }
                })
                .then(result => {
                    console.log("success");
                    let data = result.data;
                    //console.log('TOKEN', data.token);

                    //put this in sessionStorage
                    localStorage.removeItem(webPizza.KEY);
                    localStorage.setItem(webPizza.KEY, JSON.stringify(data.token));
                
                    // Set the menu items according to isStaff flag
                    webPizza.setMenuItems();
                
                })
                .catch(err => {
                    //there will be an error because this is not a valid URL
                    console.error(err.code + ': ' + err.message);
                })
        } else {
            // display invalid inputs
            InvalidInput.forEach( obj =>{               
                let failField = document.getElementById(obj.input);   
                failField.classList.add("is-invalid");
                let invalidMsg = document.createElement("div");
                invalidMsg.textContent = obj.msg;
                invalidMsg.classList.add("invalid-feedback");
                failField.parentElement.appendChild(invalidMsg);    
            })
        }
    },
    listAllIngredients: function () {  
        console.log("List All Ingredientes");
        
        //define the end point for the request
        let url = webPizza.BASEURL + "/api/ingredients";
       
        //get the token from localStorage
        let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        //console.log(token);

        //create a Headers object
        let headers = new Headers();
        //append the Authorization header
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        console.log(headers);

        //create a Request Object
        let req = new Request(url, {
            headers: headers,
            method: 'GET',
            mode: 'cors'
        });
        
        //body is the data that goes to the API
        //now do the fetch
        fetch(req)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error ' + response.status + ' ' + response.statusText);
                } else {
                    return response.json();
                }
            })
            .then(result => {
                //console.log("success");
                let data = result.data;
                
                let ingredCounter = 0;

                // reset list of ingredients
                let ingred = document.querySelector('tbody');
                while (ingred.firstChild){
                    ingred.removeChild(ingred.firstChild);
                }
                console.log(ingred);

                data.forEach(obj => {
                    console.log(obj.name);
                });

                // Create list of Ingredients
                data.forEach(obj => {

                    ingredCounter++;

                    let tr = document.createElement('tr');
                    let tdCheck = document.createElement('td');
                    let div = document.createElement('div');
                    div.className = 'custom-control';
                    div.classList.add('custom-checkbox');
                    let input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    input.className = 'custom-control-input';
                    input.id = 'check' + ingredCounter;
                    let label = document.createElement('label');
                    label.className = 'custom-control-label';
                    label.setAttribute('for', 'check' + ingredCounter);
                    label.textContent = ingredCounter;

                    div.appendChild(input);
                    div.appendChild(label);
                    tdCheck.appendChild(div);

                    let tdName = document.createElement('td');
                    tdName.textContent = obj.name;
                    let tdPrice = document.createElement('td');
                    tdPrice.textContent = '$' + (obj.price/100).toFixed(2);
                    let tdQuantity = document.createElement('td');
                    tdQuantity.textContent = obj.quantity;
                    let tdIsGlutenFree = document.createElement('td');
                    tdIsGlutenFree.textContent = obj.isGlutenFree ? "No" : "Yes";
                    let tdButtons = document.createElement('td');
                    let btEdit = document.createElement('button');
                    btEdit.setAttribute('type', 'button');
                    btEdit.className = 'btn btn-edit btn-primary btn-rounded btn-sm mr-2';
                    btEdit.textContent = 'EDIT';
                    let btDelete = document.createElement('button');
                    btDelete.setAttribute('type', 'button');
                    btDelete.className = 'btn btn-danger btn-rounded btn-sm m-0';
                    btDelete.textContent = 'DELETE';
                    tdButtons.appendChild(btEdit);
                    tdButtons.appendChild(btDelete);

                    tr.appendChild(tdCheck);
                    tr.appendChild(tdName);
                    tr.appendChild(tdPrice);
                    tr.appendChild(tdQuantity);
                    tr.appendChild(tdIsGlutenFree);
                    tr.appendChild(tdButtons);
                    ingred.appendChild(tr);
                    
                })
            })
            .catch(err => {
                //there will be an error because this is not a valid URL
                console.error(err.code + ': ' + err.message);
            })

    },
    prepareAddScreen: function(){
        if (document.getElementById("form-ingredients") !== null) {
            // call ingredient page to add new ingredient
            location = "/admin/ingredient-edit.html";
        }
    },
    prepareInitialScreen: function(){
        let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        console.log('prepareInitialScreen');
        console.log('token',token);
        // Logged-in user
        if(token !== null){
            if(document.getElementById("form-sign-in") !== null){
                // reset form fields
                document.querySelector('.form-account').reset();
                document.getElementById('email').focus();
            } else {
                if (document.getElementById("form-pizzas") !== null) {          
                    let token = JSON.parse(localStorage.getItem(webPizza.KEY));
                    //console.log(token);
                    
                    // Logged-in user
                    if(token !== null){
                        document.getElementById("nav-sign-in").classList.add("hide");
                        document.getElementById("nav-sign-out").classList.remove("hide");
                    }
                    //webPizza.listAllPizzas();
                } else {
                    if (document.getElementById("form-ingredients") !== null) {
                        let token = JSON.parse(localStorage.getItem(webPizza.KEY));
                        //console.log(token);
                        
                        // Logged-in user
                        if(token !== null){
                            document.getElementById("nav-sign-in").classList.add("hide");
                            document.getElementById("nav-sign-out").classList.remove("hide");
                        }
                        webPizza.listAllIngredients();
                    }
                }   
            }
        }
    },
    removeInvalidFeedback: function(){
        // remove invalid feedback messages of page inputs
        if (document.getElementById("form-sign-in") !== null) {
            let invalidFields = document.querySelectorAll('.is-invalid');
            if(invalidFields.length > 0){
                invalidFields.forEach(field => {
                    let parentFeedback = field.parentElement;
                    let feedback = parentFeedback.querySelector('.invalid-feedback');
                    parentFeedback.removeChild(feedback);
                    field.classList.remove('is-invalid');          
                })
            }
        }
    },
    setMenuItems: function(){  
        // set menu items according to isStaff flag

        //define the end point for the request
        let url = webPizza.BASEURL + "/auth/users/me";
       
        //get the token from localStorage
        let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        //console.log(token);

        //create a Headers object
        let headers = new Headers();
        //append the Authorization header
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        //console.log(headers);

        //create a Request Object
        let req = new Request(url, {
            headers: headers,
            method: 'GET',
            mode: 'cors'
        });

        // get logged-in user's data
        fetch(req)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error ' + response.status + ' ' + response.statusText);
                } else {
                    return response.json();
                }
            })
            .then(result => {
                //console.log("success");
                let data = result.data;
                
                //console.log('isStaff', data.isStaff);
                if(!data.isStaff){
                    alert("Only staff users have access to this system.");
                    webPizza.prepareInitialScreen();
                } else {
                    // call pizza list page for the logged-in user
                    location = "/admin/pizzas.html";
                };
            
            })
            .catch(err => {
                //there will be an error because this is not a valid URL
                console.log(err.code + ': ' + err.message);
            })
    },
    showPassword: function(ev) {
        ev.preventDefault();
        
        let password = document.getElementById('signin-show-password');
        if (password.checked){
            document.getElementById('password').type = "text";
        } else{
            document.getElementById('password').type = "password";
        }
    },
    validateSignIn: function () {
        // Validate Sign in fields
        let invalidInput = [];
        
        let signinEmail = document.getElementById('email');
        if (signinEmail.value === "") {
            invalidInput.push({input: 'email', msg: 'Email is required.'});
        }
        let signinPassword = document.getElementById('password');
        if (signinPassword.value === "") {
            invalidInput.push({input: 'password', msg: 'Password is required.'});
        }
        //console.log(invalidInput);
        return invalidInput;
    }
}

webPizza.init();