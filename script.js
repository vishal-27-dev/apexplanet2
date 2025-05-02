document.addEventListener('DOMContentLoaded', function() {

    // --- Form Validation Logic (Task 2) ---
    const contactForm = document.getElementById('contactForm');
    const formSuccessMessage = document.getElementById('formSuccessMessage');

    if (contactForm) {
        // Inputs to validate
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject'); // Optional
        const messageInput = document.getElementById('message');

        // Define fields with validation rules
        const fieldsToValidate = [
            { input: nameInput, required: true, name: "Name" },
            { input: emailInput, required: true, name: "Email", isEmail: true },
            { input: subjectInput, required: false }, // Example: Not strictly required
            { input: messageInput, required: true, name: "Message" }
        ];

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission always for JS validation
            let isFormValid = true;

            // Clear previous errors before re-validating
            clearAllErrors(fieldsToValidate);
            formSuccessMessage.style.display = 'none'; // Hide previous success message

            // Validate each field
            fieldsToValidate.forEach(fieldObj => {
                const { input, required, name, isEmail } = fieldObj;
                const value = input.value.trim();

                // Check required
                if (required && value === '') {
                    isFormValid = false;
                    showError(input, `${name} is required.`);
                }
                // Check email format (only if not empty or if required and empty)
                else if (isEmail && value !== '' && !validateEmailFormat(value)) {
                    isFormValid = false;
                    showError(input, `Please enter a valid email address.`);
                }
            });

            // Handle form submission based on validity
            if (isFormValid) {
                console.log('Form is valid. Simulating submission...');
                // In a real scenario, you'd send data here (e.g., using Fetch API)

                // Show success message
                formSuccessMessage.textContent = 'Thank you! Your message has been received.';
                formSuccessMessage.style.display = 'block';

                // Reset the form
                contactForm.reset();

                // Optional: Hide success message after a delay
                setTimeout(() => {
                    formSuccessMessage.style.display = 'none';
                }, 5000); // Hide after 5 seconds

            } else {
                console.log('Form validation failed.');
                // Optionally focus the first invalid field
                 const firstErrorField = contactForm.querySelector('.input-error');
                 if(firstErrorField) firstErrorField.focus();
            }
        });

         // Clear errors on input change for better UX
        fieldsToValidate.forEach(fieldObj => {
            fieldObj.input.addEventListener('input', () => clearError(fieldObj.input));
        });

    } // End of if(contactForm)

    // Helper function to show error message and style
    function showError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = message;
            }
            inputElement.classList.add('input-error');
        }
    }

    // Helper function to clear a single field's error
    function clearError(inputElement) {
         const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = ''; // Clear message
            }
             inputElement.classList.remove('input-error'); // Remove style
        }
    }

     // Helper function to clear all errors
    function clearAllErrors(fields) {
        fields.forEach(fieldObj => clearError(fieldObj.input));
    }


    // Basic email format validation function
    function validateEmailFormat(email) {
        // Simple regex for basic format check
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }


    // --- To-Do List Logic (Task 2) ---
    const todoInput = document.getElementById('todoInput');
    const addTodoButton = document.getElementById('addTodoButton');
    const todoList = document.getElementById('todoList');

    if (addTodoButton && todoInput && todoList) {
        // Add task listeners
        addTodoButton.addEventListener('click', handleAddTask);
        todoInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                 event.preventDefault(); // Prevent potential form submission if nested
                handleAddTask();
            }
        });

        // Use event delegation for removing tasks and toggling completion
        todoList.addEventListener('click', function(event) {
            const target = event.target; // The element that was actually clicked

            // Check if the remove button (or its parent LI) was clicked
             const removeButton = target.closest('.remove-todo-btn');
            if (removeButton) {
                const liToRemove = removeButton.closest('li');
                if (liToRemove) removeTask(liToRemove);
                return; // Stop further processing
            }

            // Check if a list item (but not the remove button area) was clicked
            const listItem = target.closest('li');
            if (listItem) {
                 // Make sure we didn't click inside the remove button area indirectly
                 if (!target.closest('.remove-todo-btn')) {
                    toggleTaskComplete(listItem);
                 }
            }
        });

    } // End of if(todo elements exist)

    // Function to handle adding a task
    function handleAddTask() {
        const taskText = todoInput.value.trim();
        if (taskText === '') {
            alert('Task cannot be empty!'); // Simple feedback
            return;
        }
        createTaskElement(taskText);
        todoInput.value = ''; // Clear the input field
        todoInput.focus();    // Keep focus on input for easy adding
    }

    // Function to create and append the task LI element
    function createTaskElement(taskText) {
        const li = document.createElement('li');

        // Span for the task text allows easier styling/selection
        const span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        // Create the remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕'; // Using a multiplication 'x' symbol
        removeBtn.classList.add('remove-todo-btn');
        removeBtn.setAttribute('aria-label', `Remove task: ${taskText}`); // Accessibility
        li.appendChild(removeBtn);

        // Append the new task to the list
        todoList.appendChild(li);
    }

    // Function to remove a task element
    function removeTask(taskElement) {
        if (taskElement && taskElement.parentNode === todoList) { // Ensure it's a direct child
            taskElement.remove();
        }
    }

    // Function to toggle the completion state of a task
    function toggleTaskComplete(taskElement) {
        if (taskElement) {
            taskElement.classList.toggle('completed');
            // Optional: Announce change for screen readers
            const isCompleted = taskElement.classList.contains('completed');
            taskElement.setAttribute('aria-checked', isCompleted); // Use for accessibility state
            // Consider adding an aria-live region to announce status changes
        }
    }

}); // End of DOMContentLoaded
