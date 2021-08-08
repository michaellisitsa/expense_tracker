// This script not required as changed to Django templates (serve-side rendered)

/*  
    On submitting the form, send an AJAX post request to the server
    and submit after successful submission.
*/

expensePeriodForm = document.querySelector("#ExpensePeriodForm")

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