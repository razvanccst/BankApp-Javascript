'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Razvan Constantin',
  movements: [1000, -300, 2000, -700, -1025, 200],
  interestRate: 1.2,
  pin: 123,
};

const account2 = {
  owner: 'Interviewer',
  movements: [500, -200, 13000, -7000, -25, 200, -70, -4000, 380],
  interestRate: 1.0,
  pin: 1234,
};

const account3 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account4 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account5 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account6 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//fjll the movements Divs with array data

const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = '';

  const movsAscending = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  const filter = sort ? movsAscending : movements;

  filter.forEach(function (currentMovement, index) {
    const type = currentMovement > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__value">${currentMovement}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Create Usernames by name initials of each account owner

const createUserNames = function (accountsArr) {
  accountsArr.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

//Update ui with

const updateUI = function (accounts) {
  //Display summary
  calcDisplaySummary(accounts);
  //Display balance
  calcDisplayBalance(accounts);
  //Display movements1
  displayMovements(accounts.movements);
};

// calculate and display incomes, outcomes and interest
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(arrElement => arrElement > 0)
    .reduce((sum, currentValue) => sum + currentValue, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(arrElement => arrElement < 0)
    .reduce((sum, currentValue) => sum + currentValue, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  //adding a interest of 1.2% on each deposit
  const interest = account.movements
    .filter(arrElement => arrElement > 0)
    .map(intRate => (intRate * 1.2) / 100)
    .reduce((sum, interest) => sum + account.interestRate, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//Calculate and display balance of specific user

const calcDisplayBalance = function (account) {
  let balance = account.movements.reduce(function (sum, currentValue) {
    return sum + currentValue;
  });
  account.balance = balance;
  labelBalance.textContent = `${account.balance}€`;
};

//Event Handlers
//LOGIN SYSTEM
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display welcome message in UI
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}`;
    //Display application to user
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  } else {
    labelWelcome.textContent = 'Wrong username or pin';
    containerApp.style.opacity = 0;
  }
  //Update UI
  updateUI(currentAccount);
});

// TRANSFER

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //Clear input fields
  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  // Verify balance of current account, if the receiver account exists, if is a available balance and if the current account is not the same as the receiver account

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // extract from currentacount
    currentAccount.movements.push(-amount);
    // add to receiver account
    receiverAccount.movements.push(amount);

    updateUI(currentAccount);
  }
});

// LOAN only 10% of the biggest deposit

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    //updating UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

// CLOSE ACCOUNTS

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});

// SORT Transactions
let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});
