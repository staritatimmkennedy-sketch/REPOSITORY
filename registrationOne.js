$(document).ready(function () {
    // -----------------------------------------------------------------
    // Variables
    // -----------------------------------------------------------------
    const registrationForm = $("#registrationForm");
    let isSubmitting = false;
    let submissionAttempts = 0; // Track how many times submission was attempted
    
    // -----------------------------------------------------------------
    // Debugging Helper
    // -----------------------------------------------------------------
    function debugLog(message, data = null) {
        const timestamp = new Date().toISOString();
        if (data) {
            console.log(`[${timestamp}] 🔧 ${message}`, data);
        } else {
            console.log(`[${timestamp}] 🔧 ${message}`);
        }
    }

    // -----------------------------------------------------------------
    // Modal Functions
    // -----------------------------------------------------------------
    function showErrorModal(title, message) {
        debugLog('Showing error modal', { title, message });
        $('#errorTitle').text(title);
        $('#errorMessage').text(message);
        $('#errorModal').removeClass('hidden');
    }

    function showSuccessModal(title, message) {
        debugLog('Showing success modal', { title, message });
        $('#successModalTitle').text(title);
        $('#successModalMessage').text(message);
        $('#actionSuccessModal').removeClass('hidden');
    }

    // -----------------------------------------------------------------
    // Modal Event Handlers
    // -----------------------------------------------------------------
    function initializeModalHandlers() {
        debugLog('Initializing modal handlers');
        
        // Close error modal
        $(document).on('click', '.close-error-modal', function() {
            debugLog('Closing error modal');
            $('#errorModal').addClass('hidden');
        });

        // Close success modal
        $(document).on('click', '.close-success-modal', function() {
            debugLog('Closing success modal and redirecting');
            $('#actionSuccessModal').addClass('hidden');
            // Redirect to login page after successful registration
            window.location.href = 'main.html';
        });

        // Close modals when clicking outside
        $(document).on('click', function(e) {
            if ($(e.target).is('#errorModal')) {
                debugLog('Closing error modal via outside click');
                $('#errorModal').addClass('hidden');
            }
            if ($(e.target).is('#actionSuccessModal')) {
                debugLog('Closing success modal via outside click and redirecting');
                $('#actionSuccessModal').addClass('hidden');
                window.location.href = 'main.html';
            }
        });
    }

    // -----------------------------------------------------------------
    // Password Validation
    // -----------------------------------------------------------------
    function validatePasswords() {
        const pw1 = $('#pw1').val();
        const pw2 = $('#pw2').val();
        const errorDiv = $('#password-error');
        
        debugLog('Validating passwords', { pw1Length: pw1.length, pw2Length: pw2.length });
        
        if (pw1 !== pw2) {
            errorDiv.text('Passwords do not match').addClass('error').removeClass('success');
            debugLog('Password validation failed: passwords do not match');
            return false;
        } else if (pw1.length < 6) {
            errorDiv.text('Password must be at least 6 characters').addClass('error').removeClass('success');
            debugLog('Password validation failed: password too short');
            return false;
        } else {
            errorDiv.text('').removeClass('error success');
            debugLog('Password validation passed');
            return true;
        }
    }

    // -----------------------------------------------------------------
    // Course Loading
    // -----------------------------------------------------------------
    function loadCourses(collegeId) {
        const $course = $('#course');
        
        debugLog('Loading courses for college', { collegeId });
        
        if (!collegeId) {
            $course.html('<option value="" disabled selected>Select Course</option>');
            return;
        }

        $course.html('<option value="" disabled selected>Loading courses...</option>');
        $course.prop('disabled', true);

        $.ajax({
            url: 'get_courses.php',
            type: 'GET',
            data: { college_id: collegeId },
            dataType: 'json',
            success: function(response) {
                debugLog('Courses loaded successfully', { courseCount: response ? response.length : 0 });
                
                let html = '<option value="" disabled selected>Select Course</option>';
                
                if (response && Array.isArray(response) && response.length) {
                    response.forEach(function(course) {
                        html += `<option value="${course.course_id}">${escapeHtml(course.courseName)}</option>`;
                    });
                } else {
                    html = '<option value="" disabled selected>No courses available</option>';
                    debugLog('No courses found for college', { collegeId });
                }
                
                $course.html(html);
                $course.prop('disabled', false);
            },
            error: function(xhr, status, error) {
                debugLog('Error loading courses', { status, error, responseText: xhr.responseText });
                $course.html('<option value="" disabled selected>Error loading courses</option>');
                $course.prop('disabled', false);
                showErrorModal('Load Failed', 'Failed to load courses. Please try again.');
            }
        });
    }

    // -----------------------------------------------------------------
    // Form Submission - FIXED VERSION
    // -----------------------------------------------------------------
    function submitRegistration(formData) {
        submissionAttempts++;
        debugLog(`Submission attempt #${submissionAttempts}`, { isSubmitting, formData });

        if (isSubmitting) {
            debugLog('❌ SUBMISSION BLOCKED: Already in progress', { submissionAttempts });
            return;
        }

        isSubmitting = true;
        const submitButton = registrationForm.find('button[type="submit"]');
        const originalText = submitButton.text();
        
        // Disable button and show loading state
        submitButton.prop('disabled', true).text('Registering...');
        debugLog('✅ Starting registration submission', { submissionAttempts });

        // Use a unique identifier for this submission
        const submissionId = Date.now();
        debugLog(`🆔 Submission ID: ${submissionId}`);

        $.ajax({
            url: 'registerUser.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                debugLog(`✅ Submission ${submissionId} API response`, response);
                
                // Reset submission state
                isSubmitting = false;
                submitButton.prop('disabled', false).text(originalText);
                
                if (response.success) {
                    showSuccessModal('Registration Successful', 'Your account has been created successfully. You can now login with your credentials.');
                    
                    // Prevent any further form submissions
                    registrationForm.off('submit');
                    debugLog('✅ Form submission disabled after success');
                } else {
                    showErrorModal('Registration Failed', response.error);
                }
            },
            error: function(xhr, status, error) {
                debugLog(`❌ Submission ${submissionId} API error`, { 
                    status: status, 
                    error: error, 
                    responseText: xhr.responseText,
                    readyState: xhr.readyState,
                    statusCode: xhr.status
                });
                
                // Reset submission state
                isSubmitting = false;
                submitButton.prop('disabled', false).text(originalText);
                
                let errorMsg = 'An error occurred during registration. Please try again.';
                
                // Try to parse error response for better messaging
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMsg = errorResponse.error || errorMsg;
                } catch (e) {
                    // If not JSON, check for common HTTP errors
                    if (xhr.status === 0) {
                        errorMsg = 'Network error: Cannot connect to server. Please check your connection.';
                    } else if (xhr.status === 404) {
                        errorMsg = 'Server error: Registration service not found.';
                    } else if (xhr.status === 500) {
                        errorMsg = 'Server error: Internal server error occurred.';
                    }
                }
                
                showErrorModal('Registration Failed', errorMsg);
            },
            complete: function() {
                debugLog(`🏁 Submission ${submissionId} complete`, { isSubmitting });
            }
        });
    }

    // -----------------------------------------------------------------
    // Event Handlers - FIXED VERSION
    // -----------------------------------------------------------------
    $('#show-pass').on('change', function () {
        const type = this.checked ? 'text' : 'password';
        debugLog('Toggling password visibility', { showPassword: this.checked });
        $('#pw1, #pw2').attr('type', type);
    });

    $('#pw1, #pw2').on('input', validatePasswords);

    $('#department').on('change', function () {
        const collegeId = $(this).val();
        debugLog('Department changed', { collegeId });
        loadCourses(collegeId);
    });

    // SINGLE SUBMIT HANDLER - Remove any existing handlers first
    registrationForm.off('submit').on('submit', function (e) {
        e.preventDefault();
        debugLog('🛑 Form submission intercepted', { 
            isSubmitting, 
            submissionAttempts,
            time: new Date().toISOString()
        });
        
        // Additional check - prevent if already submitting
        if (isSubmitting) {
            debugLog('🚫 FORM SUBMISSION BLOCKED - Already in progress');
            e.stopImmediatePropagation();
            return false;
        }
        
        $('#course').prop('disabled', false);
        
        if (!validatePasswords()) {
            showErrorModal('Validation Error', 'Please fix password errors before submitting.');
            return false;
        }

        const formData = $(this).serialize();
        debugLog('Form data prepared for submission', { 
            dataLength: formData.length,
            submissionAttempts: submissionAttempts + 1
        });
        
        submitRegistration(formData);
        
        // Prevent default and stop propagation
        e.stopImmediatePropagation();
        return false;
    });

    // -----------------------------------------------------------------
    // Helper Functions
    // -----------------------------------------------------------------
    function escapeHtml(unsafe) {
        if (unsafe === null || unsafe === undefined) return "";
        return unsafe.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // -----------------------------------------------------------------
    // Global Debugging Functions (accessible from console)
    // -----------------------------------------------------------------
    window.debugRegistration = {
        // Check current submission state
        getState: function() {
            return {
                isSubmitting: isSubmitting,
                submissionAttempts: submissionAttempts,
                formData: registrationForm.serialize(),
                passwordValid: validatePasswords(),
                time: new Date().toISOString()
            };
        },
        
        // Force enable form (useful if stuck in disabled state)
        forceEnable: function() {
            isSubmitting = false;
            submissionAttempts = 0;
            registrationForm.find('button[type="submit"]').prop('disabled', false).text('Register Account');
            debugLog('Form forcefully enabled and reset');
        },
        
        // Test form validation
        testValidation: function() {
            return validatePasswords();
        },
        
        // Clear all event handlers and reinitialize
        resetForm: function() {
            registrationForm.off('submit');
            registrationForm.on('submit', function(e) {
                e.preventDefault();
                if (!isSubmitting) {
                    const formData = $(this).serialize();
                    submitRegistration(formData);
                }
                return false;
            });
            debugLog('Form event handlers reset');
        }
    };

    // -----------------------------------------------------------------
    // Initialization
    // -----------------------------------------------------------------
    function initializeRegistration() {
        debugLog('🚀 Registration page initialized');
        initializeModalHandlers();
        
        // Log initialization complete
        console.log('%c✅ Registration system ready!', 'color: green; font-weight: bold;');
        console.log('%c💡 Debug commands available:', 'color: blue; font-weight: bold;');
        console.log('   - debugRegistration.getState() - Check current state');
        console.log('   - debugRegistration.forceEnable() - Force enable form');
        console.log('   - debugRegistration.testValidation() - Test validation');
        console.log('   - debugRegistration.resetForm() - Reset event handlers');
    }

    initializeRegistration();
});