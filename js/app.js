class UI {
  constructor() {
    this.budgetFeedBack = document.querySelector(".budget-feedback");
    this.expenseFeedBack = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  // submit budget form
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (value === "" || value < 0) {
      // message error
      this.budgetFeedBack.classList.add("showItem");
      this.budgetFeedBack.innerHTML = `
        <p>value cannot be empty or negative</p>
      `;
      setTimeout(() => {
        this.budgetFeedBack.classList.remove("showItem");
      }, 4000);
    } else {
      // all correct
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this.showBalance();
    }
  }
  // submit expense form
  submitExpenseForm() {
    const name = this.expenseInput.value;
    const value = this.amountInput.value;
    if (name === "" || value === "" || value < 0) {
      // message error
      this.expenseFeedBack.classList.add("showItem");
      this.expenseFeedBack.innerHTML = `
         <p>value cannot be empty or negative</p>
       `;
      setTimeout(() => {
        this.expenseFeedBack.classList.remove("showItem");
      }, 4000);
    } else {
      // all correct
      let amount = parseInt(value);
      this.expenseInput.value = "";
      this.amountInput.value = "";

      let expense = {
        id: this.itemID,
        title: name,
        amount
      };
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }
  // add expense
  addExpense(expense) {
    const expenseContainer = document.createElement("tr");
    expenseContainer.classList.add("expense");
    expenseContainer.innerHTML = `
      <td class="cell" data-title="Title">
        ${expense.title}
      </td>
      <td class="cell" data-title="Balue">
        ${expense.amount}
      </td>
      <td class="cell" data-title="Action">
        <div class="icons-action">      
          <a
            href="#"
            data-id="${expense.id}"
            class="edit">
            <i class="icon-edit"></i>
          </a>
          <a
            href="#"
            data-id="${expense.id}"
            class="edit">
            <i class="icon-delete"></i>
          </a>
        </div>
      </td>
    `;
    this.expenseList.appendChild(expenseContainer);
  }
  // total expese
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((prev, curr) => {
        prev += curr.amount;
        return prev;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }
  // show balance
  showBalance() {
    const budget = parseInt(this.budgetAmount.textContent);
    const expense = this.totalExpense();
    const total = budget - expense;
    this.balanceAmount.textContent = total;
    // Comparation
    if (total < 0) {
      this.balance.classList.remove("showCorrect");
      this.balance.classList.add("showDanger");
    } else if (total > 0) {
      this.balance.classList.add("showCorrect");
      this.balance.classList.remove("showDanger");
    } else {
      this.balance.classList.add("showCorrect", "showDanger");
      this.balance.classList.remove("showNormal");
    }
  }
  // edit expense
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    // remove from DOM
    this.expenseList.removeChild(parent);
    // show value
    let expese = this.itemList.filter(item => {
      return item.id === id;
    });
    this.expenseInput.value = expese[0].title;
    this.amountInput.value = expese[0].amount;
    // remove from the list
    let tempList = this.itemList.filter(item => {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
  // delete expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    // remove from DOM
    this.expenseList.removeChild(parent);
    // remove from the list
    let tempList = this.itemList.filter(item => {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  //   new instance of ui class
  const ui = new UI();
  // budget form submit
  budgetForm.addEventListener("submit", e => {
    e.preventDefault();
    ui.submitBudgetForm();
  });
  // expense form submit
  expenseForm.addEventListener("submit", e => {
    e.preventDefault();
    ui.submitExpenseForm();
  });
  // expense click
  expenseList.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.parentElement.classList.contains("edit")) {
      ui.editExpense(e.target.parentElement);
    } else if (e.target.parentElement.classList.contains("delete")) {
      ui.deleteExpense(e.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  eventListeners();
});
