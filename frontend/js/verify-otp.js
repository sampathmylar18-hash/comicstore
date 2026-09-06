

const params = new URLSearchParams(window.location.search);
const email = params.get('email');


document.getElementById("emailDisplay").innerHTML=email;

const submit = document.getElementById("verifyOtpForm")
submit.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const otp = document.getElementById("otp").value;
    try{
        const res = await fetch(`${auth_url}/verify-otp`,{
            method : 'POST',
            headers : { 'content-Type' : 'application/json'},
            body : JSON.stringify({email,otp})
        })       
        const data = await res.json();
        if(res.ok){
            showToast("OTP verified")
            setTimeout(()=>{
            window.location.href = "login.html"
             } ,500)
        }else{
            showToast(data.message)
        }
    }catch(e){
        console.error(e)
    }
})


