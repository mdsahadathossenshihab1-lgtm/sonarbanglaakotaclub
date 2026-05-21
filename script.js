// এখানে আপনার গুগল অ্যাপস স্ক্রিপ্ট থেকে পাওয়া Web App URL-টি বসাবেন
const scriptURL = 'https://script.google.com/macros/s/AKfycbybTcViWD7XCiCdAaRgeBzzL30Sl1erJedDnIlbo9AzQ_eeb7VfE5M3p4W80b4MeSnxfg/exec';

const form = document.getElementById('advancedRegistrationForm');
const submitBtn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');

// ফাইলকে টেক্সটে (Base64) রূপান্তর করার হেল্পার ফাংশন
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
    
    // বাটন লক ও প্রসেসিং টেক্সট দেখানো
    submitBtn.disabled = true;
    submitBtn.innerText = "ফাইল ও আবেদন প্রসেস হচ্ছে, দয়া করে অপেক্ষা করুন...";
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        const formData = new FormData(form);

        // ছবি এবং ডকুমেন্ট ফাইল ইনপুট থেকে রিড করা
        const photoFile = document.getElementById('photoFileInput').files[0];
        const docFile = document.getElementById('docFileInput').files[0];

        // ফাইল দুটিকে Base64-এ কনভার্ট করে ফর্মে যুক্ত করা
        if (photoFile) {
            const photoBase64 = await getBase64(photoFile);
            formData.append('photoData', photoBase64); 
        }
        if (docFile) {
            const docBase64 = await getBase64(docFile);
            formData.append('docData', docBase64);
        }

        // গুগল অ্যাপস স্ক্রিপ্টে ডেটা পাঠানো
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        const result = await response.json();
        
        // অ্যাপস স্ক্রিপ্ট থেকে সফল রেসপন্স আসলে
        if (result.status === 'success') {
            msg.classList.remove('hidden');
            form.reset();
            
            // ফাইল ইনপুটগুলো ম্যানুয়ালি ক্লিয়ার করা
            document.getElementById('photoFileInput').value = '';
            document.getElementById('docFileInput').value = '';
            
            // ৬ সেকেন্ড পর সফলতার মেসেজটি হাইড করা
            setTimeout(() => { msg.classList.add('hidden'); }, 6000);
        } else {
            console.error('Server Error:', result.message);
            alert('আবেদন জমা দেওয়া যায়নি। সার্ভারে সমস্যা হয়েছে: ' + result.message);
        }
    } catch (error) {
        console.error('Network Error!', error.message);
        alert('দুঃখিত! কোনো কারিগরি ত্রুটি হয়েছে অথবা নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
        // বাটন আগের অবস্থায় ফিরিয়ে আনা
        submitBtn.disabled = false;
        submitBtn.innerText = "সদস্যপদ আবেদন জমা দিন";
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
});