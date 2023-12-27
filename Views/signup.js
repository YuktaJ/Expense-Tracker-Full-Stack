function signUpPage(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;

    let obj = {
        username, password, email
    }

    storeInStorage(obj);
}

async function storeInStorage(obj) {
    try {
        let result = await axios.post("http://localhost:3000/signup", obj);

    } catch (error) {
        document.body.innerHTML += `<div style="color: red;">${error} </div>`
    }
}
