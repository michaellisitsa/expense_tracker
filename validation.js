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
      self.fields.forEach((field) => {
        const input = document.querySelector(`#${field}`);
        self.validateFields(input);
      });
    });
  }

  validateOnEntry() {
    let self = this;
    this.fields.forEach((field) => {
      const input = document.querySelector(`#${field}`);

      input.addEventListener('input', (event) => {
        self.validateFields(input);
      });
    });
  }

  validateFields(field) {
    // Check presence of values
    if (field.value.trim() === '') {
      this.setStatus(
        field,
        `${field.previousElementSibling.innerText} cannot be blank`,
        'error'
      );
    } else {
      this.setStatus(field, null, 'success');
    }

    // check that it is a number
    if (field.id === 'transact-amount') {
      if (field.value.trim() === '') {
        this.setStatus(
          field,
          `${field.previousElementSibling.innerText} cannot be blank`,
          'error'
        );
      } else if (isNaN(field.value)) {
        this.setStatus(field, 'Please enter a number', 'error');
      } else {
        this.setStatus(field, null, 'success');
      }
    }
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

const form = document.querySelector('#add-transaction-form');
const fields = ['transact-text', 'transact-amount'];

const validator = new FormValidator(form, fields);
validator.initialize();
