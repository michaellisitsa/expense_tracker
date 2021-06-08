//Get all variables
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const historyCardsEl = document.getElementById('history-cards');
const addTransactionForm = document.getElementById('add-transaction-form');
const transactTextEl = document.getElementById('transact-text');
const transactAmountEl = document.getElementById('transact-amount');

//Initialise arrays with transaction name and values:
const descriptionArr = ['Income1', 'Income2', 'Expense1', 'Expenses2'];
const amountsArr = [4, 5, -5, -1];

//Function to update account summary (income/expenses)
function updateAccount() {
  //Update summary income / expense amounts
  incomeEl.innerHTML = `<h3>INCOME:</h3><p>${amountsArr
    .filter((amount) => parseFloat(amount) >= 0)
    .reduce((sum, record) => sum + record)}</p>`;
  expensesEl.innerHTML = `<h3>EXPENSES:</h3><p>${amountsArr
    .filter((amount) => parseFloat(amount) < 0)
    .reduce((sum, record) => sum + record)}</p>`;

  //Begin by clearing any elements within
  historyCardsEl.innerHTML = '';

  //Update history cards with all transactions
  descriptionArr.forEach((description, index) => {
    let amount = amountsArr[index];
    transaction = document.createElement('div');
    transaction.classList = 'transaction-card';
    transaction.innerHTML = `<strong>${description}</strong>
                            <p>${amount}</p>`;
    historyCardsEl.appendChild(transaction);

    //Based on transaction value, set border
    transaction.setAttribute(
      'style',
      `border-right: 6px solid ${amount >= 0 ? 'green' : 'red'}`
    );
  });
}

addTransactionForm.onsubmit = addTransaction;

//Function to add transactions to the array, and rerun the update function.
function addTransaction(event) {
  event.preventDefault();
  descriptionArr.push(transactTextEl.value);
  amountsArr.push(parseFloat(transactAmountEl.value));
  updateAccount();
}

updateAccount();
