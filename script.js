const form = document.getElementById('advancedRegistrationForm');
const submitBtn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');

// এখানে আপনার গুগল অ্যাপস স্ক্রিপ্ট (Web App URL) বসাবেন
const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

form.addEventListener('submit', e => {
  e.preventDefault();
  
  submitBtn.disabled = true;
  submitBtn.innerText = "আবেদন প্রসেস করা হচ্ছে, অপেক্ষা করুন...";
  submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        msg.classList.remove('hidden');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerText = "সদস্যপদ আবেদন জমা দিন";
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        
        setTimeout(() => {
            msg.classList.add('hidden');
        }, 6000);
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('দুঃখিত! কোনো টেকনিক্যাল সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        submitBtn.disabled = false;
        submitBtn.innerText = "সদস্যপদ আবেদন জমা দিন";
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    });
});