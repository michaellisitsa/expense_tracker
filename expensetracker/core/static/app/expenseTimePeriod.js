// This script not required as changed to Django templates (serve-side rendered)

/*  
    On submitting the form, send an AJAX post request to the server
    and submit after successful submission.
*/

(data = JSON.stringify({
  name: "API Category",
  assignee: "API Assignee",
  budget: "100",
  description: "API description",
  user: "1",
})),
  // Get the cookie for the csrf token, needed for API POST requests
  // https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };
const csrftoken = getCookie("csrftoken");

// Making a post request
// Stack Overflow:
// https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
function asyncFormSubmit(e) {
  fetch("/api/expenseTimePeriod/", {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
}

// Making a delete request
function asyncFormDelete(id) {
  fetch(`/api/expenseTimePeriod/${id}`, {
    method: "delete",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  })
    .then((res) => res.text())
    .then((res) => console.log(res))
    .then(() => updateDeletedUI(id));
}

// Register button by id
const deleteBtns = document.querySelectorAll(".deleteBtn");

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", function (e) {
    asyncFormDelete(this.id);
  });
});

const updateDeletedUI = (id) => {
  deletedCard = document.getElementById(`${id}-wrapper`);
  deletedCard.parentNode.removeChild(deletedCard);
};

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
const selectElement = document.querySelector("#categoryField");

selectElement.addEventListener("change", (event) => {
  const categorySelectedDynamic = document.querySelector(
    `input.categoryRadioSelect[value='${event.target.value}']`
  );
  categorySelectedDynamic.checked = true;
  // const result = document.querySelector('.result');
  // result.textContent = `You like ${event.target.value}`;
});

const queryString = window.location.search;
if (queryString != "") {
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");
  const categorySelected = document.querySelector(
    `input.categoryRadioSelect[value='${category}']`
  );
  categorySelected.checked = true;
}
