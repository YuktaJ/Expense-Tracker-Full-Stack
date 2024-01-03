let leaderBoardBtn = document.createElement("button");
leaderBoardBtn.appendChild(document.createTextNode("Leader Board"));
leaderBoardBtn.className = "btn btn-warning";


let downloadBtn = document.createElement("button");
downloadBtn.appendChild(document.createTextNode("Download Expenses"));
downloadBtn.className = "btn btn-success";

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}


async function refresh() {
    let token = localStorage.getItem('token');
    var parsedToken = parseJwt(token);
    var isPremium = parsedToken.isPremium;

    if (isPremium === true) {
        let li = document.createElement("li");
        li.textContent = "You are a premium user"
        li.className = "list-group-item"
        document.getElementById("premiumBtn").replaceWith(li);
        document.body.appendChild(leaderBoardBtn);
        document.getElementById("addexp").after(downloadBtn);
    }
    try {
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
        let res = await axios.get("http://localhost:3000/premiumMembership",
            { headers: { "Authorization": token } });
        console.log(res.data);
        var options = {
            key: res.data.key_id,
            orderid: res.data.order.id,
            handler: async function (res) {
                const response = await axios.post("http://localhost:3000/updateTransaction",
                    {
                        orderId: options.orderid,
                        payment_id: res.razorpay_payment_id
                    },
                    { headers: { "Authorization": token } });
                alert("You are a PREMIUM USER now!");
                let li = document.createElement("li");
                li.textContent = "You are a premium user"
                li.className = "list-group-item"
                document.getElementById("premiumBtn").replaceWith(li);
                localStorage.setItem("token", response.data.token);
            }
        }
        console.log(options);
        let rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault()
        rzp1.on("payment.failed", (response) => { alert("Something went wrong.") });
    } catch (error) {
    }
}
function Logout(event) {
    localStorage.removeItem("token");
}

leaderBoardBtn.addEventListener("click", async () => {
    try {
        localStorage.getItem("token");
        let res = await axios.get("http://localhost:3000/showLeaderBoard");
        let ul = document.createElement("ul");
        ul.textContent = "Leader Board";
        ul.className = "list-group";
        leaderBoardBtn.after(ul);
        for (let i = 0; i < res.data.user.length; i++) {
            let li = document.createElement("li");
            li.textContent = `${i + 1} ${res.data.user[i].username}  ${res.data.user[i].totalExpenses}`;
            li.className = "list-group-item";

            ul.appendChild(li);
        }
    } catch (error) {
        console.log("error");
    }

});

downloadBtn.onclick = async () => {
    try {
        let token = localStorage.getItem("token");
        let result = await axios.get("http://localhost:3000/downloadedExp", { headers: { "Authorization": token } });
        if (result.status === 200) {
            var a = document.createElement("a");
            a.href = result.data.fileUrl;
            a.download = "myexpense.csv";
            a.click();
        }
    } catch (error) {
        console.log(error)
    }
}
