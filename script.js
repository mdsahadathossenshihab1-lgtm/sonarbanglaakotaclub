// আপনার গুগল অ্যাপস স্ক্রিপ্ট থেকে পাওয়া Web App URL-টি এখানে বসাবেন
const scriptURL = 'https://script.google.com/macros/s/AKfycbxN0o0WBwpn6oBLxL9rIJWull2X66eJ0rRjr6H-SjHvBvSDNU5A-a3MIj6opfspEm7EZQ/exec';

const form = document.getElementById('advancedRegistrationForm');
const submitBtn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');

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

        // no-cors মোড ব্যবহার করে গুগল স্ক্রিপ্টে ডেটা পাঠানো (CORS সমস্যা দূর করার জন্য)
        await fetch(scriptURL, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: formData 
        });
        
        // no-cors মোডে রেসপন্স রিড করা যায় না, কিন্তু ডেটা সফলভাবে চলে যায়
        msg.classList.remove('hidden');
        form.reset();
        
        // ফাইল ইনপুটগুলো ম্যানুয়ালি ক্লিয়ার করা
        document.getElementById('photoFileInput').value = '';
        document.getElementById('docFileInput').value = '';
        
        // ৬ সেকেন্ড পর সফলতার মেসেজটি হাইড করা
        setTimeout(() => { msg.classList.add('hidden'); }, 6000);

    } catch (error) {
        console.error('Network Error!', error.message);
        alert('দুঃখিত! কোনো কারিগরি ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
        // বাটন আগের অবস্থায় ফিরিয়ে আনা
        submitBtn.disabled = false;
        submitBtn.innerText = "সদস্যপদ আবেদন জমা দিন";
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
});