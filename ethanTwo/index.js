$(document).ready(function(){ 

  const toggle = document.getElementById('show-pass');
  const password = document.getElementById('password');
  toggle.addEventListener('change', () => {
    password.type = toggle.checked ? 'text' : 'password';
  });

  
  $(document).on("click", "#btn-submit", function() {
    var userName = document.getElementById("username").value;
    var passWord = document.getElementById("password").value;
    if(validateFields(userName) && validateFields(passWord)){
      $.ajax({
                      method: "POST",
                      url: "loginOne.php",
                      data: {
                      userName: userName,
                      passWord: passWord
                },
            success: function(data)
            {
                if(data=="Admin"){
                    location.href="./index.php?page=adminDashboard"
                }
                else if(data =="Librarian"){
                    location.href="./index.php?page=librarianDashboard"
                }
                else if(data=="Dean")
                {
                  location.href="./index.php?page=deanDashboard"
                }
                else if(data=="Username and password is incorrect!"){
                  document.getElementById('error').innerHTML=data;
                }
                else{
                  location.href="./index.php?page=student_dashboard"
                }
            }
        });
    }
    else{
      document.getElementById('error').innerHTML="Input the required fields";
    }
 
 }); 
});

function validateFields(value){
    if(value != ""){
        return true;
    }else{
        return false;
    }
}