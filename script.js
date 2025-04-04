// Main JavaScript for Prakruti Organics Website

// DOM Elements
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const newsletterForm = document.getElementById('newsletter-form');
const navLinks = document.querySelectorAll('nav a');

// Cart functionality
let cartItems = [];

// Add to cart functionality
function addToCart(event) {
    const button = event.target;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    
    // Create product object
    const product = {
        name: productName,
        price: productPrice,
        quantity: 1
    };
    
    // Check if product already exists in cart
    const existingProductIndex = cartItems.findIndex(item => item.name === productName);
    
    if (existingProductIndex > -1) {
        // Increase quantity
        cartItems[existingProductIndex].quantity += 1;
    } else {
        // Add new product
        cartItems.push(product);
    }
    
    // Update cart display
    updateCartDisplay();
    
    // Show confirmation message
    showMessage(`Added ${productName} to cart!`);
}

// Update cart display
function updateCartDisplay() {
    // This would update a cart icon or sidebar in a full implementation
    console.log('Cart updated:', cartItems);
    
    // Update cart count (assuming there's a cart count element)
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show message function
function showMessage(message) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    
    // Append to body
    document.body.appendChild(messageElement);
    
    // Style the message
    messageElement.style.position = 'fixed';
    messageElement.style.bottom = '20px';
    messageElement.style.right = '20px';
    messageElement.style.backgroundColor = 'var(--primary-color)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '10px 20px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(20px)';
    messageElement.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Show message with animation
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        // Remove from DOM after transition
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}

// Newsletter form submission
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    // Simple validation
    if (!nameInput.value.trim()) {
        showMessage('Please enter your name');
        nameInput.focus();
        return;
    }
    
    if (!emailInput.value.trim()) {
        showMessage('Please enter your email');
        emailInput.focus();
        return;
    }
    
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showMessage('Please enter a valid email address');
        emailInput.focus();
        return;
    }
    
    // In a real application, you would submit this data to a server
    // For now, we'll just simulate success
    showMessage('Thank you for subscribing!');
    
    // Reset form
    newsletterForm.reset();
}

// Smooth scrolling for navigation links
function smoothScroll(event) {
    // Check if it's an internal link
    if (this.getAttribute('href').startsWith('#')) {
        event.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calculate offset position
            const offsetPosition = targetElement.offsetTop - 100;
            
            // Scroll to that position
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Product hover effects
const productCards = document.querySelectorAll('.product-card');

function handleProductMouseOver() {
    this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
}

function handleProductMouseOut() {
    this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
}

// Create a canvas element for decorative purposes
function setupCanvas() {
    const canvas = document.createElement('canvas');
    document.querySelector('.newsletter').appendChild(canvas);
    canvas.width = 200;
    canvas.height = 200;
    canvas.style.position = 'absolute';
    canvas.style.right = '50px';
    canvas.style.top = '50px';
    canvas.style.opacity = '0.2';
    
    const ctx = canvas.getContext('2d');
    
    // Draw a mandala-like pattern
    ctx.fillStyle = '#ffffff';
    
    // Draw circles
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const angle = (i / 8) * Math.PI * 2;
        const x = 100 + Math.cos(angle) * 80;
        const y = 100 + Math.sin(angle) * 80;
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(100, 100, 30, 0, Math.PI * 2);
    ctx.fill();
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Navigation smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Product card hover effects
    productCards.forEach(card => {
        card.addEventListener('mouseover', handleProductMouseOver);
        card.addEventListener('mouseout', handleProductMouseOut);
    });
    
    // Setup canvas for newsletter
    setupCanvas();
    
    // Create a sample product carousel
    initProductCarousel();
});

// Product carousel functionality
function initProductCarousel() {
    const productsContainer = document.querySelector('.products-container');
    
    if (!productsContainer) return;
    
    // Set initial position
    let position = 0;
    let startX = 0;
    let isDragging = false;
    
    // Touch events for mobile swiping
    productsContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    productsContainer.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        // Only allow horizontal scrolling
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    });
    
    productsContainer.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const currentX = e.changedTouches[0].clientX;
        const diff = startX - currentX;
        
        // If swiped far enough, move to next/prev
        if (diff > 50) {
            // Swiped left, go to next
            moveNext();
        } else if (diff < -50) {
            // Swiped right, go to prev
            movePrev();
        }
        
        isDragging = false;
    });
    
    // Create navigation buttons (implementation for larger screens)
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-btn prev-btn';
    prevButton.innerHTML = '&lt;';
    prevButton.style.position = 'absolute';
    prevButton.style.left = '10px';
    prevButton.style.top = '50%';
    prevButton.style.transform = 'translateY(-50%)';
    prevButton.style.zIndex = '10';
    prevButton.style.backgroundColor = 'var(--primary-color)';
    prevButton.style.color = 'white';
    prevButton.style.border = 'none';
    prevButton.style.borderRadius = '50%';
    prevButton.style.width = '40px';
    prevButton.style.height = '40px';
    prevButton.style.fontSize = '1.5rem';
    prevButton.style.cursor = 'pointer';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-btn next-btn';
    nextButton.innerHTML = '&gt;';
    nextButton.style.position = 'absolute';
    nextButton.style.right = '10px';
    nextButton.style.top = '50%';
    nextButton.style.transform = 'translateY(-50%)';
    nextButton.style.zIndex = '10';
    nextButton.style.backgroundColor = 'var(--primary-color)';
    nextButton.style.color = 'white';
    nextButton.style.border = 'none';
    nextButton.style.borderRadius = '50%';
    nextButton.style.width = '40px';
    nextButton.style.height = '40px';
    nextButton.style.fontSize = '1.5rem';
    nextButton.style.cursor = 'pointer';
    
    // Add buttons to parent container
    const productsSection = productsContainer.parentElement;
    productsSection.style.position = 'relative';
    productsSection.appendChild(prevButton);
    productsSection.appendChild(nextButton);
    
    // Move functions
    function moveNext() {
        const cardWidth = productCards[0].offsetWidth + 30; // Including margin
        const visibleWidth = productsContainer.offsetWidth;
        const maxScroll = productsContainer.scrollWidth - visibleWidth;
        
        position = Math.min(position + cardWidth, maxScroll);
        
        productsContainer.style.transition = 'transform 0.5s ease';
        productsContainer.style.transform = `translateX(-${position}px)`;
    }
    
    function movePrev() {
        const cardWidth = productCards[0].offsetWidth + 30; // Including margin
        
        position = Math.max(position - cardWidth, 0);
        
        productsContainer.style.transition = 'transform 0.5s ease';
        productsContainer.style.transform = `translateX(-${position}px)`;
    }
    
    // Add event listeners to buttons
    prevButton.addEventListener('click', movePrev);
    nextButton.addEventListener('click', moveNext);
}

// Dosha Quiz functionality
function initDoshaQuiz() {
    const quizButton = document.querySelector('.dosha-quiz-btn');
    
    if (!quizButton) return;
    
    quizButton.addEventListener('click', function() {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'quiz-modal';
        
        // Style modal
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        // Create quiz content
        const quizContent = document.createElement('div');
        quizContent.className = 'quiz-content';
        
        // Style quiz content
        quizContent.style.backgroundColor = 'white';
        quizContent.style.padding = '30px';
        quizContent.style.borderRadius = '10px';
        quizContent.style.maxWidth = '600px';
        quizContent.style.width = '90%';
        quizContent.style.maxHeight = '80vh';
        quizContent.style.overflowY = 'auto';
        
        // Add quiz title
        const quizTitle = document.createElement('h2');
        quizTitle.textContent = 'Discover Your Dosha Type';
        quizTitle.style.marginBottom = '20px';
        quizTitle.style.color = 'var(--accent-color)';
        
        // Create quiz form
        const quizForm = document.createElement('form');
        quizForm.className = 'dosha-quiz-form';
        
        // Add quiz questions
        const questions = [
            {
                id: 'body',
                text: 'Which best describes your body frame?',
                options: [
                    { value: 'vata', text: 'Thin, light, difficult to gain weight' },
                    { value: 'pitta', text: 'Medium build, moderate weight' },
                    { value: 'kapha', text: 'Solid, heavy, tendency to gain weight' }
                ]
            },
            {
                id: 'skin',
                text: 'How would you describe your skin?',
                options: [
                    { value: 'vata', text: 'Dry, rough, thin' },
                    { value: 'pitta', text: 'Warm, reddish, sensitive' },
                    { value: 'kapha', text: 'Thick, oily, cool and pale' }
                ]
            },
            {
                id: 'appetite',
                text: 'How is your appetite generally?',
                options: [
                    { value: 'vata', text: 'Variable, irregular, sometimes forget to eat' },
                    { value: 'pitta', text: 'Strong, sharp, gets irritable if meals are missed' },
                    { value: 'kapha', text: 'Steady, can skip meals easily' }
                ]
            }
        ];
        
        // Add questions to form
        questions.forEach(question => {
            const fieldset = document.createElement('fieldset');
            fieldset.style.border = '1px solid #ddd';
            fieldset.style.borderRadius = '5px';
            fieldset.style.padding = '15px';
            fieldset.style.marginBottom = '20px';
            
            const legend = document.createElement('legend');
            legend.textContent = question.text;
            legend.style.fontWeight = 'bold';
            legend.style.color = 'var(--primary-color)';
            
            fieldset.appendChild(legend);
            
            // Add radio buttons for each option
            question.options.forEach((option, index) => {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.marginBottom = '10px';
                label.style.cursor = 'pointer';
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = question.id;
                radio.value = option.value;
                radio.id = `${question.id}-${index}`;
                
                // Check first option by default
                if (index === 0) {
                    radio.checked = true;
                }
                
                const optionText = document.createTextNode(option.text);
                
                label.appendChild(radio);
                label.appendChild(optionText);
                
                fieldset.appendChild(label);
            });
            
            quizForm.appendChild(fieldset);
        });
        
        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Find My Dosha';
        submitButton.className = 'btn';
        submitButton.style.backgroundColor = 'var(--accent-color)';
        submitButton.style.width = '100%';
        submitButton.style.padding = '12px';
        submitButton.style.fontSize = '1.1rem';
        
        quizForm.appendChild(submitButton);
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.textContent = '×';
        closeButton.className = 'close-btn';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '15px';
        closeButton.style.fontSize = '1.5rem';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#333';
        
        // Add form submission handler
        quizForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Count dosha results
            let vataCount = 0;
            let pittaCount = 0;
            let kaphaCount = 0;
            
            // Get all selected radio buttons
            const selected = quizForm.querySelectorAll('input[type="radio"]:checked');
            
            // Count each dosha type
            selected.forEach(radio => {
                if (radio.value === 'vata') vataCount++;
                if (radio.value === 'pitta') pittaCount++;
                if (radio.value === 'kapha') kaphaCount++;
            });
            
            // Determine dominant dosha
            let dominantDosha = 'vata';
            let dominantCount = vataCount;
            
            if (pittaCount > dominantCount) {
                dominantDosha = 'pitta';
                dominantCount = pittaCount;
            }
            
            if (kaphaCount > dominantCount) {
                dominantDosha = 'kapha';
                dominantCount = kaphaCount;
            }
            
            // Display result
            showDoshaResult(dominantDosha, modal);
        });
        
        // Close button event handler
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Assemble quiz elements
        quizContent.appendChild(closeButton);
        quizContent.appendChild(quizTitle);
        quizContent.appendChild(quizForm);
        
        // Add quiz content to modal
        modal.appendChild(quizContent);
        
        // Add modal to body
        document.body.appendChild(modal);
    });
}

// Show dosha quiz result
function showDoshaResult(dosha, modal) {
    // Clear modal content
    modal.innerHTML = '';
    
    // Create result content
    const resultContent = document.createElement('div');
    resultContent.className = 'result-content';
    resultContent.style.backgroundColor = 'white';
    resultContent.style.padding = '30px';
    resultContent.style.borderRadius = '10px';
    resultContent.style.maxWidth = '600px';
    resultContent.style.width = '90%';
    resultContent.style.textAlign = 'center';
    
    // Add dosha title
    const resultTitle = document.createElement('h2');
    resultTitle.textContent = `Your Dominant Dosha: ${dosha.charAt(0).toUpperCase() + dosha.slice(1)}`;
    resultTitle.style.marginBottom = '20px';
    resultTitle.style.color = 'var(--accent-color)';
    
    // Add dosha image
    const resultImage = document.createElement('img');
    resultImage.src = `images/${dosha}-dosha.jpg`;
    resultImage.alt = `${dosha} dosha`;
    resultImage.style.width = '150px';
    resultImage.style.height = '150px';
    resultImage.style.borderRadius = '50%';
    resultImage.style.objectFit = 'cover';
    resultImage.style.margin = '0 auto 20px';
    resultImage.style.display = 'block';
    
    // Add dosha description
    const resultDescription = document.createElement('p');
    
    // Set description based on dosha type
    if (dosha === 'vata') {
        resultDescription.textContent = 'Vata types are creative, energetic, and quick-thinking. Your products should include warming herbs and foods, nourishing oils, and grounding spices.';
    } else if (dosha === 'pitta') {
        resultDescription.textContent = 'Pitta types are focused, passionate, and driven. Your products should include cooling herbs, soothing spices, and balancing foods.';
    } else {
        resultDescription.textContent = 'Kapha types are steady, compassionate, and grounded. Your products should include stimulating herbs, warming spices, and light, energizing foods.';
    }
    
    resultDescription.style.marginBottom = '30px';
    
    // Add recommended products button
    const recommendedButton = document.createElement('a');
    recommendedButton.href = `#${dosha}-products`;
    recommendedButton.textContent = 'View Recommended Products';
    recommendedButton.className = 'btn';
    recommendedButton.style.backgroundColor = 'var(--primary-color)';
    recommendedButton.style.display = 'inline-block';
    recommendedButton.style.marginBottom = '20px';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    closeButton.className = 'btn';
    closeButton.style.backgroundColor = '#999';
    closeButton.style.marginLeft = '10px';
    
    // Close button event handler
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Add "take again" button
    const retakeButton = document.createElement('button');
    retakeButton.type = 'button';
    retakeButton.textContent = 'Take Quiz Again';
    retakeButton.style.display = 'block';
    retakeButton.style.margin = '20px auto 0';
    retakeButton.style.background = 'none';
    retakeButton.style.border = 'none';
    retakeButton.style.textDecoration = 'underline';
    retakeButton.style.cursor = 'pointer';
    retakeButton.style.color = 'var(--accent-color)';
    
    // Retake button event handler
    retakeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
        document.querySelector('.dosha-quiz-btn').click();
    });
    
    // Assemble result elements
    resultContent.appendChild(resultTitle);
    resultContent.appendChild(resultImage);
    resultContent.appendChild(resultDescription);
    resultContent.appendChild(recommendedButton);
    resultContent.appendChild(closeButton);
    resultContent.appendChild(retakeButton);
    
    // Add result content to modal
    modal.appendChild(resultContent);
    
    // Add click event for recommended products
    recommendedButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

// Call init dosha quiz
document.addEventListener('DOMContentLoaded', function() {
    initDoshaQuiz();
});