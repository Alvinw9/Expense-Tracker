const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amountEarned');
const amountSpent = document.getElementById('amountSpent');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  var dateString = "<br>" + (month+1) + "-" + date + "-" + year + "<br>";

  if (text.value.trim() === '' || (amount.value.trim() === '' && amountSpent.value.trim() === '')) {
    alert('Please add an item and amount');
  } else if (amount.value.trim() !== '' && amountSpent.value.trim() !== '')  {
    alert('Please only enter amount earned or amount spent');
  } else if (amountSpent.value.trim() === '') {
    text.value = text.value + dateString;
    earned();   
  } else {
    text.value = text.value + dateString;
    spent();
  }
}

// Amount earned
function earned() {
  
  var amounts = transactions.map(transaction => transaction.amount);
  var total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  var newAmount = +amount.value;
  var newTotal = parseFloat(total) + parseFloat(newAmount);

  const transaction = {
    id: generateID(),
    text: text.value + `$${newTotal}`,
    amount: +amount.value
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);

  updateValues();

  updateLocalStorage();

  text.value = '';
  amount.value = '';

}

// Amount spent
function spent() {

  var amounts = transactions.map(transaction => transaction.amount);
  var total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  var newAmount = -amountSpent.value;
  var newTotal = parseFloat(total) + parseFloat(newAmount);
  
  const transaction = {
    id: generateID(),
    text: text.value + `$${newTotal}`,
    amount: -amountSpent.value
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);

  updateValues();

  updateLocalStorage();

  text.value = '';
  amountSpent.value = '';


}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span><br>${sign}$${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.insertBefore(item, list.childNodes[0]);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
