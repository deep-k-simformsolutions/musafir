const submitbutton = document.querySelector(".login-form")
const firstname = document.querySelector("#firstname")
const lastname = document.querySelector("#lastname")
const username = document.querySelector("#username")
const email = document.querySelector("#e-mail")
const phone = document.querySelector("#phone")
const password = document.querySelector("#password")
const repassword = document.querySelector("#repassword") 
submitbutton.addEventListener('submit',(e)=>{
e.preventDefault()
validate()
})
const validate = ()=>{
    let id = 0
      
    if (username.value.length <= 3) {
        alert("username must be 4 letter")
        return false;
    }
    else if (!isEmail(email.value)) {
        alert('Invalid Email Address')
        return false;
    }
    else if (phone.value.length != 10) {
        alert("unvalid mobile number")
        return false;
    }
    else if (password.value.length <= 5) {
        alert("password length is atleast 6 ")
        return false;
    }
    else if (password.value != repassword.value) {
        alert("Password did not match: Please try again....")
        return false;
    }
    else {
        location.href = 'login.html'
    }
}
const isEmail = (emailval) => {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailval) == false) {
        return (false);
    }
    return true;
}

