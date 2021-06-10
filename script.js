//Get all variables
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const historyCardsEl = document.getElementById('history-card-container');
const addTransactionForm = document.getElementById('add-transaction-form');
const transactTextEl = document.getElementById('transact-text');
const transactAmountEl = document.getElementById('transact-amount');
const balanceEl = document.getElementById('balance');

//Initialise arrays with transaction name and values:
const database = [
  {
    description:"Income1",
    amount:4,
  },
  {
    description:"Income1",
    amount:-3,
  }
]

//Function to update account summary (income/expenses)
function updateAccount() {
  //Update summary income / expense amounts
  incomeTot = database
    .filter((db) => parseFloat(db.amount) >= 0)
    .reduce((sum, record) => sum + record.amount,0);
  expensesTot = database
    .filter((db) => parseFloat(db.amount) < 0)
    .reduce((sum, record) => sum + record.amount,0);
  incomeEl.innerHTML = `<h3>INCOME:</h3><p>${incomeTot}</p>`;
  expensesEl.innerHTML = `<h3>EXPENSES:</h3><p>${expensesTot}</p>`;

  //Begin by clearing any elements within
  historyCardsEl.innerHTML = '';

  //Update history cards with all transactions
  database.forEach((db) => {
    // let amount = db.amounts;
    transaction = document.createElement('div');
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
  database.push(  {
    description:transactTextEl.value,
    amount:parseFloat(transactAmountEl.value),
  })
  // descriptionArr.push(transactTextEl.value);
  // amountsArr.push(parseFloat(transactAmountEl.value));
  updateAccount();
}

updateAccount();
