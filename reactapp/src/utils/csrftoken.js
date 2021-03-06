// Get the cookie for the csrf token, needed for API POST requests
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
const getCookie = (name) => {
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

const CSRFTOKEN = getCookie("csrftoken");

// // below method only valid when you are "POSTING" the form, not React's paradigm of separate fetch request.
// function CSRFTOKEN() {
//   return <input name="csrfmiddlewaretoken" value={csrftoken} type="hidden" />;

export { CSRFTOKEN };
