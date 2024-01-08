document.getElementById('swapToRegisterButton').addEventListener('click', function() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
});

document.getElementById('swapToLoginButton').addEventListener('click', function() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});

document.querySelector('#loginSection form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = e.target.email.value;
    var password = e.target.password.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'dashboardnew.html';
        })
        .catch((error) => {
            var errorMessage = error.message;
            alert('Error: ' + errorMessage);
        });
});

document.querySelector('#registerSection form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = e.target.email.value;
    var password = e.target.password.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            var errorMessage = error.message;
            alert('Error: ' + errorMessage);
        });
});