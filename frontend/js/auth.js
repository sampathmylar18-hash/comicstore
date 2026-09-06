
const registerForm = document.getElementById('register-form')
if(registerForm){
    registerForm.addEventListener('submit',async(e)=>{
        e.preventDefault()
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
         
        try{ 
            const res =await fetch(`${auth_url}/register`,{
            method : 'POST',
            headers : { 'content-Type' : 'application/json'},
            body : JSON.stringify({ name , email , password })
        });
        const data = await res.json();
        if(res.ok){
            showToast('verify your account');
            setTimeout(() => {
            window.location.href = `verify-otp.html?email=${encodeURIComponent(email)}`
             }, 500); 
        }else {
            showToast (data.message);
        }
        }catch(e){
            console.error(e)
        }
    })
}

const loginForm = document.getElementById('login-form');
if(loginForm){
    loginForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try{
            const res = await fetch(`${auth_url}/login`,{
                method : 'POST',
                headers : { 'content-Type' : 'application/json '},
                body : JSON.stringify({email,password})
            })
            const data = await res.json();
            if(res.ok){
                localStorage.setItem('token',data.token);
                localStorage.setItem('role',data.role);
                localStorage.setItem('name',data.name);
                showToast("Successful Login")
                setTimeout(() => {
                window.location.href = 'index.html'
                 }, 500); 
            }else{
                showToast(data.message)
            }
        }catch(e){
            console.error(e);
        }
        }
    )
}

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    showToast("Logout  Successful")
   setTimeout(() => {
     window.location.href = 'index.html'
      }, 500); 
}