

document.getElementById("premiumBtn").addEventListener("click", (event) => {
    premiumUser(event);
});
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
    let page = 1;

    let token = localStorage.getItem('token');
    var parsedToken = parseJwt(token);
    var isPremium = parsedToken.isPremium;

    if (isPremium === true) {
        let li = document.createElement("li");
        li.textContent = "You are a premium user"
        li.className = "list-group-item"
        document.getElementById("premiumBtn").replaceWith(li);

        document.body.appendChild(leaderBoardBtn);
        DownloadedFiles();
        document.getElementById("addexp").after(downloadBtn);
    }
    try {
        let result = await axios.get(`http://localhost:3000/expenses?page=${page}&item=${localStorage.getItem("item_perPage")}`, { headers: { "Authorization": token } });
        for (let i = 0; i < result.data.expenses.length; i++) {
            showExpenseOnScreen(result.data.expenses[i]);
        }
        StartPagination(result.data);
    } catch (error) {
        console.log(error);
    }
}
refresh()

function StartPagination({
    currentPage, previousPage, nextPage, lastPage, hasNextPage, hasPreviousPage
}) {

    console.log(currentPage, previousPage, nextPage, lastPage, hasNextPage, hasPreviousPage)
    let pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    document.getElementById("parent").after(pagination);
    let select = document.createElement("select");
    select.id = "sher"
    select.className = "form-select";
    select.multiple = "Multiple select example";
    let option0 = document.createElement("option");
    option0.textContent = "Select"

    let option1 = document.createElement("option");

    option1.value = "5";
    option1.textContent = "5"
    let option2 = document.createElement("option")
    option2.value = "10"
    option2.textContent = "10"
    let option3 = document.createElement("option")
    option3.value = "25";
    option3.textContent = "25"
    let option4 = document.createElement("option")
    option4.value = "50";
    option4.textContent = "50";
    select.appendChild(option0)
    select.appendChild(option1)
    select.appendChild(option2)
    select.appendChild(option3)
    select.appendChild(option4)
    pagination.appendChild(select);
    document.getElementById("sher").addEventListener("click", (event) => {
        event.preventDefault();

        console.log(document.getElementById("sher").value)
        localStorage.setItem("item_perPage", document.getElementById("sher").value);

    })
    if (hasPreviousPage) {
        let PrevBtn = document.createElement("button");
        PrevBtn.innerHTML = previousPage;
        PrevBtn.addEventListener("click", () => {
            getExpenses(previousPage);
        })
        pagination.appendChild(PrevBtn);
    }

    let currBtn = document.createElement("button");
    currBtn.innerHTML = currentPage;
    currBtn.onclick = () => {
        getExpenses(currentPage);
    }
    pagination.appendChild(currBtn);

    if (hasNextPage) {
        let nextBtn = document.createElement("button");
        nextBtn.innerHTML = nextPage;
        nextBtn.onclick = () => {
            getExpenses(nextPage);
        }
        pagination.appendChild(nextBtn)
    }
}

async function getExpenses(page) {
    try {
        console.log(page)
        let token = localStorage.getItem("token");
        let expenses = await axios.get(`http://localhost:3000/expenses?page=${page}&item=${localStorage.getItem("item_perPage")}`, { headers: { "Authorization": token } });
        console.log(expenses.data.expenses)
        clearData();
        for (let i = 0; i < expenses.data.expenses.length; i++) {
            showExpenseOnScreen(expenses.data.expenses[i]);

        }
        StartPagination(expenses.data)
    } catch (error) {
        alert("Something went wrong!");

    }
}

function clearData() {
    let parent = document.getElementById("parent");
    parent.innerHTML = "";
}
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
            a.download = result.data.filename;
            a.click();
        }
    } catch (error) {
        console.log(error)
    }
}
async function DownloadedFiles() {
    let ul = document.createElement("ul");
    ul.textContent = "List of Downloaded Files"
    ul.className = "list-group"
    document.getElementById("parent1").appendChild(ul);

    try {
        let token = localStorage.getItem("token");
        let res = await axios.get("http://localhost:3000/downloadhistory", { headers: { "Authorization": token } });
        for (let i = 0; i < res.data.files.length; i++) {
            let li = document.createElement("li");
            li.textContent = `${res.data.files[i].date} : ${res.data.files[i].url}`;
            li.className = "list-group";
            ul.appendChild(li);
        }
    } catch (error) {
        console.log(error.response.data);
        alert("Error in fetching data")
    }

}