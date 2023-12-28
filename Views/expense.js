

async function refresh() {
    try {
        let token = localStorage.getItem('token');
        let result = await axios.get("http://localhost:3000/expenses", { headers: { "Authorization": token } });
        for (let i = 0; i < result.data.expenses.length; i++) {
            showExpenseOnScreen(result.data.expenses[i]);
        }

    } catch (error) {
        console.log(error);
    }
}
refresh()
function addExpense(event) {
    event.preventDefault();
    // Retrieve values from the form fields
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;

    let obj = {
        category, description, price
    }

    storeExpenses(obj);
}

async function storeExpenses(obj) {
    try {
        let token = localStorage.getItem("token")
        let expense = await axios.post("http://localhost:3000/expenses", obj, { headers: { "Authorization": token } })
        showExpenseOnScreen(expense.data.result);
    } catch (error) {
        document.body.innerHTML += `<div style="color:red;">${error.response.data.err}</div>`;

    }
}

function showExpenseOnScreen(obj) {
    let parentEle = document.getElementById("parent");
    let childEle = document.createElement("li");
    childEle.textContent = `${obj.category}:  ${obj.description} ${obj.price}/-`;
    childEle.className = "list-group-item";
    childEle.style.backgroundColor = "black";
    childEle.style.color = "white"
    parentEle.appendChild(childEle);

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm float-right delete';
    deleteBtn.appendChild(document.createTextNode('DELETE EXPENSE'));
    childEle.appendChild(deleteBtn);

    deleteBtn.onclick = async () => {
        parentEle.removeChild(childEle);
        try {
            let token = localStorage.getItem('token');
            await axios.delete("http://localhost:3000/deleteExpense/" + obj.id, { headers: { "Authorization": token } });
        } catch (error) {
            console.log("Error")
        }
    }

}
async function premiumUser(event) {
    try {
        let token = localStorage.getItem("token");
        let res = await axios.get("http://localhost:3000/premiumMembership", { headers: { "Authorization": token } });
        console.log(res.data);
        let options = {
            key: res.data.key_id,
            orderid: res.data.order.id,
            handler: async function (res) {
                const response = await axios.post("http://localhost:3000/updateTransaction", {
                    orderId: options.orderid,
                    payment_id: res.razorpay_payment_id
                }, { headers: { "Authorization": token } });
                alert("You are a PREMIUM USER now!");
            }
        }
        console.log(options);
        let rzp1 = new Razorpay(options)
        rzp1.open();
        event.preventDefault()
        rzp1.on("payment.failed", (response) => { alert("Something went wrong.") });
    } catch (error) {
    }
}
function Logout(event) {
    localStorage.removeItem("token");
}

