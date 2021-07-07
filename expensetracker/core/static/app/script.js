// import FormValidator from './validation.js';
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

//Get all variables
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const historyCardsEl = document.getElementById('history-card-container');
const addTransactionForm = document.getElementById('add-transaction-form');
const transactTextEl = document.getElementById('transact-text');
const transactAmountEl = document.getElementById('transact-amount');
const balanceEl = document.getElementById('balance');
const radioContainerEl = document.getElementById('radio');

const fields = ['transact-text', 'transact-amount'];

const validator = new FormValidator(addTransactionForm, fields);
validator.initialize();

//Initialise arrays to be connected to database later
const database = [];

//Function to update account summary (income/expenses)
function updateAccount() {
  //Update summary income / expense amounts
  const incomeTot = database
    .filter((db) => parseFloat(db.amount) >= 0)
    .reduce((sum, record) => sum + record.amount, 0);
  const expensesTot = database
    .filter((db) => parseFloat(db.amount) < 0)
    .reduce((sum, record) => sum + record.amount, 0);
  incomeEl.innerHTML = `<h3>INCOME:</h3><p>${incomeTot}</p>`;
  expensesEl.innerHTML = `<h3>EXPENSES:</h3><p>${expensesTot}</p>`;

  //Begin by clearing any elements within
  historyCardsEl.innerHTML = '';

  //Update history cards with all transactions
  database.forEach((db) => {
    // let amount = db.amounts;
    const transaction = document.createElement('div');
    transaction.classList = 'history-card';
    transaction.innerHTML = `<strong>${db.description}</strong>
                            <p>${db.amount}</p>`;
    historyCardsEl.appendChild(transaction);

    //Based on transaction value, set border
    transaction.setAttribute(
      'style',
      `border-right: 6px solid ${db.amount >= 0 ? 'green' : 'red'}`
    );

    //Update balance
    balanceEl.innerText = `$${incomeTot + expensesTot}`;
  });
}

addTransactionForm.onsubmit = addTransaction;

//Function to add transactions to the array, and rerun the update function.
function addTransaction(event) {
  event.preventDefault();
  database.push({
    description: transactTextEl.value,
    amount: parseFloat(transactAmountEl.value),
  });
  // descriptionArr.push(transactTextEl.value);
  // amountsArr.push(parseFloat(transactAmountEl.value));
  updateAccount();
}

const expenseItems = [
  {
    value: 'Electricity/Gas',
    id: 'elecGas',
  },
  {
    value: 'Mobile',
    id: 'mobile',
  },
  {
    value: 'Internet',
    id: 'internet',
  },
  {
    value: 'Water',
    id: 'water',
  },
  {
    value: 'Groceries',
    id: 'groceries',
  },
  {
    value: 'Health Insurance',
    id: 'healthInsurance',
  },
];

// Function to add expense types to the array, re-update the sidebar.
// TODO implement adding expenses

//Function to set multiple attributes at once. Object.entries in EC8 allows not having to lookup one of key or value by index
// https://stackoverflow.com/questions/12274748/setting-multiple-attributes-for-an-element-at-once-with-javascript#comment119120551_12274782
function setAttributes(el, attrs) {
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function createExpenseType(expense) {
  const expenseInputEl = document.createElement('input');
  setAttributes(expenseInputEl, {
    class: 'radio__input',
    value: expense.value,
    type: 'radio',
    name: 'expense_type',
    id: expense.id,
  });
  const expenseLabelEl = document.createElement('label');
  setAttributes(expenseLabelEl, {
    for: expense.id,
    class: 'radio__label',
  });
  expenseLabelEl.innerText = expense.value;
  return {
    expenseInputEl,
    expenseLabelEl,
  };
}

function updateExpenseType() {
  expenseItems.forEach((expense) => {
    let expenseItem = createExpenseType(expense);
    radioContainerEl.appendChild(expenseItem.expenseInputEl);
    radioContainerEl.appendChild(expenseItem.expenseLabelEl);
  });
}

updateExpenseType();
updateAccount();
