$(document).ready(function() {
  'use strict';

  // Validation Functions
  const validators = {
    fullName: function(value) {
      if (!value || value.trim().length === 0) {
        return 'Full name is required.';
      }
      if (value.trim().length < 3) {
        return 'Full name must be at least 3 characters.';
      }
      return null;
    },
    
    email: function(value) {
      if (!value || value.trim().length === 0) {
        return 'Email is required.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address.';
      }
      return null;
    },
    
    phone: function(value) {
      if (!value || value.trim().length === 0) {
        return 'Phone number is required.';
      }
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        return 'Phone number must be at least 10 digits.';
      }
      return null;
    },
    
    address: function(value) {
      if (!value || value.trim().length === 0) {
        return 'Address is required.';
      }
      return null;
    },
    
    city: function(value) {
      if (!value || value.trim().length === 0) {
        return 'City is required.';
      }
      return null;
    },
    
    postalCode: function(value) {
      if (!value || value.trim().length === 0) {
        return 'Postal code is required.';
      }
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 4 || digitsOnly.length > 6) {
        return 'Postal code must be 4-6 digits.';
      }
      if (!/^\d+$/.test(digitsOnly)) {
        return 'Postal code must be numeric only.';
      }
      return null;
    },
    
    country: function(value) {
      if (!value || value === '') {
        return 'Please select a country.';
      }
      return null;
    },
    
    cardholderName: function(value) {
      if ($('#paymentCard').is(':checked')) {
        if (!value || value.trim().length === 0) {
          return 'Cardholder name is required.';
        }
        if (value.trim().length < 3) {
          return 'Cardholder name must be at least 3 characters.';
        }
      }
      return null;
    },
    
    cardNumber: function(value) {
      if ($('#paymentCard').is(':checked')) {
        if (!value || value.trim().length === 0) {
          return 'Card number is required.';
        }
        const digitsOnly = value.replace(/\s/g, '');
        if (digitsOnly.length < 13 || digitsOnly.length > 19) {
          return 'Please enter a valid card number (13-19 digits).';
        }
        if (!/^\d+$/.test(digitsOnly)) {
          return 'Card number must contain only digits.';
        }
      }
      return null;
    },
    
    expiryDate: function(value) {
      if ($('#paymentCard').is(':checked')) {
        if (!value || value.trim().length === 0) {
          return 'Expiry date is required.';
        }
        const parts = value.split('/');
        if (parts.length !== 2) {
          return 'Please enter expiry date in MM/YY format.';
        }
        const month = parseInt(parts[0]);
        const year = parseInt('20' + parts[1]);
        if (month < 1 || month > 12) {
          return 'Invalid month (01-12).';
        }
        const now = new Date();
        const expiry = new Date(year, month - 1);
        if (expiry < now) {
          return 'Card has expired.';
        }
      }
      return null;
    },
    
    cvv: function(value) {
      if ($('#paymentCard').is(':checked')) {
        if (!value || value.trim().length === 0) {
          return 'CVV is required.';
        }
        if (!/^\d{3,4}$/.test(value)) {
          return 'CVV must be 3-4 digits.';
        }
      }
      return null;
    },
    
    terms: function(isChecked) {
      if (!isChecked) {
        return 'You must accept the Terms & Conditions.';
      }
      return null;
    }
  };

  // Validate a single field
  function validateField($field) {
    const fieldId = $field.attr('id');
    const fieldValue = $field.val();
    let error = null;

    // Get validator function
    if (validators[fieldId]) {
      if (fieldId === 'terms') {
        error = validators[fieldId]($field.is(':checked'));
      } else {
        error = validators[fieldId](fieldValue);
      }
    }

    // Update field UI
    if (error) {
      $field.removeClass('is-valid').addClass('is-invalid');
      $field.siblings('.invalid-feedback').text(error).show();
      return false;
    } else {
      $field.removeClass('is-invalid').addClass('is-valid');
      $field.siblings('.invalid-feedback').hide();
      return true;
    }
  }

  // Real-time validation on blur and input
  $('#fullName, #email, #phone, #address, #city, #postalCode, #country').on('blur', function() {
    validateField($(this));
  });

  // Also validate on input for immediate feedback
  $('#fullName, #email, #phone, #address, #city, #postalCode').on('input', function() {
    if ($(this).hasClass('is-invalid') || $(this).hasClass('is-valid')) {
      validateField($(this));
    }
  });

  $('#country').on('change', function() {
    validateField($(this));
  });

  // Card field validation (conditional)
  $('#cardholderName, #cardNumber, #expiryDate, #cvv').on('blur', function() {
    if ($('#paymentCard').is(':checked')) {
      validateField($(this));
    }
  });

  $('#cardholderName, #cardNumber, #expiryDate, #cvv').on('input', function() {
    if ($('#paymentCard').is(':checked')) {
      if ($(this).hasClass('is-invalid') || $(this).hasClass('is-valid')) {
        validateField($(this));
      }
    }
  });

  // Terms checkbox validation
  $('#termsCheck').on('change', function() {
    const isChecked = $(this).is(':checked');
    $('#placeOrderBtn').prop('disabled', !isChecked);
    
    // Remove any previous error message
    $(this).parent().find('.invalid-feedback').remove();
    
    if (!isChecked) {
      if ($(this).parent().find('.invalid-feedback').length === 0) {
        $(this).parent().append('<div class="invalid-feedback d-block">You must accept the Terms & Conditions.</div>');
      }
    } else {
      $(this).parent().find('.invalid-feedback').remove();
    }
  });

  // Payment Method Toggle
  $('input[name="paymentMethod"]').on('change', function() {
    // Hide all payment details
    $('#cardDetails').removeClass('show');
    $('#codMessage').removeClass('show');
    $('#walletMessage').removeClass('show');

    // Clear card field validations when switching payment methods
    $('#cardholderName, #cardNumber, #expiryDate, #cvv').removeClass('is-valid is-invalid');
    $('#cardholderName, #cardNumber, #expiryDate, #cvv').siblings('.invalid-feedback').hide();

    // Show relevant payment details
    if ($(this).attr('id') === 'paymentCard') {
      $('#cardDetails').addClass('show');
    } else if ($(this).attr('id') === 'paymentCOD') {
      $('#codMessage').addClass('show');
    } else if ($(this).attr('id') === 'paymentWallet') {
      $('#walletMessage').addClass('show');
    }
  });

  // Phone Input - Allow only numbers and formatting characters
  $('#phone').on('input', function() {
    let value = $(this).val();
    $(this).val(value.replace(/[^0-9\s\-()+-]/g, ''));
  });

  // Postal Code - Allow only digits
  $('#postalCode').on('input', function() {
    let value = $(this).val();
    $(this).val(value.replace(/\D/g, ''));
  });

  // Card Number Formatting
  $('#cardNumber').on('input', function() {
    let value = $(this).val().replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    $(this).val(formattedValue);
  });

  // Expiry Date Formatting (MM/YY)
  $('#expiryDate').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    $(this).val(value);
  });

  // CVV - Numbers only
  $('#cvv').on('input', function() {
    $(this).val($(this).val().replace(/\D/g, ''));
  });

  // Form Submission
  $('#placeOrderBtn').on('click', function(e) {
    e.preventDefault();
    
    let isValid = true;
    let firstInvalidField = null;

    // Validate all required fields
    const fieldsToValidate = ['#fullName', '#email', '#phone', '#address', '#city', '#postalCode', '#country'];
    
    fieldsToValidate.forEach(function(selector) {
      const $field = $(selector);
      if (!validateField($field) && firstInvalidField === null) {
        firstInvalidField = $field;
        isValid = false;
      }
      if (!validateField($field)) {
        isValid = false;
      }
    });

    // Validate card fields if card payment is selected
    if ($('#paymentCard').is(':checked')) {
      const cardFields = ['#cardholderName', '#cardNumber', '#expiryDate', '#cvv'];
      cardFields.forEach(function(selector) {
        const $field = $(selector);
        if (!validateField($field) && firstInvalidField === null) {
          firstInvalidField = $field;
          isValid = false;
        }
        if (!validateField($field)) {
          isValid = false;
        }
      });
    }

    // Validate terms checkbox
    if (!$('#termsCheck').is(':checked')) {
      isValid = false;
      if ($('#termsCheck').parent().find('.invalid-feedback').length === 0) {
        $('#termsCheck').parent().append('<div class="invalid-feedback d-block">You must accept the Terms & Conditions.</div>');
      }
      if (firstInvalidField === null) {
        firstInvalidField = $('#termsCheck');
      }
    }

    // If validation fails, scroll to first invalid field
    if (!isValid) {
      if (firstInvalidField) {
        $('html, body').animate({
          scrollTop: firstInvalidField.offset().top - 100
        }, 500, function() {
          firstInvalidField.focus();
        });
      }
      return;
    }

    // Success - All validations passed
    alert('✓ Order placed successfully! Thank you for your purchase.\n\nYour order is being processed and you will receive a confirmation email shortly.');
    
   
  });
});

