'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//tyring create a function that uploads data

let sorted = false;

btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovement(currentAccount.movements , !sorted);
  sorted = !sorted
})

const displayMovement = function(accounts, sort = false) {
   containerMovements.innerHTML = '';

  const movs = sort ? accounts.slice().sort((a,b) => a-b): accounts;

  movs.forEach(function(mov,i){

    const type= mov >0 ? 'deposit': 'withdrawal' ;
    const html =`
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i +1} ${type}
          </div>
          <div class="movements__value">${mov}</div>
        </div> `;

        containerMovements.insertAdjacentHTML('afterbegin', html)
  });
};



//displayMovement(account1.movements)
///////////////////////////////////


const calcDisplaySummary = function (acc){

  //console.log(acc)

  const incomes = acc.filter(mov => mov > 0).reduce((acc,mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}$`;

  const out = acc.filter(mov => mov < 0).reduce((acc,mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}$`;

  const interest = acc.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate /100).filter((int,i,arr) => int>1 ).reduce((acc,int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}$`;

};

calcDisplaySummary(account1.movements);


////////////////////////////////////////////////


const balanceMoney = function(mov){
  const bal = mov.reduce((acc , movv) => acc + movv,0 )

  labelBalance.textContent = `${bal}$` ;

};

//balanceMoney(account1.movements);

/////////////////////////////////////////////


const createUsername = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split('')
    .map(name => name[0])
    .join('');
  })
}

createUsername(accounts);

const updateUI = function(accs){
///movements
 displayMovement(accs.movements);
///balance
balanceMoney(accs.movements)
///summary
calcDisplaySummary(accs.movements)
}

let currentAccount ;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.owner === inputLoginUsername.value);

  if(currentAccount.pin === Number(inputLoginPin.value)) {
    /// Ui
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`
    inputLoginUsername.value=inputLoginPin.value= '';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;

    updateUI(currentAccount);
  }
  console.log(currentAccount);
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(acc => acc.owner === inputTransferTo.value);



  if(amount > 0 && recieverAcc && currentAccount.balance >= amount && receiverAcc?.owner !== currentAccount.onwer){
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);


    updateUI(currentAccount)
  }


})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
      console.log(currentAccount.movements)

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function(e){

  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.owner && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.owner === currentAccount.owner);

    accounts.splice(index, 1);

    containerApp.style.opacity=0;
  }

  inputCloseUsername.value = inputClosePin.value= '';
})
