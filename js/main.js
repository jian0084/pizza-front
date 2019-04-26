/*
Photo by Carissa Gan on Unsplash

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@carissagan?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Carissa Gan"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Carissa Gan</span></a>

Photo by Thomas Schweighofer on Unsplash

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@thomasschweighofer_?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Thomas Schweighofer"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Thomas Schweighofer</span></a>
*/

/*
When removeItem from localStorage? Sign out and... when login? When load the homepage?
Not isStaff users can access list pizzas/ingredients? Review prepareInitialScreen 
discuss the navbar items after sign in (sign out/sign up/profile) on each screen

list a pizza (need to populate ingredient)
*/

let webPizza = {
    KEY: 'PizzaShopKey',
    // BASEURL: 'http://mad9124.rocks',
    //BASEURL: 'https://jsonplaceholder.typicode.com/',
    // BASEURL: 'http://127.0.0.1:3030',
    BASEURL: 'jian0084.edumedia.ca',
    init: function () {
        document.addEventListener("DOMContentLoaded", webPizza.ready,false);
    },
    ready: function () {
        webPizza.prepareInitialScreen();
        webPizza.addListeners();
    },

    prepareInitialScreen: function(){
        //console.log('prepareInitialScreen');

        //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        let token = null;
        let isStaff = "";
        let objToken = {};
        objToken = localStorage.getItem(webPizza.KEY);
        if (objToken) {
            objToken = JSON.parse(objToken);
            //console.log('token',objToken);
            token = objToken.token;
            isStaff = objToken.isStaff;
        }

        // Logged-in user
        if(token !== null){
            if(document.getElementById("nav-sign-in") !== null)
                document.getElementById("nav-sign-in").classList.add("hide");
            
            if(document.getElementById("nav-sign-out") !== null)
                document.getElementById("nav-sign-out").classList.remove("hide"); 

            if(document.getElementById("nav-profile") !== null)
                document.getElementById("nav-profile").classList.remove("hide");
        } else {
            console.log(document.getElementById("nav-sign-in"));
            if(document.getElementById("nav-sign-in") !== null)
                document.getElementById("nav-sign-in").classList.remove("hide");
            
            if(document.getElementById("nav-sign-out") !== null)
                document.getElementById("nav-sign-out").classList.add("hide"); 

            if(document.getElementById("nav-profile") !== null)
                document.getElementById("nav-profile").classList.add("hide");
        }

        // check if sign in page is loaded
        if(document.getElementById("form-sign-in") !== null){
            // reset form fields
            document.querySelector('.form-account').reset();
            document.getElementById('email').focus();
            return;
        } else {
            if(document.getElementById("form-register") !== null){
                // reset form fields
                document.querySelector('.form-account').reset();
                document.getElementById('first-name').focus();
                return;
            }
        }

        // Logged-in user
        if(token !== null){
            if(document.getElementById("form-profile") !== null){
                console.log('form-profile');
                // reset form fields
                document.querySelector('.form-account').reset();
                // fill out the profile form
                webPizza.loadProfile();
                document.getElementById('newPwd').focus();
                return;
            } else {
                if (document.getElementById("form-pizzas") !== null || document.getElementById("form-ingredients") !== null) {          
                    // check if user isStaff
                    if(isStaff === true){
                        webPizza.listAll();
                    } else {
                        alert('Only staff customer has access to this page');
                    }
                    
                } else {
                    if (document.getElementById("form-ingredient-edit") !== null || document.getElementById("form-pizza-edit") !== null){
                        //console.log('add/edit page')
                        // reset form fields
                        document.querySelector('.form-add-edit').reset();

                        // check if it's in edit mode (there's a id)
                        let urlParams = new URLSearchParams(document.location.search);
                        if(urlParams.has('id')) {
                            // fill out the item (ingredient or pizza) form
                            webPizza.loadAnItem();
                        } else {
                            // if pizza add/edit page then load ingredients and extra toppings options
                            if(document.getElementById("form-pizza-edit") !== null) {
                                webPizza.loadIngredOptions();
                            }
                        };

                        document.getElementById('name').focus();
                        return;
                    }
                }
            }
        }
    },
    addListeners: function(){
        // Add Event Listeners of Sign In page
        let signin = document.getElementById("form-sign-in");
        let signup = document.getElementById("form-register");
        let profile = document.getElementById("form-profile");
        
        // add event listener for show password (sign in and sign up pages)
        if (signin !== null || signup !== null || profile !== null) {
            document.getElementById('show-password').addEventListener('change', webPizza.showPassword);
        } 
        
        if (signin !== null) {
            //console.log("Sign-In");
            document.getElementById('signin-btn-signin').addEventListener('click', webPizza.doLogin);
        } else {
            if (signup !== null) {
                //console.log("Sign-Up");
                document.getElementById('signup-btn-signup').addEventListener('click', webPizza.registerUser);
            } else {
                if(profile !== null) {
                    console.log('profile');
                    document.getElementById('btn-change-password').addEventListener('click',webPizza.changePassword);
                } else {
                    if (document.getElementById("form-ingredients") !== null || document.getElementById("form-pizzas") !== null) {
                        document.getElementById('add').addEventListener('click', webPizza.callDetailItem);
                    } else {
                        if (document.getElementById("form-ingredient-edit") !== null || document.getElementById("form-pizza-edit") !== null) {
                            document.getElementById('btn-back').addEventListener('click', webPizza.callListScreen);
                            document.getElementById('btn-save').addEventListener('click', webPizza.saveItem);
                            document.getElementById('price').addEventListener('blur', webPizza.formatCurrency);
                        }  else {
                            if(document.getElementById('form-index')){
                                //document.getElementById('nav-ingredients').addEventListener('click', webPizza.setMenuItems);
                                document.getElementById('nav-ingredients').addEventListener('click', function(){
                                    console.log('ingredients option');
                                });
                            }
                        }
                    }
                }
            }
        }
        
        // add event listener for sign out when load other pages
        let signout = document.getElementById("nav-sign-out");
        if (signout !== null){
            //console.log("Sign out");
            signout.addEventListener('click', webPizza.signOut);
        }
    },
    callDetailItem: function(ev){
        ev.preventDefault();

        let queryString = "";

        if ((document.getElementById("form-ingredients") !== null) || (document.getElementById("form-pizzas") !== null)) {
            let typeItem = "";
            if(document.getElementById("form-ingredients") !== null)
                typeItem = "ingredient";
            else 
                typeItem = "pizza";
            
            if(ev.currentTarget.classList.contains("btn-edit")){
                // set querystring with the ingredient id
                queryString = "?id=" + ev.currentTarget.getAttribute("data-id");
                console.log(ev.currentTarget.getAttribute("data-id"));
                console.log(queryString);
            }
            // call item (ingredient or pizza) detail page (add/edit)
            //document.location.href = "./admin/" + typeItem + "-edit.html" + queryString;
            document.location.href = "./" + typeItem + "-edit.html" + queryString;
        } 
    },
    callListScreen: function(){
        let typeItem = "";
        if (document.getElementById("form-ingredient-edit") !== null) {
            typeItem = "ingredients";
        } else {
            if(document.getElementById("form-pizza-edit") !== null) {
                typeItem = "pizzas";
            }
        }
        //document.location.href = "./admin/" + typeItem + ".html";
        document.location.href = "./" + typeItem + ".html";
    },
    changePassword: function(ev){
        ev.preventDefault();

        // remove invalid feedback (if exists)
        webPizza.removeInvalidFeedback();
        
        // check if the input fields are valid
        //let InvalidInput = webPizza.validateSignIn();
        let InvalidInput = webPizza.validateInputFields();

        // If there's no invalid input, then try to login
        if (InvalidInput.length === 0) {
            //define the end point for the request
            let url = webPizza.BASEURL + "/auth/users/me";

            //prepare the data to send to the server
            let newPwd = {
                password: document.getElementById('newPwd').value
            };
            let jsonData = JSON.stringify(newPwd);
            console.log(jsonData);

            //get the token from localStorage
            //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
            let objToken = {};
            objToken = localStorage.getItem(webPizza.KEY);
            if (objToken) {
                objToken = JSON.parse(objToken);
            }
            //console.log('token',objToken);
            let token = objToken.token;
            let isStaff = objToken.isStaff;

            //create a Headers object
            let headers = new Headers();
            //append the Authorization header
            headers.append('Authorization', 'Bearer ' + token);
            headers.append('Content-Type', 'application/json;charset=UTF-8');
            //console.log(headers);

            //create a Request Object
            let req = new Request(url, {
                headers: headers,
                method: 'PATCH',
                mode: 'cors',
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
                    //console.log("success");
                    let data = result.data;
                    //console.log(result.data);

                    // msg success to include
                    alert("Password changed successfully.");
                    // call sign in page???
                    document.location.href = "/sign-in.html";
                    
                })
                .catch(err => {
                    //there will be an error because this is not a valid URL
                    console.error(err.code + ': ' + err.message);
                    alert(err.message);
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
    deleteItem: function(ev){
        ev.preventDefault();

        let typeItem = "";
        if(document.getElementById('form-pizzas') !== null) {
            typeItem = 'pizzas';
        } else {
            if(document.getElementById('form-ingredients') !== null) {
                typeItem = 'ingredients';
            }
        }
        
        // are you sure you want to delete this ingredient?
        let confDel = confirm('Are you sure you want to delete this ' + (typeItem.substr(0,typeItem.length-1)) + '?');
        //console.log(confDel);

        // delete the ingredient
        if(confDel) {
            let itemId = ev.currentTarget.getAttribute("data-id");

            //define the end point for the request
            let url = webPizza.BASEURL + "/api/" + typeItem + "/" + itemId;

            //get the token from localStorage
            //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
            let objToken = {};
            objToken = localStorage.getItem(webPizza.KEY);
            if (objToken) {
                objToken = JSON.parse(objToken);
            }
            //console.log('token',objToken);
            let token = objToken.token;
            let isStaff = objToken.isStaff;

            //create a Headers object
            let headers = new Headers();
            //append the Authorization header
            headers.append('Authorization', 'Bearer ' + token);
            headers.append('Content-Type', 'application/json;charset=UTF-8');
            //console.log(headers);

            //create a Request Object
            let req = new Request(url, {
                headers: headers,
                method: 'DELETE',
                mode: 'cors'
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
                    //console.log("success");
                    let data = result.data;
                    //console.log(result.data);

                    // msg success to include
                    alert(result.data.name + " " + (typeItem.substr(0,typeItem.length-1)) + " was deleted successfully.");

                    // update the list of items (pizzas or ingredients)
                    webPizza.listAll();
                })
                .catch(err => {
                    //there will be an error because this is not a valid URL
                    console.error(err.code + ': ' + err.message);
                    alert(err.message);
                })
        }
    },
    displayMessage: function(type, msg){
        let alertType = "";
        switch (type){
            case "info": 
                alertType = "alert-info";
                break;
            case "success": 
                alertType = "alert-success";
                break;
            case "error": 
                alertType = "alert-info";
                break;
            default:
                alertType = "alert-info";
        } 
        
        let div = document.createElement('div');
        div.className = 'alert ' + alertType + ' alert-dismissible';
        div.setAttribute = 'alert';
        div.textContent = msg;
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'close';
        btn.setAttribute('data-dismiss', 'alert');
        btn.innerHTML = "&times;";

        div.appendChild(btn);
        console.log(div);
        

        let body = document.querySelector('body');
        body.insertBefore(div,body.childNodes[0]);
        console.log(body);

        let alert = document.querySelector('.alert');
        alert.classList.add("alert-show");

    },
    doLogin: function(ev) {
        console.log(ev);
        ev.preventDefault();

        //console.log("doLogin");
        
        // remove invalid feedback (if exists)
        webPizza.removeInvalidFeedback();
        
        // check if the input fields are valid
        //let InvalidInput = webPizza.validateSignIn();
        let InvalidInput = webPizza.validateInputFields();

        // If there's no invalid input, then try to login
        if (InvalidInput.length === 0) {
            
            //define the end point for the request
            let url = webPizza.BASEURL + "/auth/tokens";
            console.log(url);

            //prepare the data to send to the server
            let LoggedInUser = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            let jsonData = JSON.stringify(LoggedInUser);
            console.log(jsonData);

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
                        console.log(response);
                        throw new Error('Error ' + response.status + ' ' + response.statusText);
                    }
                })
                .then(result => {
                    console.log("success");
                    let data = result.data;
                    //console.log('TOKEN', data.token);

                    let token = data.token;
                
                    // check if staff
                    //define the end point for the request
                    let url = webPizza.BASEURL + "/auth/users/me";

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

                            let PizzaShopKey = {
                                "token" : token,
                                "isStaff": data.isStaff
                            }

                            console.log(JSON.stringify(PizzaShopKey));

                            //put this in sessionStorage
                            localStorage.removeItem(webPizza.KEY);
                            localStorage.setItem(webPizza.KEY, JSON.stringify(PizzaShopKey));

                            if(!data.isStaff){
                                // if user is not a staff, load the sign in page again
                                if(document.getElementById('form-sign-in')){
                                    // call home page if after sign in page
                                    document.location.href = "./index.html";
                                }
                                
                            } else {
                                // call pizza list page for the logged-in user
                                document.location.href = "./admin/pizzas.html";
                            };
                        
                        })
                        .catch(err => {
                            //there will be an error because this is not a valid URL
                            console.error(err.code + ': ' + err.message);
                            alert(err.message);
                        })
                })        
                .catch(err => {
                    //there will be an error because this is not a valid URL
                    console.error(err.code + ': ' + err.message);
                    alert(err.message);
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
    formatCurrency: function(ev){
        ev.preventDefault();

        let price = document.getElementById("price");
        if(price === ""){
            // set the default price for ingredient
            price.value = 1.00;
        } else {
            // check if there's a decimal point
            let posDecimal = price.value.indexOf(".");
            if(posDecimal < 0) {
                // format price with decimals
                price.value = price.value + '.00';
            } else {
                price.value = parseFloat(price.value).toFixed(2);
            }
        }
    },
    listAll: function(){

        let typeList = "";
        if(document.getElementById("form-pizzas")){
            typeList = "pizzas"
        } else {
            if(document.getElementById("form-ingredients")){
                typeList = "ingredients"
            }
        };
        //console.log("List all " + typeList);
        
        //define the end point for the request
        let url = webPizza.BASEURL + "/api/" + typeList;
       
        //get the token from localStorage
        //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        let objToken = {};
        objToken = localStorage.getItem(webPizza.KEY);
        if (objToken) {
            objToken = JSON.parse(objToken);
        }
        //console.log('token',objToken);
        let token = objToken.token;
        let isStaff = objToken.isStaff;

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
                //console.log(data);
                
                let Counter = 0;

                // reset list of ingredients
                let list = document.querySelector('tbody');
                while (list.firstChild){
                    list.removeChild(list.firstChild);
                }
                //console.log(ingred);

                let sorted = data.sort( (a, b) => {
                    if(a.name > b.name) return 1;
                    else if(b.name > a.name) return -1;
                    else return 0;
                })

                // Create list of Ingredients
                sorted.forEach(obj => {

                    Counter++;

                    let tr = document.createElement('tr');
                    let tdNumber = document.createElement('td');
                    tdNumber.textContent = Counter;

                    let tdName = document.createElement('td');              
                    tdName.textContent = obj.name;
                    let tdPrice = document.createElement('td');
                    tdPrice.textContent = '$' + (obj.price/100).toFixed(2);

                    let tdSize = "";
                    let tdQuantity = ""
                    if(typeList === "pizzas"){
                        tdSize = document.createElement('td');
                        tdSize.textContent = obj.size;
                    } else {
                        if (typeList === "ingredients"){
                            tdQuantity = document.createElement('td');
                            tdQuantity.textContent = obj.quantity;
                        }
                    }
                    
                    let tdIsGlutenFree = document.createElement('td');
                    tdIsGlutenFree.textContent = obj.isGlutenFree ? "No" : "Yes";

                    let tdButtons = document.createElement('td');
                    let btEdit = document.createElement('button');
                    btEdit.setAttribute('type', 'button');
                    btEdit.className = 'btn btn-edit btn-primary btn-rounded btn-sm mr-2';
                    btEdit.textContent = 'EDIT';
                    btEdit.setAttribute('data-id', obj._id);
                    let btDelete = document.createElement('button');
                    btDelete.setAttribute('type', 'button');
                    btDelete.className = 'btn-delete btn btn-danger btn-rounded btn-sm m-0';
                    btDelete.textContent = 'DELETE';
                    btDelete.setAttribute('data-id', obj._id);
                    tdButtons.appendChild(btEdit);
                    tdButtons.appendChild(btDelete);

                    tr.appendChild(tdNumber);
                    tr.appendChild(tdName);
                    tr.appendChild(tdPrice);
                    if(typeList === "pizzas"){
                        tr.appendChild(tdSize);
                    } else {
                        if(typeList === "ingredients"){
                            tr.appendChild(tdQuantity);
                        }
                    }
                    tr.appendChild(tdIsGlutenFree);
                    tr.appendChild(tdButtons);
                    list.appendChild(tr);
                    //console.log(tr);
                })
                // add event listener to delete and edit buttons
                if(sorted.length > 0){
                    let btEdit = document.querySelectorAll(".btn-edit");
                    btEdit.forEach(item =>{
                        item.addEventListener("click", webPizza.callDetailItem);
                    })
                    let btDel = document.querySelectorAll(".btn-delete");
                    btDel.forEach(item =>{
                        item.addEventListener("click", webPizza.deleteItem);
                    })
                }
            })
            .catch(err => {
                //there will be an error because this is not a valid URL
                console.error(err.code + ': ' + err.message);
                alert(err.message);
            })
    },
    loadAnItem: function(ev){
        // check if it's in add or edit mode
        let urlParams = new URLSearchParams(document.location.search);

        if(urlParams.has('id')) {

            let typeItem = "";
            if(document.getElementById('form-ingredient-edit')){
                typeItem = "ingredients";
            } else {
                typeItem = "pizzas"
            }

            // load edit ingredient page
            let itemId = urlParams.get('id');
            console.log(itemId);

            //define the end point for the request
            let url = webPizza.BASEURL + "/api/" + typeItem + "/" + itemId;

            //get the token from localStorage
            //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
            let objToken = {};
            objToken = localStorage.getItem(webPizza.KEY);
            if (objToken) {
                objToken = JSON.parse(objToken);
            }
            //console.log('token',objToken);
            let token = objToken.token;
            let isStaff = objToken.isStaff;

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
            
            // get the data of the ingredient
            fetch(req)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error ' + response.status + ' ' + response.statusText);
                }
            })
            .then(result => {
                //console.log("success");
                let data = result.data;
                //console.log(result.data);

                // fill out the form
                document.getElementById("name").value = data.name;
                document.getElementById("price").value = parseFloat(data.price/100).toFixed(2);
                if(data.isGlutenFree === true){
                    document.getElementById('yes-glutenfree').checked = true;
                } else {
                    document.getElementById('no-glutenfree').checked = true;
                }
                if(typeItem === "ingredients"){
                    document.getElementById('quantity').value = data.quantity;
                    document.getElementById('url').value = data.imageUrl;
                    //console.log(data.categories);
                    data.categories.forEach(item => {
                        console.log(item);
                        switch (item) {
                            case 'meat':
                                document.getElementById('meat').checked = true;
                                break;
                            case 'spicy':
                                document.getElementById('spicy').checked = true;
                                break;
                            case 'vegetarian':
                                document.getElementById('vegetarian').checked = true;
                                break;
                            case 'vegan':
                                document.getElementById('vegan').checked = true;
                                break;
                            case 'halal':
                                document.getElementById('halal').checked = true;
                                break;
                            case 'kosher':
                                document.getElementById('kosher').checked = true;
                                break;
                            case 'cheeze':
                                document.getElementById('cheeze').checked = true;
                                break;
                            case 'seasonings':
                                document.getElementById('seasonings').checked = true;
                                break;
                        }
                    })
                } else {
                    document.getElementById('imageUrl').value = data.imageUrl;
                    switch (data.size) {
                        case 'small':
                            document.getElementById('small').checked = true;
                            break;
                        case 'medium':
                            document.getElementById('medium').checked = true;
                            break;
                        case 'large':
                            document.getElementById('large').checked = true;
                            break;
                        case 'extra large':
                            document.getElementById('extra-large').checked = true;
                            break;
                    }
                    let ingredPizza = data.ingredients;
                    let extraTopPizza = data.extraToppings;
                    webPizza.loadIngredOptions(ingredPizza, extraTopPizza);
                }
            })
            .catch(err => {
                //there will be an error because this is not a valid URL
                console.error(err.code + ': ' + err.message);
                alert(err.message);
            })
        }
    },
    loadIngredOptions: function(ingredPizza = [], extraTopPizza = []){
        // select all ingredients
        //define the end point for the request
        let url = webPizza.BASEURL + "/api/ingredients";
       
        //get the token from localStorage
        //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        let objToken = {};
        objToken = localStorage.getItem(webPizza.KEY);
        if (objToken) {
            objToken = JSON.parse(objToken);
        }
        //console.log('token',objToken);
        let token = objToken.token;
        let isStaff = objToken.isStaff;

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
                
                // reset list of ingredients
                let list = document.querySelector('.ingred-option-input');
                while (list.firstChild){
                    list.removeChild(list.firstChild);
                }
                list = document.querySelector('.extra-toppings-option-input');
                while (list.firstChild){
                    list.removeChild(list.firstChild);
                }

                let sorted = data.sort( (a, b) => {
                    if(a.name > b.name) return 1;
                    else if(b.name > a.name) return -1;
                    else return 0;
                })

                let counter = 0;
                let ingredOption = document.querySelector('.ingred-option-input');
                let extraTopOption = document.querySelector('.extra-toppings-option-input');

                // Create list of Ingredients
                sorted.forEach(obj => {

                    counter++;
                    
                    let div1 = document.createElement('div');
                    div1.className = "form-check form-ingred-option"
                    let input1 = document.createElement('input');
                    input1.className = "form-check-input check-ingred";
                    input1.type = "checkbox";
                    input1.setAttribute("value", obj.name);
                    input1.setAttribute("data-id", obj._id);
                    input1.setAttribute("data-price", parseFloat(obj.price/100).toFixed(2));
                    input1.id = "defaultCheck" + counter;
                    input1.classList.add(obj._id);

                    let label1 = document.createElement('label');              
                    label1.className = "form-check-label";
                    label1.setAttribute("for","defaultCheck" + counter);
                    label1.textContent = obj.name;
                    
                    div1.appendChild(input1);
                    div1.appendChild(label1);
                    ingredOption.appendChild(div1);

                    let div2 = document.createElement('div');
                    div2.className = "form-check form-extra-option"
                    let input2 = document.createElement('input');
                    input2.className = "form-check-input check-extra-toppings";
                    input2.type = "checkbox";
                    input2.setAttribute("value", obj.name);
                    input2.setAttribute("data-id", obj._id);
                    input2.setAttribute("data-price", parseFloat(obj.price/100).toFixed(2));
                    input2.id = "defaultCheckExtra" + counter;
                    input2.classList.add(obj._id);

                    let label2 = document.createElement('label');              
                    label2.className = "form-check-label";
                    label2.setAttribute("for","defaultCheckExtra" + counter);
                    label2.textContent = obj.name;
                    
                    div2.appendChild(input2);
                    div2.appendChild(label2);
                    extraTopOption.appendChild(div2);       
                })
                // add event listener to update price depends on ingredients and extra toppings
                if(sorted.length > 0){
                    let chkIngred = document.querySelectorAll(".check-ingred");
                    chkIngred.forEach(item =>{
                        item.addEventListener("click", webPizza.updatePizzaPrice);
                    })
                    let chkExtra = document.querySelectorAll(".check-extra-toppings");
                    chkExtra.forEach(item =>{
                        item.addEventListener("click", webPizza.updatePizzaPrice);
                    })
                }
                // check if there are ingredients for a pizza (page for edit)
                //console.log(ingredPizza);
                let checkIngred = [];
                checkIngred = document.querySelectorAll(".check-ingred");
                if(ingredPizza.length > 0){
                    ingredPizza.forEach(item => {
                        //console.log('item ',item._id,item.name);
                        checkIngred.forEach( opt => {
                            //console.log(opt);
                            if(opt.classList.contains(item._id)){
                                opt.checked = true;
                                //console.log(opt.checked);
                            }
                        })
                    })
                };
                
                // check if there are extra toppings for a pizza (page for edit)
                //console.log(extraTopPizza);
                let chkExtra = [];
                chkExtra = document.querySelectorAll(".check-extra-toppings");
                //console.log(chkExtra);
                if(extraTopPizza.length > 0){
                    extraTopPizza.forEach(item => {
                        //console.log('extra ',item._id, item.name);
                        chkExtra.forEach( opt => {
                            //console.log(opt);
                            if(opt.classList.contains(item._id)){
                                opt.checked = true;
                                //console.log(opt.checked);
                            }
                        })
                    })
                };
            })
            .catch(err => {
                //there will be an error because this is not a valid URL
                console.error(err.code + ': ' + err.message);
                alert(err.message);
            })
    },
    loadProfile: function(){
        //define the end point for the request
        let url = webPizza.BASEURL + "	/auth/users/me"

        //get the token from localStorage
        //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        let objToken = {};
        objToken = localStorage.getItem(webPizza.KEY);
        if (objToken) {
            objToken = JSON.parse(objToken);
        }
        //console.log('token',objToken);
        let token = objToken.token;
        let isStaff = objToken.isStaff;

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
        // get the data of the ingredient
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
            console.log(result.data);

            // fill out the form
            document.getElementById("first-name").value = data.firstName;
            document.getElementById("last-name").value = data.lastName;
            document.getElementById('email').value = data.email;
        })
        .catch(err => {
            //there will be an error because this is not a valid URL
            console.error(err.code + ': ' + err.message);
            alert(err.message);
        })
    },
 
    registerUser: function(ev){
        ev.preventDefault();

        console.log("registerUser");

        // remove invalid feedback (if exists)
        webPizza.removeInvalidFeedback();
        
        // check if the input fields are valid
        let InvalidInput = webPizza.validateInputFields();

        // If there's no invalid input, then try to register the user
        if (InvalidInput.length === 0) {
            //define the end point for the request
            let url = webPizza.BASEURL + "/auth/users";

            //prepare the data to send to the server
            let newUser = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                isStaff: (document.getElementById('inputIsStaff').value === "staff") ? "true" : "false"
            };
            let jsonData = JSON.stringify(newUser);
            console.log(jsonData);

            //create a Headers object
            let headers = new Headers();
            //append the Authorization header
            headers.append('Content-Type', 'application/json;charset=UTF-8');

            //create a Request Object
            let req = new Request(url, {
                headers: headers,
                method: 'POST',
                mode: 'cors',
                body: jsonData
            });

            // fetch
            fetch(req)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log(response);
                        let errorData = response.json();
                        let errorDetail = errorData.data;
                        console.log(errorData);
                        console.log(errorDetail);
                        //if(errorDetail[0].)
                        throw new Error('Error ' + response.status + ' ' + response.statusText);
                    }
                })
                .then(result => {
                    console.log("success");
                    let data = result.data;
                    console.log(data);

                    // if(data.isStaff){
                    //     // Get Logged-in User???
                    //     // Get Logged-in User and retrieve a valid token???? Does it depend on the user isStaff flag?
                    //     webPizzal.doLogin();
                    // } else {
                    //     // call sign in page
                    //     document.location.href = "/sign-in.html";
                    // }

                    // login for any kind of user
                    webPizza.doLogin(ev);
                })
                .catch(err => {
                    //there will be an error because this is not a valid URL
                    console.error(err.code + ': ' + err.message);
                    alert(err.message);
                    
                    // let body = document.querySelector('.form-account');
                    // let div1 = document.createElement('div');
                    // div1.className = 'modal';
                    // div1.setAttribute('role','dialog');
                    // let div2 = document.createElement('div');
                    // div2.className = 'modal-dialog';
                    // div2.setAttribute('role','document');
                    // let div3 = document.createElement('div');
                    // div3.className = 'mmodal-content';
                    // div3.textContent = 'Error';
                    // div2.appendChild(div3);
                    // div1.appendChild(div2);
                    // body.appendChild(div1);
                    // console.log(body);

                    // <div class="alert alert-primary" role="alert">
                    //     A simple primary alert—check it out!
                    // </div>
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
    removeInvalidFeedback: function(){
        // remove invalid feedback messages of page inputs
        let invalidFields = document.querySelectorAll('.is-invalid');
        if(invalidFields.length > 0){
            invalidFields.forEach(field => {
                let parentFeedback = field.parentElement;
                let feedback = parentFeedback.querySelector('.invalid-feedback');
                parentFeedback.removeChild(feedback);
                field.classList.remove('is-invalid');          
            })
        }
    },
    saveItem: function(ev){
        ev.preventDefault();

        // remove invalid feedback (if exists)
        webPizza.removeInvalidFeedback();
        
        // check if the input fields are valid
        let InvalidInput = webPizza.validateInputFields();

        // If there's no invalid input, then try to login
        if (InvalidInput.length === 0) {

            let typeItem = "";

            if(document.getElementById('form-ingredient-edit'))
                typeItem = "ingredients";
            else
                typeItem = "pizzas";

            //define the end point for the request
            let url = webPizza.BASEURL + "/api/" + typeItem;

            // check if it's to include a new item (pizza or ingredient) or to edit an item (pizza or ingredient)
            // check querystring
            // check if it's in add or edit mode
            let mode = '';
            let urlParams = new URLSearchParams(document.location.search);

            if(urlParams.has('id')) {
                // load edit item (ingredient or pizza) page
                let itemId = urlParams.get('id');
                url = url + "/" + itemId;
                mode = 'edit';
            } else {
                mode = 'add';
            };

            //get the token from localStorage
            //let token = JSON.parse(localStorage.getItem(webPizza.KEY));
            let objToken = {};
            objToken = localStorage.getItem(webPizza.KEY);
            if (objToken) {
                objToken = JSON.parse(objToken);
            }
            //console.log('token',objToken);
            let token = objToken.token;
            let isStaff = objToken.isStaff;

            //create a Headers object
            let headers = new Headers();
            //append the Authorization header
            headers.append('Authorization', 'Bearer ' + token);
            headers.append('Content-Type', 'application/json;charset=UTF-8');
            //console.log(headers);

            //prepare the data to send to the server
            let item = {}
            if(typeItem === "ingredients"){
                let categIngr = [];
                if(document.getElementById('meat').checked)
                    categIngr.push('meat');
                if(document.getElementById('spicy').checked)
                    categIngr.push('spicy');
                if(document.getElementById('vegetarian').checked)
                    categIngr.push('vegetarian')
                if(document.getElementById('vegan').checked)
                    categIngr.push('vegan')
                if(document.getElementById('halal').checked)
                    categIngr.push('halal')
                if(document.getElementById('kosher').checked)
                    categIngr.push('kosher')
                if(document.getElementById('cheeze').checked)
                    categIngr.push('cheeze')
                if(document.getElementById('seasonings').checked)
                    categIngr.push('seasonings')
                //console.log(categIngr);

                item = {
                    name: document.getElementById('name').value,
                    price: parseInt(document.getElementById('price').value * 100),
                    quantity: document.getElementById('quantity').value,
                    isGlutenFree: (document.getElementById('no-glutenfree').checked) ? "false" : "true",
                    imageUrl: (document.getElementById('url').value === "") ? "" : document.getElementById('url').value,
                    categories: categIngr
                };
            } else {
                // when the item is a pizza
                let sizePizza = 'small';
                if(document.getElementById('medium').checked){
                    sizePizza = 'medium';
                } else {
                    if(document.getElementById('large').checked){
                        sizePizza = 'large';
                    } else {
                        if(document.getElementById('extra-large').checked){
                            sizePizza = 'extra large';
                        }
                    }
                }
                console.log('sizePizza',sizePizza);

                let ingredPizza = [];
                let ingredOpt = document.querySelectorAll('.check-ingred');
                ingredOpt.forEach(item => {
                    if(item.checked){
                        ingredPizza.push(item.getAttribute("data-id"));
                    }
                });
                let extraTopPizza = [];
                let extraTopOpt = document.querySelectorAll('.check-extra-toppings');
                extraTopOpt.forEach(item => {
                    if(item.checked){
                        extraTopPizza.push(item.getAttribute("data-id"));
                    }
                });
                
                item = {
                    name: document.getElementById('name').value,
                    price: parseInt(document.getElementById('price').value * 100),
                    size: sizePizza,
                    isGlutenFree: (document.getElementById('no-glutenfree').checked) ? "false" : "true",
                    imageUrl: (document.getElementById('imageUrl').value === "") ? "" : document.getElementById('imageUrl').value,
                    ingredients: ingredPizza,
                    extraToppings: extraTopPizza
                };
            }
            let jsonData = JSON.stringify(item);
            console.log(jsonData);
            console.log(mode);

            // include a new ingredient
            //create a Request Object
            let reqMethod = "";

            if(mode === 'add') 
                reqMethod = 'POST';
            else
                reqMethod = 'PUT';

            let req = new Request(url, {
                headers: headers,
                method: reqMethod,
                mode: 'cors',
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
                    //console.log("success");
                    let data = result.data;
                    console.log(result.data);

                    // msg success to include
                    if(mode === 'add') {
                        alert(item.name + " " + typeItem.substr(0, typeItem.length-1) + " included successfully!");
                    } else {
                        alert(item.name + " " + typeItem.substr(0, typeItem.length-1) + " updated successfully!");
                    }

                    // call ingredients list page for the logged-in user
                    //document.location.href = "./admin/" + typeItem + ".html";
                    document.location.href = "./" + typeItem + ".html";
                })
                .catch(err => {
                    //there will be an error because this is not a valid URL
                    console.error(err.code + ': ' + err.message);
                    alert(err.message);
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
        };
    },
    showPassword: function(ev) {
        ev.preventDefault();

        console.log("chk pwd profile");
        let password = document.getElementById('show-password');
        if (password.checked){
            if(document.getElementById('form-profile') !== null){
                document.getElementById('newPwd').type = "text"
                document.getElementById('retypeNewPwd').type = "text"
            } else {
                document.getElementById('password').type = "text";
            }
        } else{
            if(document.getElementById('form-profile') !== null){
                document.getElementById('newPwd').type = "password"
                document.getElementById('retypeNewPwd').type = "password"
            } else {
                document.getElementById('password').type = "password";
            }
        }
    },
    signOut: function(){
        // remove the token from local Storage
        localStorage.removeItem(webPizza.KEY);
        // call sign in page
        document.location.href = "/sign-in.html";
    },
    updatePizzaPrice: function(ev){
        //ev.preventDefault();

        let ingredPrice = parseFloat(ev.currentTarget.getAttribute("data-price"));
        let pizzaPrice = 0;
        if(document.getElementById('price').value !== ""){
            pizzaPrice = parseFloat(document.getElementById('price').value);
        };
        if(ev.currentTarget.checked){
            // add ingred price to pizza price
            pizzaPrice = pizzaPrice + ingredPrice;
        } else {
            // remove ingred price from pizza price
            pizzaPrice = pizzaPrice - ingredPrice;
        }
        document.getElementById('price').value = parseFloat(pizzaPrice).toFixed(2);
    },
    validateInputFields: function() {
        // Validate input fields
        let invalidInput = [];

        if (document.getElementById("form-sign-in") !== null || document.getElementById("form-register") !== null) {
            let Email = document.getElementById('email');
            if (Email.value === "") {
                invalidInput.push({input: 'email', msg: 'Email is required.'});
            }
            let Password = document.getElementById('password');
            if (Password.value === "") {
                invalidInput.push({input: 'password', msg: 'Password is required.'});
            }
        }
        if(document.getElementById("form-register") !== null){
            let firstName = document.getElementById('first-name');
            if (firstName.value === "") {
                invalidInput.push({input: 'first-name', msg: 'First name is required.'});
            }
            let lastName = document.getElementById('last-name');
            if (lastName.value === "") {
                invalidInput.push({input: 'last-name', msg: 'Last name is required.'});
            }
        } else {
            if(document.getElementById("form-profile") !== null){
                let newPwd = document.getElementById("newPwd");
                if(newPwd.value === ""){
                    invalidInput.push({input: 'newPwd', msg: 'New Password is required.'});
                };
                let retypeNewPwd = document.getElementById("retypeNewPwd");
                if(retypeNewPwd.value === ""){
                    invalidInput.push({input: 'retypeNewPwd', msg: 'Retype New Password is required.'});
                }
                if((newPwd.value !== "" ) && (retypeNewPwd.value !== "")){
                    if(newPwd.value !== retypeNewPwd.value) {
                        invalidInput.push({input: 'newPwd', msg: 'Passwords are different.'});
                    }
                }
            } else {
                if (document.getElementById("form-ingredient-edit") !== null) {
                    let name = document.getElementById('name');
                    if (name.value === "") {
                        invalidInput.push({input: 'name', msg: 'Name is required.'});
                    }
                    let price = document.getElementById('price');
                    if (price.value === "") {
                        price.value = 1.00;
                    } else {
                        let ingredPrice = parseInt(price.value * 100);
                        if(ingredPrice < 0 || ingredPrice > 10000){
                            invalidInput.push({input: 'price', msg: 'Price must be between $0 and $100.00 '});
                        }
                    }
                    let quantity = document.getElementById('quantity');
                    if (quantity.value === "") {
                        quantity.value = 10;
                    } else {
                        let ingredQty = parseInt(quantity.value);
                        if(ingredQty < 0 || ingredQty > 1000){
                            invalidInput.push({input: 'quantity', msg: 'Quantity must be between 0 and 1000.'});
                        }
                    }
                    // validate URL
                    let url = document.getElementById('url');
                    if (url.value !== ""){
                        // validate URL
                        // if()...
                        //invalidInput.push({input: 'quantity', msg: 'Quantity must be between 0 and 1000.'});
                    }
                } else {
                    if (document.getElementById("form-pizza-edit") !== null) {
                        let name = document.getElementById('name');
                        if (name.value === "") {
                            invalidInput.push({input: 'name', msg: 'Name is required.'});
                        }
                        let price = document.getElementById('price');
                        if (price.value === "") {
                            price.value = 10.00;
                        } else {
                            let ingredPrice = parseInt(price.value * 100);
                            if(ingredPrice < 1000 || ingredPrice > 10000){
                                invalidInput.push({input: 'price', msg: 'Price must be between $10 and $100.00. Choose Ingredients and Extra Toppings.'});
                            }
                        }
                        // validate URL
                        let url = document.getElementById('imageUrl');
                        if (url.value !== ""){
                            // validate URL
                            // if()...
                            //invalidInput.push({input: 'quantity', msg: 'Quantity must be between 0 and 1000.'});
                        }
                    }
                }
            }
        }
        //console.log(invalidInput);
        return invalidInput;
    },
    
    classToggle: function () {
        const navs = document.querySelectorAll('.Navbar__Items');
        navs.forEach(nav => nav.classList.toggle('Navbar__ToggleShow'));
    }

document.querySelector('.Navbar__Link-toggle').addEventListener('click', classToggle);
}

webPizza.init();