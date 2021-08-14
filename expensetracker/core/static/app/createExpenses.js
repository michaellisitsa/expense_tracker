let expenseFormset = document.querySelectorAll(".expense-formset")
let container = document.querySelector("#form-container")
let addButton = document.querySelector("#add-form")
let totalForms = document.querySelector("#id_expense_set-TOTAL_FORMS")

// Functionality for adding extra entries into the formset
let formNum = expenseFormset.length - 1 // Get the num of the last form on the page

addButton && addButton.addEventListener('click',addForm)

function addForm(e) {
    e.preventDefault()

    let newForm = expenseFormset[0].cloneNode(true)  // Clone the last form
    let formRegex = RegExp(`expense_set-(\\d){1}-`,'g') // Regex to find all instances of the form number
    
    formNum++ // Increment the form number
    newForm.innerHTML = newForm.innerHTML.replace(formRegex, `expense_set-${formNum}-`)
    container.insertBefore(newForm, addButton)
    
    totalForms.setAttribute('value',`${formNum+1}`) // Increment the total number of forms in the hidden input 
    let newInputs = newForm.querySelectorAll("input:not([type=hidden])")
    newInputs.forEach(input => input.value = '')
}
