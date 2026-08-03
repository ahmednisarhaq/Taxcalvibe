(function(){
  const endpoint="/api/submissions";
  document.querySelectorAll(".lead-form").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();
    const status=form.querySelector(".form-status");
    const button=form.querySelector("button[type=submit]");
    status.className="form-status";
    const data=Object.fromEntries(new FormData(form));
    data.source=form.dataset.source||"website";
    data.submittedAt=new Date().toISOString();
    data.page=location.href;
    button.disabled=true;button.textContent="Securing your place…";
    try{
      const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      if(!response.ok)throw new Error("Submission failed");
      form.reset();status.textContent="Thank you—your details are secure. Our team will contact you within 24 hours.";status.classList.add("success");
    }catch(e){status.textContent="We couldn’t submit your details. Please try again in a moment.";status.classList.add("error")}
    finally{button.disabled=false;button.textContent=form.dataset.source==="calculator_cta"?"Secure My 154B Tax Audit Exemption Now →":"Join the FY2026 Waitlist →"}
  }));
})();
