async function loginPage(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let obj = {
        email, password
    }
    try {
        let result = await axios.post("http://localhost:3000/login", obj);
        if (result.status === 201) {
            alert(result.data.message);
            localStorage.setItem("token",result.data.token);
            window.location.href = "../Views/expense.html"
        }
    } catch (error) {
        document.body.innerHTML += `<div style="color:red;">${error.response.data.message}</div>`;
    }
}
