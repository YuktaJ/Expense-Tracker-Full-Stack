document.getElementById("submitform").addEventListener("submit", (event) => {
    signUpPage(event)
});
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
// Storing the user data 
async function storeInStorage(obj) {
    try {
        let result = await axios.post("http://52.53.205.42:3000/signup", obj);
        if (result.status === 201) {
            alert(`${result.data.message}`);
            window.location.href = './login.html';
        }
    } catch (error) {
        document.body.innerHTML += `<div style="color: red;">${error} </div>`
    }
}
