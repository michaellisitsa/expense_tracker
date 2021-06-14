import FormValidator from './validation.js';

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
