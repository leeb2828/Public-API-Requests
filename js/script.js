/* ===================================== 
   Public API Request
   JavaScript Techdegree Project 5
   by Lee Haney
======================================== */

const search_container = document.querySelector(".search-container");
const gallery = document.getElementById("gallery");
const random_url = 'https://randomuser.me/api/?results=12&nat=us';
const cards = document.querySelectorAll('.card');

// created in create_gallery_markup() method
let all_employees = [];

async function get_raw_data(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/*
Parameter: random_url.
This method calls the get_raw_data() method. It 
returns a portion of the data needed for creating
the gallery of employees.
*/
async function getRandomUsers(url) {
    let data = await get_raw_data(url);
    let employees = await data.results;
    return employees;
}

/*
Parameter: data.results from getRandomUsers().
Each individual employee card (all 12 of them) will be created and added to the page.
An event listener will be added to each card, so every time you click on an employee, 
a modal window will open.
*/
function create_gallery_markup(data) {
    data.map(employee => {

        let next = {};
        next = employee;
        all_employees.push(next);

        const card = document.createElement('DIV');
        card.classList.add('card');

        card.innerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
        </div>
        `;
        gallery.appendChild(card);

        card.addEventListener('click', function() {
            let name = this.querySelector('#name').textContent;
            // Locate the correct employee object by first and last name.
            let correct_employee = locate_employee_object(name, 0);
            // Once we have the correct employee object, we can create the markup for the modal window.
            create_modal_markup(correct_employee);
        });

    });
    
}

/* 
Locate the correct employee object by 
    a.) Employee name.
    b.) A number. Representing how we select our employee.
*/
function locate_employee_object(name, num) {
    let name_array = name.split(" ");
    if (num === 0) {
        const obj = all_employees.filter(function(employee) {
            if (employee.name.first === name_array[0] && employee.name.last === name_array[1]) {
                return employee;
            } 
        });
        return obj;
    } 
    // This is for when the user clicks the "NEXT" button on the modal window
    else if (num === 1) {
        for (let i = 0; i < all_employees.length; i++) {
            if (all_employees[i].name.first === name_array[0] && all_employees[i].name.last === name_array[1]) {
                let obj = all_employees[i+1];
                if ( (i+1) > 11 ) {
                    obj = all_employees[0];
                }
                return obj;
            }
        }
    }
    // This is for when the user clicks the "PREV" button on the modal window
    else if (num === 2) {
        for (let i = 0; i < all_employees.length; i++) {
            if (all_employees[i].name.first === name_array[0] && all_employees[i].name.last === name_array[1]) {
                let obj = all_employees[i-1];
                if ( (i-1) < 0) {
                    obj = all_employees[11];
                }
                return obj;
            }
        }
    }
    return "not found!";
}

/*
This method creates the HTML for the Search button and textbox
in the top-right corner of the screen.
*/
function create_search_markup() {
    const form = document.createElement('FORM');

    let input_one = document.createElement('INPUT');
    input_one.setAttribute('type', 'search');
    input_one.setAttribute('id', 'search-input',);
    input_one.setAttribute('class', 'search-input');
    input_one.setAttribute('placeholder', 'Search...');
    

    let input_two = document.createElement('INPUT');
    input_two.setAttribute('type', 'submit');
    input_two.setAttribute('value', 'SEARCH',);
    input_two.setAttribute('id', 'serach-submit');
    input_two.setAttribute('class', 'search-submit');

    search_container.appendChild(form);
    form.append(input_one, input_two);
}

/*
Parameters: Name of the HTML tag, the textContent, and the attributes
            and their values.
This method is used as a template for creating new HTML elements.
*/
function createNewElement(html_tag, text, ...attributes) {
    let new_element = document.createElement(html_tag);
    const length_of_attributes = Object.keys(...attributes).length - 1;
    
    for (let i = 0; i <= length_of_attributes; i++) {
        new_element.setAttribute(Object.keys(...attributes)[i], Object.values(...attributes)[i]);
    }
    new_element.textContent = text;
    return new_element;
}

// So the birthday, on each employee modal window, will be in the correct format.
function reformat_birthdate(date) {
    let month = date.substring(5,7);
    let day = date.substring(8,10);
    let year = date.substring(2,4);
    // Example output: 01/04/87
    let new_date = month + "/" + day + "/" + year;
    return new_date;
}

/*
Create the "NEXT" and "PREV" buttons in the modal window, so 
that the user can toggle back and forth between different employees.
Different employee information should appear, depending on what button
was clicked.
*/
function create_next_and_prev_buttons() {
    let html = `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    `;
    document.querySelector('.modal-btn-container').innerHTML = html;

    // The "PREV" button in the modal window.
    document.getElementById('modal-prev').addEventListener('click', function() {
        let name = document.querySelector('.modal-name').textContent;
        let correct_employee = locate_employee_object(name, 2);
        add_information_to_modal_window(correct_employee);
    });
    // The "NEXT" button in the modal window.
    document.getElementById('modal-next').addEventListener('click', function() {
        let name = document.querySelector('.modal-name').textContent;
        let correct_employee = locate_employee_object(name, 1);
        add_information_to_modal_window(correct_employee);
    });
}

/*
Parameter: An employee object.
Using information from the employee object, add information about the
employee to the modal window.
*/
function add_information_to_modal_window(human) {
    let person = human;
    let birthdate = reformat_birthdate(person.dob.date);

    let html = `
    <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
    <p class="modal-text">${person.email}</p>
    <p class="modal-text cap">${person.location.city}</p>
    <hr>
    <p class="modal-text">${person.cell}</p>
    <p class="modal-text cap">${person.location.street} ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
    <p class="modal-text">Birthday: ${birthdate}</p>
    `;
    document.querySelector('.modal-info-container').innerHTML = html;
}


/* 
- The correct employee object has already been selected in the previous 
  method (the addEventListener for each employee gallery card).
- Now we create all the HTML needed for the modal window, that will pop up when
  we click on an employee card.
- Finally, we call the method that will add all the employee information
  to the modal window -> add_information_to_modal_window().
*/
function create_modal_markup(employee) {
    const modal_container = createNewElement('DIV', "", {class:'modal-container'});
    gallery.insertAdjacentElement("afterend", modal_container);
    const modal = createNewElement('DIV', "", {class:'modal'});
    modal_container.appendChild(modal);
    const modal_btn_container = createNewElement('DIV', "", {class:'modal-btn-container'});
    modal.insertAdjacentElement("afterend", modal_btn_container);

    create_next_and_prev_buttons();

    let button = createNewElement('BUTTON', "X", {type:"button", id:"modal-close-btn", class:"modal-close-btn"});
    // For the "X" button in the modal window.
    button.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(modal_container);
        modal_container.removeChild(modal_btn_container);
    });

    const info_container = createNewElement('DIV', "", {class:'modal-info-container'});
    modal.append(button, info_container);

    // employee[0] -> index was included so that we only give the necessary information.
    add_information_to_modal_window(employee[0]);

}

/* 
If a user 
    a.) Starts typing into the search textbox.
    b.) Types something and clicks the "Search" button.
Different employee cards will disappear or reappear.
*/
function hide_or_display_employees(typed_name) {
    const all_card_divs = document.getElementById('gallery');
    const people = all_card_divs.children;
    for (let i = 0; i < people.length; i++) {
        const item = people[i];
        const name = item.querySelector('#name');
        if (name.textContent.includes(typed_name.toLowerCase())) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    }
}

/************************
   Program starts here 
************************/
create_search_markup();

getRandomUsers(random_url)
  .then(create_gallery_markup)
  .catch(err => console.log(err))


// Search Button (top-right corner of page)
document.getElementById('serach-submit').addEventListener('click', function(e) {
    e.preventDefault();
    let user_input = document.getElementById('search-input').value;
    hide_or_display_employees(user_input);
});

// Text Box for the Search Button (top-right corner of page)
document.getElementById('search-input').addEventListener('keyup', function(event) {
    let user_input = document.getElementById('search-input').value;
    hide_or_display_employees(user_input);
});









