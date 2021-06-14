//Vanilla JS validation
//https://web-crunch.com/posts/vanilla-javascript-form-validation

class FormValidator {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
  }

  initialize() {
    this.validateOnEntry();
    this.validateOnSubmit();
  }

  validateOnSubmit() {
    let self = this;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      // get a list of input elements with validation, and then check if any of them have an errorState
      let error = self.fields
        .map((field) => document.querySelector(`#${field}`))
        .some((element) => self.validateFields(element) === true);
    });
  }

  validateOnEntry() {
    let self = this;

    function submitEnabled() {
      let error = self.fields
        .map((field) => document.querySelector(`#${field}`))
        .some((element) => self.validateFields(element) === true);
      console.log(error);
      const submitEl = document.getElementById('submit');
      if (error) {
        submitEl.setAttribute('disabled', '');
      } else if (!error && submitEl.hasAttribute('disabled')) {
        submitEl.removeAttribute('disabled');
      }
    }

    self.fields.forEach((field) => {
      const input = document.querySelector(`#${field}`);
      input.addEventListener('input', (event) => {
        submitEnabled();
      });
    });
  }

  validateFields(field) {
    let errorState = false;

    // Check presence of values
    if (field.id === 'transact-text') {
      if (field.value.trim() === '') {
        this.setStatus(
          field,
          `${field.previousElementSibling.innerText} cannot be blank`,
          'error'
        );
        errorState = true;
      } else {
        this.setStatus(field, null, 'success');
      }
    }

    // check that it is a number
    // Note that let and const are scoped within if statements,
    // hence why it wasn't working to redeclare errorState using let
    // https://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/
    if (field.id === 'transact-amount') {
      if (field.value.trim() === '') {
        this.setStatus(
          field,
          `${field.previousElementSibling.innerText} cannot be blank`,
          'error'
        );
        errorState = true;
      } else if (isNaN(field.value)) {
        this.setStatus(field, 'Please enter a number', 'error');
        errorState = true;
      } else {
        this.setStatus(field, null, 'success');
      }
    }
    return errorState;
  }

  setStatus(field, message, status) {
    const successIcon = field.parentElement.querySelector('.icon-success');
    const errorIcon = field.parentElement.querySelector('.icon-error');
    const errorMessage = field.parentElement.querySelector('.error-message');

    if (status === 'success') {
      if (errorIcon) {
        errorIcon.classList.add('hidden');
      }
      if (errorMessage) {
        errorMessage.innerText = '';
      }
      successIcon.classList.remove('hidden');
      field.classList.remove('input-error');
    }

    if (status === 'error') {
      if (successIcon) {
        successIcon.classList.add('hidden');
      }
      field.parentElement.querySelector('.error-message').innerText = message;
      errorIcon.classList.remove('hidden');
      field.classList.add('input-error');
    }
  }
}

export default FormValidator;
