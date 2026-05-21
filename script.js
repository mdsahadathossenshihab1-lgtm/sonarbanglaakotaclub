const form = document.getElementById('advancedRegistrationForm');
const submitBtn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');

// এখানে আপনার গুগল অ্যাপস স্ক্রিপ্ট (Web App URL) বসাবেন
const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

// ফাইলকে Base64 টেক্সটে রূপান্তর করার ফাংশন
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = "ফাইল ও আবেদন প্রসেস হচ্ছে, দয়া করে অপেক্ষা করুন...";
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        const formData = new FormData(form);

        // ছবি এবং ডকুমেন্ট ফাইল ইনপুট থেকে রিড করা
        const photoFile = document.getElementById('photoFileInput').files[0];
        const docFile = document.getElementById('docFileInput').files[0];

        // Base64 কনভার্ট করে ডাটাতে যুক্ত করা
        if (photoFile) {
            const photoBase64 = await getBase64(photoFile);
            formData.append('photoData', photoBase64);
            formData.append('photoName', photoFile.name);
        }
        if (docFile) {
            const docBase64 = await getBase64(docFile);
            formData.append('docData', docBase64);
            formData.append('docName', docFile.name);
        }

        // রিকোয়েস্ট পাঠানো
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        
        if (response.ok) {
            msg.classList.remove('hidden');
            form.reset();
            document.getElementById('photoFileInput').value = '';
            document.getElementById('docFileInput').value = '';
            
            setTimeout(() => { msg.classList.add('hidden'); }, 6000);
        } else {
            alert('আবেদন জমা দেওয়া যায়নি। আবার চেষ্টা করুন।');
        }
    } catch (error) {
        console.error('Error!', error.message);
        alert('দুঃখিত! কোনো কারিগরি ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "সদস্যপদ আবেদন জমা দিন";
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
});