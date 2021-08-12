// This script not required as changed to Django templates (serve-side rendered)

/*  
    On submitting the form, send an AJAX post request to the server
    and submit after successful submission.
*/

expensePeriodForm = document.querySelector("#ExpensePeriodForm")
asyncBtn = document.querySelector("#asyncBtn")
asyncBtn = document.querySelector("#asyncDeleteBtn")

let expenseFormset = document.querySelectorAll(".expense-formset")
let container = document.querySelector("#form-container")
let addButton = document.querySelector("#add-form")
let totalForms = document.querySelector("#id_form-TOTAL_FORMS")

// expensePeriodForm.onsubmit = submitForm

function submitForm (e) {
    e.preventDefault();
    const formData = new FormData(this); // reference to form element
    const data = {}; // need to convert it before using not with XMLHttpRequest
    for (let [key, val] of formData.entries()) {
        Object.assign(data, { [key]: val })
      }
    console.log(data);
    axios.post('https://jsonplaceholder.typicode.com/posts', data)
    .then(res => console.log(res.request.response))
}

data = JSON.stringify({
    name: 'API Category',
    assignee: 'API Assignee',
    description: 'API description',
    groupTransactions: true,
})

// Get the cookie for the csrf token, needed for API POST requests
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
if (asyncBtn) {
    asyncBtn.onclick = asyncFormSubmit
}

// Making a post request
// Stack Overflow:
// https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
function asyncFormSubmit (e) {
    fetch('http://0.0.0.0:5000/api/expenseCategory/', {
    method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': "application/json",
        'X-CSRFToken': csrftoken 
    },
    body: data
    }).then(res=>res.json())
      .then(res => console.log(res));
}

// Making a delete request

if (asyncDeleteBtn) {
    asyncDeleteBtn.onclick = asyncFormDelete
}

function asyncFormDelete (e) {
    fetch('http://0.0.0.0:5000/api/expenseCategory/4', {
    method: 'delete',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': "application/json",
        'X-CSRFToken': csrftoken 
    },
    }).then(res=>res.text())
      .then(res => console.log(res));
}

// Functionality for adding extra entries into the formset
let formNum = expenseFormset.length - 1 // Get the num of the last form on the page

addButton && addButton.addEventListener('click',addForm)

function addForm(e) {
    e.preventDefault()

    let newForm = expenseFormset[0].cloneNode(true)  // Clone the last form
    let formRegex = RegExp(`form-(\\d){1}-`,'g') // Regex to find all instances of the form number

    formNum++ // Increment the form number
    newForm.innerHTML = newForm.innerHTML.replace(formRegex, `form-${formNum}-`)
    container.insertBefore(newForm, addButton)

    totalForms.setAttribute('value',`${formNum+1}`) // Increment the total number of forms in the hidden input 

}