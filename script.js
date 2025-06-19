document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registrationForm');
  const successMessage = document.getElementById('successMessage');
  
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const ageInput = document.getElementById('age');
  const mobileInput = document.getElementById('mobile');
  const addressInput = document.getElementById('address');
  
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const ageError = document.getElementById('ageError');
  const genderError = document.getElementById('genderError');
  const mobileError = document.getElementById('mobileError');
  const addressError = document.getElementById('addressError');
  
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    resetErrors();
    
    const isValid = validateForm();
    
    if (isValid) {
      // Check if gender is selected before accessing its value
      const selectedGender = document.querySelector('input[name="gender"]:checked');
      
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: parseInt(ageInput.value.trim()), // Convert to integer
        gender: selectedGender ? selectedGender.value : '',
        phone: mobileInput.value.trim(),
        address: addressInput.value.trim(),
        Username: "",
        Password: ""
      };
      
      console.log('Form submitted successfully!', formData);

      try {
        debugger
        const response = await fetch('https://localhost:7044/api/student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' // Added Accept header
          },
          body: JSON.stringify(formData)
        });

        // Check if response is ok before parsing JSON
        if (response.ok) {
          const result = await response.json();
          console.log('Data successfully sent to API:', result);
          successMessage.textContent = "Data successfully submitted!";
          successMessage.style.color = "green"; // Success color
          successMessage.classList.remove('hidden');
          
          setTimeout(() => {
            form.reset();
            successMessage.classList.add('hidden');
          }, 5000);

        } else {
          // Handle HTTP error responses
          let errorMessage = `Server error: ${response.status}`;
          
          try {
            const errorResult = await response.json();
            errorMessage = errorResult.message || errorResult.title || errorMessage;
          } catch (parseError) {
            console.log('Could not parse error response as JSON');
          }
          
          console.log('Error in API response:', errorMessage);
          successMessage.textContent = "Error: " + errorMessage;
          successMessage.style.color = "red"; // Error color
          successMessage.classList.remove('hidden');
        }

      } catch (error) {
        console.error('Error during API call:', error);
        successMessage.textContent = "Error connecting to the server. Please check if the API is running.";
        successMessage.style.color = "red"; // Error color
        successMessage.classList.remove('hidden');
      }
    }
  });

  function validateForm() {
    let isValid = true;
    
    // Name validation
    if (!nameInput.value.trim()) {
      showError(nameError, 'Name is required');
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(nameInput.value.trim())) {
      showError(nameError, 'Name should contain only letters and spaces');
      isValid = false;
    }
    
    // Email validation
    if (!emailInput.value.trim()) {
      showError(emailError, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailError, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Age validation
    const age = parseInt(ageInput.value);
    if (!ageInput.value.trim()) {
      showError(ageError, 'Age is required');
      isValid = false;
    } else if (isNaN(age) || age < 1 || age > 120) {
      showError(ageError, 'Please enter a valid age between 1 and 120');
      isValid = false;
    }
    
    // Gender validation
    if (!document.querySelector('input[name="gender"]:checked')) {
      showError(genderError, 'Please select a gender');
      isValid = false;
    }
    
    // Mobile validation
    if (!mobileInput.value.trim()) {
      showError(mobileError, 'Mobile number is required');
      isValid = false;
    } else if (!/^\d{10}$/.test(mobileInput.value.trim())) {
      showError(mobileError, 'Please enter a valid 10-digit mobile number');
      isValid = false;
    }
    
    // Address validation
    if (!addressInput.value.trim()) {
      showError(addressError, 'Address is required');
      isValid = false;
    } else if (addressInput.value.trim().length < 10) {
      showError(addressError, 'Address should be at least 10 characters');
      isValid = false;
    }
    
    return isValid;
  }
  
  function showError(element, message) {
    if (element) {
      element.textContent = message;
    }
  }
  
  function resetErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
      element.textContent = '';
    });
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});