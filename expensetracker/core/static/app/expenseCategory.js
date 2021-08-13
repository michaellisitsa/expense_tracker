// This script not required as changed to Django templates (serve-side rendered)

/*  
    On submitting the form, send an AJAX post request to the server
    and submit after successful submission.
*/

expensePeriodForm = document.querySelector("#ExpensePeriodForm")
asyncBtn = document.querySelector("#asyncBtn")
asyncDeleteBtn = document.querySelector("#asyncDeleteBtn")

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
asyncBtn.onclick = asyncFormSubmit

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

asyncDeleteBtn.onclick = asyncFormDelete

// Making a delete request
function asyncFormDelete (e) {
    fetch('http://0.0.0.0:5000/api/expenseCategory/3', {
    method: 'delete',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': "application/json",
        'X-CSRFToken': csrftoken 
    },
    }).then(res=>res.text())
      .then(res => console.log(res));
}