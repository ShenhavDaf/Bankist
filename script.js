'use strict';

const account0 = {
  owner: 'Try',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 90, -99],
  interestRate: 1.2, // %
  pin: 123,
};

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account0, account1, account2, account3, account4];

/*--------------------DOM Elements----------------------*/

// Labels
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

// Containers (main & div tags)
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

// Buttons
const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.logout__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

// Inputs / Textareas
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/*######################################################*/

// Global variables
let currAccount;

/*---------------------Functions-----------------------*/
// Creates a username for each account consisting of the first letter of the first name and the first letter of the last name
const createUserNames = function (accountArray) {
  accountArray.forEach(function (user) {
    user.userName = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
//call this function
createUserNames(accounts);

const displayMovments = function (movements) {
  /*  
  Empty the movments container.
  'innerHTML' is like the 'textContent'. 
  The differance is that 'textContent' return the text himself, 'innerHTML' return evrything including in the HTML.
  Here we use it like a 'setter'.
  */
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    (${i + 1}) &nbsp&nbsp&nbsp&nbsp
      <div class="movements__type movements__type--${type}"> ${type} </div>
      <div class="movements__value">${mov} €</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${account.balance} €`;
};

const calcDisplaySummary = function (account) {
  labelSumIn.textContent = `${account.movements
    .filter(mov => mov > 0)
    .reduce((sum, curr) => (sum += curr), 0)} €`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((sum, curr) => (sum += curr), 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  //The cost of borrowing money
  labelSumInterest.textContent = `${account.movements
    .filter(mov => mov > 0)
    .map(deposit => (account.interestRate * deposit) / 100)
    .filter(inter => inter >= 1)
    .reduce((acc, inter) => acc + inter, 0)} €`;
};

const updateUI = function (account) {
  displayMovments(account.movements);
  calcDisplayBalance(account);
  calcDisplaySummary(account);

  inputTransferTo.value = '';
  inputTransferTo.blur();

  inputTransferAmount.value = '';
  inputTransferAmount.blur();

  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  inputCloseUsername.value = '';
  inputCloseUsername.blur();

  inputClosePin.value = '';
  inputClosePin.blur();
};

/*-------------------Event handlers---------------------*/

const logoutFunc = function (event) {
  event.preventDefault();
  inputLoginUsername.disabled = false;
  inputLoginUsername.value = '';
  inputLoginPin.disabled = false;
  inputLoginPin.value = '';

  btnLogin.hidden = false;
  btnLogout.hidden = true;

  containerApp.style.opacity = 0;

  btnLogin.style.color = 'black';
  btnLogin.innerHTML = '&#10148;';

  labelWelcome.textContent = 'Log in to get started';
};

btnLogout.addEventListener('click', logoutFunc);

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currAccount = accounts.find(
    account =>
      account.owner === inputLoginUsername.value ||
      account.userName === inputLoginUsername.value
  );

  if (currAccount?.pin === Number(inputLoginPin.value)) {
    // btnLogin.style.color = 'lightgreen';
    // btnLogin.innerHTML = '✔';
    inputLoginUsername.disabled = true;
    inputLoginPin.disabled = true;
    btnLogin.hidden = true;
    btnLogout.hidden = false;

    //Display UI & messages

    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    updateUI(currAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const reciveAccount = accounts.find(
    acc =>
      acc.owner === inputTransferTo.value ||
      acc.userName === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (
    reciveAccount &&
    amount > 0 &&
    currAccount.balance >= amount &&
    reciveAccount.owner !== currAccount.owner
  ) {
    currAccount.movements.push(-amount);
    reciveAccount.movements.push(amount);
    updateUI(currAccount);
  } else alert('Somthing wrong!\nTry again..');
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {
    currAccount.movements.push(amount);
    updateUI();
  }
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currAccount.userName ||
    (inputCloseUsername.value === currAccount.owner &&
      Number(inputClosePin.value) === currAccount.pin)
  ) {
    const index = accounts.findIndex(acc => acc.owner === currAccount.owner);
    accounts.splice(index, 1);

    logoutFunc(event);
  }
});

let sortFlag = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (!sortFlag) {
    sortFlag = true;
    displayMovments(currAccount.movements.slice().sort((m1, m2) => m1 - m2));
  } else {
    sortFlag = false;
    displayMovments(currAccount.movements);
  }
});
