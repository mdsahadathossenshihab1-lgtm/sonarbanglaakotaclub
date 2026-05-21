// আপনার গুগল অ্যাপস স্ক্রিপ্ট থেকে পাওয়া Web App URL-টি এখানে বসাবেন
const scriptURL = 'https://script.google.com/macros/s/AKfycbzs6n8rf0acEYWxIMGoHByRbmbdkGbcPzm7n8aqljr3oeJ1uYPfq7Ald1JOxoeCXXJu_A/exec';

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
    submitBtn.innerText = "ফাইল ও আবেদন প্রসেস হচ্ছে, দয়া করে অপেক্ষা করুন...";
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        // ফর্মের সব ইনপুট (nameBn, memberPhone, password, action ইত্যাদি) একসাথে রিড করা
        const formData = new FormData(form);

        // ছবি এবং ডকুমেন্ট ফাইল ইনপুট থেকে রিড করা
        const photoFile = document.getElementById('photoFileInput').files[0];
        const docFile = document.getElementById('docFileInput').files[0];

        // ফাইল দুটিকে Base64-একনভার্ট করে ফর্মে যুক্ত করা
        if (photoFile) {
            const photoBase64 = await getBase64(photoFile);
            formData.append('photoData', photoBase64); 
        }
        if (docFile) {
            const docBase64 = await getBase64(docFile);
            formData.append('docData', docBase64);
        }

        // রুলস বা চেকবক্সের ভ্যালুগুলো অন/অফ নিশ্চিত করা
        formData.set('rule1', form.rule1.checked ? 'true' : 'false');
        formData.set('rule2', form.rule2.checked ? 'true' : 'false');

        // স্ট্যান্ডার্ড fetch মেথড (যাতে রেসপন্স চেক করা যায় এবং সফল সাবমিশন ট্র্যাক করা যায়)
        const response = await fetch(scriptURL, { 
            method: 'POST', 
            body: formData 
        });
        
        const resultText = await response.text();
        
        if (resultText === "Success") {
            // সফলতার মেসেজ দেখানো
            msg.innerText = "🎉 আপনার আবেদনটি সফলভাবে সম্পন্ন হয়েছে এবং সব ডেটা ও ফাইল গুগল ড্রাইভে আপলোড হয়েছে!";
            msg.classList.remove('hidden');
            
            // ফর্ম এবং ফাইল ইনপুটগুলো রিসেট করা
            form.reset();
            document.getElementById('photoFileInput').value = '';
            document.getElementById('docFileInput').value = '';
            
            // ৬ সেকেন্ড পর সফলতার মেসেজটি হাইড করা
            setTimeout(() => { msg.classList.add('hidden'); }, 6000);
        } else {
            alert('গুগল শিটে ডেটা সেভ হতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }

    } catch (error) {
        console.error('Network Error!', error.message);
        alert('দুঃখিত! কোনো কারিগরি ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
        // বাটন আগের অবস্থায় ফিরিয়ে আনা
        submitBtn.disabled = false;
        submitBtn.innerText = "সদস্যপদ আবেদন জমা দিন";
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
});