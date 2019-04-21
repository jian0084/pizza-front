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
            //console.log("Sign-In");
            document.getElementById('signin-btn-signin').addEventListener('click', webPizza.doLogin);
            document.getElementById('signin-show-password').addEventListener('change', webPizza.showPassword);
        } else {
            let ingred = document.getElementById("form-ingredients");
            if (ingred !== null) {
                console.log("Ingredients");
                document.getElementById('add').addEventListener('click', webPizza.callDetailScreen);
            } else {
                let ingredEdit = document.getElementById("form-ingredient-edit");
                if (ingredEdit !== null) {
                    console.log("Add/Edit Ingredients");
                    document.getElementById('btn-back').addEventListener('click', webPizza.callListScreen);
                    document.getElementById('btn-save').addEventListener('click', webPizza.saveIngredient);
                    document.getElementById('price').addEventListener('blur', webPizza.formatCurrency);
                }
            }
        }
        let signout = document.getElementById("nav-sign-out");
        if (signout !== null){
            //console.log("Sign out");
            signout.addEventListener('click', webPizza.signOut);
        }
    },
    callDetailScreen: function(ev){
        ev.preventDefault();

        let queryString = "";

        if (document.getElementById("form-ingredients") !== null) {
            if(ev.currentTarget.classList.contains("btn-edit")){
                // set querystring with the ingredient id
                queryString = "?id=" + ev.currentTarget.getAttribute("data-id");
                console.log(ev.currentTarget.getAttribute("data-id"));
                console.log(queryString);
            }
            // call ingredient detail page (add/edit)
            document.location.href = "/admin/ingredient-edit.html" + queryString;
            //http://127.0.0.1:5500/admin/ingredient-edit.html?id=5caf768f9ed3824ab5dc5eb2
            //http://127.0.0.1:5500/admin/ingredients.html
            //http://127.0.0.1:3030/admin/ingredients.html
        }
    },
    callListScreen: function(){
        if (document.getElementById("form-ingredient-edit") !== null) {
            // call ingredient list page
            location = "/admin/ingredients.html";
        }
    },
    deleteIngredient: function(ev){
        ev.preventDefault();

        // are you sure you want to delete this ingredient?
        let confDel = confirm('Are you sure you want to delete this ingredient?');
        //console.log(confDel);

        // delete the ingredient
        if(confDel) {
            let ingredId = ev.currentTarget.getAttribute("data-id");

            //define the end point for the request
            let url = webPizza.BASEURL + "/api/ingredients/" + ingredId;

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
                    alert(result.data.name + " ingredient was deleted.");

                    // update the list of ingredients
                    webPizza.listAllIngredients();
                })
                .catch(err => {
                    //there will be an error because this is not a valid URL
                    console.error(err.code + ': ' + err.message);
                    alert(err.message);
                })

                // let div1 = document.createElement('div');
                // div1.className = 'modal fade';
                // div1.id = 'confirmDelete';
                // div1.setAttribute('tabindex','-1');
                // div1.setAttribute('role','dialog');
                // div1.setAttribute('aria-labelledby','confirmDeleteLabel');
                // div1.setAttribute('aria-hidden','true');
                // let div2 = document.createElement('div');
                // div2.className = 'modal-dialog';
                // div2.setAttribute('role', 'document');
                // let div3 = document.createElement('div');
                // div3.className = 'modal-content';
                // let div4 = document.createElement('div');

                // div4.className = 'modal-header';
                // let h5 = document.createElement('h5');
                // h5.className = 'modal-title';
                // h5.id = 'confirmDeleteLabel';
                // h5.textContent = 'Delete Ingredient';
                // let btn1 = document.createElement('button');
                // btn1.type = 'button';
                // btn1.className = 'close';
                // btn1.setAttribute('data-dismiss','modal');
                // btn1.setAttribute('aria-label','Close');
                // let span = document.createElement('span');
                // span.setAttribute('aria-hidden','true');
                // span.textContent = '&times;';

                // div4.appendChild(h5);
                // div4.appendChild(btn1);
                // div4.appendChild(span);

                // let div5 = document.createElement('div');
                // div5.className = 'modal-body';
                // div5.textContent = 'Are you sure you want to delete this ingredient?';

                // let div6 = document.createElement('div');
                // div6.className = 'modal-footer';
                // let btn2 = document.createElement('button');
                // btn2.type = 'button';
                // btn2.className = 'btn btn-secondary';
                // btn2.setAttribute('data-dismiss','modal');
                
                // btn2.textContent = 'Yes';
                // let btn3 = document.createElement('button');
                // btn3.type = 'button';
                // btn3.className = 'btn btn-primary';
                // btn3.setAttribute('data-dismiss','modal');
                // btn3.textContent = 'No';

                // div6.appendChild(btn2);
                // div6.appendChild(btn3);

                // div2.appendChild(div3);
                // div2.appendChild(div4);
                // div2.appendChild(div5);
                // div2.appendChild(div6);

                // div1.appendChild(div2);

                // console.log(div1);
        }
    },
    doLogin: function (ev) {
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
                        console.log(response);
                        throw new Error('Error ' + response.status + ' ' + response.statusText + ' ' + response.title);
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
        //console.log(headers);

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
                //console.log(ingred);

                let sorted = data.sort( (a, b) => {
                    if(a.name > b.name) return 1;
                    else if(b.name > a.name) return -1;
                    else return 0;
                })

                // Create list of Ingredients
                sorted.forEach(obj => {

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
                    btEdit.setAttribute('data-id', obj._id);
                    let btDelete = document.createElement('button');
                    btDelete.setAttribute('type', 'button');
                    btDelete.className = 'btn-delete btn btn-danger btn-rounded btn-sm m-0';
                    btDelete.textContent = 'DELETE';
                    btDelete.setAttribute('data-id', obj._id);
                    tdButtons.appendChild(btEdit);
                    tdButtons.appendChild(btDelete);

                    tr.appendChild(tdCheck);
                    tr.appendChild(tdName);
                    tr.appendChild(tdPrice);
                    tr.appendChild(tdQuantity);
                    tr.appendChild(tdIsGlutenFree);
                    tr.appendChild(tdButtons);
                    ingred.appendChild(tr);
                    //console.log(tr);
                })
                // add event listener to delete and edit buttons
                if(sorted.length > 0){
                    let btEdit = document.querySelectorAll(".btn-edit");
                    btEdit.forEach(item =>{
                        item.addEventListener("click", webPizza.callDetailScreen);
                    })
                    let btDel = document.querySelectorAll(".btn-delete");
                    btDel.forEach(item =>{
                        item.addEventListener("click", webPizza.deleteIngredient);
                    })
                }
            })
            .catch(err => {
                //there will be an error because this is not a valid URL
                console.error(err.code + ': ' + err.message);
                alert(err.message);
            })
    },
    prepareInitialScreen: function(){
        console.log('prepareInitialScreen');

        // check if sign in page is loaded
        if(document.getElementById("form-sign-in") !== null){
            // reset form fields
            document.querySelector('.form-account').reset();
            document.getElementById('email').focus();
        };

        let token = JSON.parse(localStorage.getItem(webPizza.KEY));
        console.log('token',token);
        // Logged-in user
        if(token !== null){
            // if(document.getElementById("form-sign-in") !== null){
            //     // reset form fields
            //     document.querySelector('.form-account').reset();
            //     document.getElementById('email').focus();
            // } else {
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
                    } else {
                        if (document.getElementById("form-ingredient-edit")){
                            // let token = JSON.parse(localStorage.getItem(webPizza.KEY));
                            // //console.log(token);
                            
                            // // Logged-in user
                            // if(token !== null){
                            //     document.getElementById("nav-sign-in").classList.add("hide");
                            //     document.getElementById("nav-sign-out").classList.remove("hide");
                            // }

                            // reset form fields
                            document.querySelector('.form-add-edit').reset();
                            
                            // check if it's in add or edit mode
                            let urlParams = new URLSearchParams(document.location.search);

                            if(urlParams.has('id')) {
                                // load edit ingredient page
                                let ingredId = urlParams.get('id');
                                console.log(ingredId);

                                //define the end point for the request
                                let url = webPizza.BASEURL + "/api/ingredients/" + ingredId;

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

                                //FAZER FETCH DO INGREDIENTE PARA EDIT
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
                                    document.getElementById("name").value = data.name;
                                    document.getElementById("price").value = parseFloat(data.price/100).toFixed(2);
                                    document.getElementById('quantity').value = data.quantity;
                                    if(data.isGlutenFree === true){
                                        document.getElementById('yes-glutenfree').checked = true;
                                    } else {
                                        document.getElementById('no-glutenfree').checked = true;
                                    }
                                    document.getElementById('url').value = data.imageUrl;
                                    console.log(data.categories);
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
                                })
                                .catch(err => {
                                    //there will be an error because this is not a valid URL
                                    console.error(err.code + ': ' + err.message);
                                    alert(err.message);
                                })
                            }
                            // add new ingredient page
                            document.getElementById('name').focus();                          
                        }
                    }
                }   
            // }
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
    saveIngredient: function(ev){
        ev.preventDefault();

        // remove invalid feedback (if exists)
        webPizza.removeInvalidFeedback();
        
        // check if the input fields are valid
        let InvalidInput = webPizza.validateInputFields();

        // If there's no invalid input, then try to login
        if (InvalidInput.length === 0) {

            //define the end point for the request
            let url = webPizza.BASEURL + "/api/ingredients";

            // check if it's to include a new ingredient or to edit an ingredient
            // check querystring
            // check if it's in add or edit mode
            let mode = '';
            let urlParams = new URLSearchParams(document.location.search);

            if(urlParams.has('id')) {
                // load edit ingredient page
                let ingredId = urlParams.get('id');
                url = url + "/" + ingredId;
                mode = 'edit';
            } else {
                mode = 'add';
            };

            //get the token from localStorage
            let token = JSON.parse(localStorage.getItem(webPizza.KEY));
            //console.log(token);

            //create a Headers object
            let headers = new Headers();
            //append the Authorization header
            headers.append('Authorization', 'Bearer ' + token);
            headers.append('Content-Type', 'application/json;charset=UTF-8');
            //console.log(headers);

            //prepare the data to send to the server
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

            let Ingredient = {
                name: document.getElementById('name').value,
                price: document.getElementById('price').value * 100,
                quantity: document.getElementById('quantity').value,
                isGlutenFree: (document.getElementById('no-glutenfree').checked) ? "false" : "true",
                imageUrl: (document.getElementById('url').value === "") ? "" : document.getElementById('url').value,
                categories: categIngr
            };
            let jsonData = JSON.stringify(Ingredient);
            console.log(jsonData);

            // include a new ingredient
            //create a Request Object
            let req = new Request(url, {
                headers: headers,
                method: (mode === 'add') ? 'POST' : 'PUT',
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
                    console.log("success");
                    let data = result.data;
                    console.log(result.data);

                    // msg success to include
                    if(mode === 'add') {
                        alert(Ingredient.name + " ingredient included successfully!");
                    } else {
                        alert(Ingredient.name + " ingredient updated successfully!");
                    }

                    // call ingredients list page for the logged-in user
                    document.location.href = "/admin/ingredients.html";
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
    signOut: function(){
        // remove the token from local Storage
        localStorage.removeItem(webPizza.KEY);
        // call sign in page
        location = "/sign-in.html";
    },
    validateInputFields: function() {
        // Validate Sign in fields
        let invalidInput = [];
        
        if (document.getElementById("form-sign-in") !== null) {
            let signinEmail = document.getElementById('email');
            if (signinEmail.value === "") {
                invalidInput.push({input: 'email', msg: 'Email is required.'});
            }
            let signinPassword = document.getElementById('password');
            if (signinPassword.value === "") {
                invalidInput.push({input: 'password', msg: 'Password is required.'});
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
                        invalidInput.push({input: 'price', msg: 'Price must be between $0 and $100.00. '});
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
            }
        }
        //console.log(invalidInput);
        return invalidInput;
    }
    // validateSignIn: function () {
    //     // Validate Sign in fields
    //     let invalidInput = [];
        
    //     let signinEmail = document.getElementById('email');
    //     if (signinEmail.value === "") {
    //         invalidInput.push({input: 'email', msg: 'Email is required.'});
    //     }
    //     let signinPassword = document.getElementById('password');
    //     if (signinPassword.value === "") {
    //         invalidInput.push({input: 'password', msg: 'Password is required.'});
    //     }
    //     //console.log(invalidInput);
    //     return invalidInput;
    // }
}

webPizza.init();