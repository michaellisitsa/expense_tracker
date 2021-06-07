//Get all variables
incomeEl = document.getElementById('income');
expensesEl = document.getElementById('expenses');
historyCardsEl = document.getElementById('history-cards');

//Initialise arrays with transaction name and values:
descriptionArr = ['Income1', 'Income2', 'Income3', 'Expenses'];
amountsArr = [4, 5, 7, -1];

//Function to update account summary (income/expenses)
function updateAccount(amounts) {
  //Update summary income / expense amounts
  incomeEl.innerHTML = `<h3>INCOME:</h3><p>${amounts
    .filter((amount) => parseFloat(amount) >= 0)
    .reduce((sum, record) => sum + record)}</p>`;
  expensesEl.innerHTML = `<h3>EXPENSES:</h3><p>${amounts
    .filter((amount) => parseFloat(amount) < 0)
    .reduce((sum, record) => sum + record)}</p>`;

  //Update history cards with all transactions

  descriptionArr.forEach((description, index) => {
    let amount = amountsArr[index];
    transaction = document.createElement('div');
    transaction.classList = 'transaction-card';
    transaction.innerHTML = `<strong>${description}</strong>
                            <p>${amount}</p>`;
    historyCardsEl.appendChild(transaction);
    transaction.setAttribute(
      'style',
      `border-right: 6px solid ${amount >= 0 ? 'green' : 'red'}`
    );

    //Based on transaction value, set border
  });

  // amounts.forEach((amount) => {
  //   incomeAmt.innerText += amount;
  //   console.log(amount);
  //   return;
  // });
}

updateAccount(amountsArr, descriptionArr);
