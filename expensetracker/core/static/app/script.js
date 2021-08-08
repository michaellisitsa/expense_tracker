// This script not required as changed to Django templates (serve-side rendered)

/*  
    On submitting the form, send an AJAX post request to the server
    and submit after successful submission.
*/

expensePeriodForm = document.querySelector("#ExpensePeriodForm")
asyncBtn = document.querySelector("#asyncBtn")

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