(function(){
  const endpoint=window.TAXAI_FORM_ENDPOINT||"";
  document.querySelectorAll(".lead-form").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();
    const status=form.querySelector(".form-status");
    const button=form.querySelector("button[type=submit]");
    status.className="form-status";
    if(!endpoint||endpoint.includes("PASTE_")){status.textContent="The waitlist is being connected. Please check back shortly.";status.classList.add("error");return}
    const data=new FormData(form);
    data.append("source",form.dataset.source||"website");
    data.append("submittedAt",new Date().toISOString());
    data.append("page",location.href);
    button.disabled=true;button.textContent="Securing your place…";
    try{
      await fetch(endpoint,{method:"POST",body:data,mode:"no-cors"});
      form.reset();status.textContent="Thank you—your details are secure. Our team will contact you within 24 hours.";status.classList.add("success");
    }catch(e){status.textContent="We couldn’t submit your details. Please try again in a moment.";status.classList.add("error")}
    finally{button.disabled=false;button.textContent=form.dataset.source==="calculator_cta"?"Secure My 154B Tax Audit Exemption Now →":"Join the FY2026 Waitlist →"}
  }));
})();
