import React, { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <div className="App">
      <Header 
        cartCount={cartCount} 
        onCartOpen={() => setCartOpen(true)}
        onContactOpen={() => setShowContact(true)} 
      />

      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <DoshaSection />
        <TestimonialsSection />
        <BlogSection />
        <NewsletterSection />
        <ContactSection onContactOpen={() => setShowContact(true)} />
      </main>

      <Footer />

      {/* 🛒 Cart Popup */}
      {cartOpen && (
        <CartPopup
          onClose={() => setCartOpen(false)}
          onProceedToCheckout={() => {
            setCartOpen(false);
            setTimeout(() => setShowPayment(true), 300);
          }}
        />
      )}

      {/* 💳 Payment Methods Popup */}
      {showPayment && (
        <PaymentMethods
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={() => {
            setShowPayment(false);
            setPaymentSuccess(true);
          }}
        />
      )}

      {/* ✅ Payment Success Popup */}
      {paymentSuccess && <PaymentSuccess onClose={() => setPaymentSuccess(false)} />}

      {/* 📞 Contact Popup */}
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
    </div>
  );
}

// 🔥 **Header Component (Fixed `onContactOpen` prop)**
function Header({ cartCount, onCartOpen, onContactOpen }) {
  return (
    <header>
      <div className="logo-container">
        <h1>Prakruti Organics</h1>
      </div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#doshas">Doshas</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><button onClick={onContactOpen} className="contact-btn">Contact</button></li>
          <li>
            <button className="cart-icon" onClick={onCartOpen}>
              🛒 Cart <span className="cart-count">{cartCount}</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

// 📞 **Contact Section**
const ContactSection = ({ onContactOpen }) => {
  return (
    <section id="contact" className="contact-section">
      <h2>Contact Us</h2>
      <p>Have questions? Reach out to us!</p>
      <button className="open-contact-popup" onClick={onContactOpen}>
        Open Contact Form
      </button>
    </section>
  );
};

// 📞 **Contact Popup**
const ContactPopup = ({ onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent to: ${phone}`);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="close-btn-top" onClick={onClose}>×</button>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
          <button type="submit" className="send-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

const CartPopup = ({ onClose, onProceedToCheckout }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // 🗑️ Remove Item Safely
  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Ensure the cart state update is reflected in the header/cart count
    window.dispatchEvent(new Event("storage"));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="close-btn-top" onClick={onClose}>×</button>
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p className="empty-cart-text">Your cart is empty</p>
        ) : (
          <>
            <ul className="cart-items-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>₹{item.price} x {item.quantity}</p>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>🗑️</button>
                </li>
              ))}
            </ul>
            <hr className="cart-divider" />
            <div className="cart-total">
              <span>TOTAL:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </>
        )}

        <button 
          className="checkout-btn" 
          onClick={() => {
            localStorage.setItem("cart", JSON.stringify(cart)); // Ensure latest cart is saved
            onProceedToCheckout();
          }} 
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </button>
        <button className="continue-btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
// 💳 **Payment Methods**
const PaymentMethods = ({ onClose, onPaymentSuccess }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    alert("Processing Payment...");
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Select Payment Method</h2>
        <button className="payment-btn" onClick={handlePayment}>💳 Pay with Razorpay</button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// ✅ **Payment Success**
const PaymentSuccess = ({ onClose }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for your purchase.</p>
      <button onClick={onClose} className="close-btn">OK</button>
    </div>
  </div>
);

// Hero Section Component
function HeroSection() {
  const [showDoshaQuiz, setShowDoshaQuiz] = useState(false);
  
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h2>Natural Ayurvedic Products for Modern Living</h2>
        <p>Discover the ancient wisdom of Ayurveda with our organic, sustainably sourced products</p>
        <a href="#products" className="btn">Shop Now</a>
        <button 
          className="dosha-quiz-btn btn secondary"
          onClick={() => setShowDoshaQuiz(true)}
        >
          Take Dosha Quiz
        </button>
      </div>
      
      {showDoshaQuiz && <DoshaQuiz onClose={() => setShowDoshaQuiz(false)} />}
    </section>
  );
}

// About Section Component
function AboutSection() {
  return (
    <section id="about" className="about">
      <h2>Our Story</h2>
      <div className="about-content">
        <div className="about-image">
          <img src="https://media.licdn.com/dms/image/v2/C560BAQGLkqvQ52y-bQ/company-logo_200_200/company-logo_200_200/0/1630593082638/one_earth_projects_india_logo?e=2147483647&v=beta&t=33OdpmkxKkPqdYhp02MvcUjnxUxvf3kF09paGmKEfb4" alt="Prakruti Organics herbs and ingredients" />
        </div>
        <div className="about-text">
          <h3>Rooted in Tradition, Crafted with Care</h3>
          <p>
            Prakruti Organics was founded on the belief that the ancient wisdom of Ayurveda 
            holds the key to balanced, healthy living in our modern world. Our journey began 
            in the foothills of the Himalayas, where our founder, Amita Sharma, was introduced 
            to traditional Ayurvedic recipes by her grandmother.
          </p>
          <p>
            Today, we work directly with small-scale farmers across India who use sustainable, 
            organic farming methods to grow the finest herbs and botanicals. Each product is 
            handcrafted in small batches to ensure quality and potency, keeping the tradition 
            of Ayurveda alive while making it accessible to everyone.
          </p>
          <button className="read-more">Read more about our story</button>
        </div>
      </div>
    </section>
  );
}

// Products Section Component
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    // Sample product data
    const sampleProducts = [
      {
        id: 1,
        name: 'Vata Balancing Oil',
        description: 'Nourishing sesame oil blend with warming herbs',
        price: 850,
        category: 'vata',
        image: 'https://m.media-amazon.com/images/I/718e00LD7wL.jpg'
      },
      {
        id: 2,
        name: 'Pitta Cooling Cream',
        description: 'Soothing aloe and sandalwood blend',
        price: 750,
        category: 'pitta',
        image: 'https://m.media-amazon.com/images/I/51NbKTlpTgL.jpg'
      },
      {
        id: 3,
        name: 'Kapha Energizing Tea',
        description: 'Spicy ginger and tulsi blend',
        price: 450,
        category: 'kapha',
        image: 'https://www.teacurry.com/cdn/shop/products/ayushkadhatea_2_1_-min.jpg?v=1711692581'
      },
      {
        id: 4,
        name: 'Triphala Powder',
        description: 'Traditional digestive support blend',
        price: 550,
        category: 'all',
        image: 'https://m.media-amazon.com/images/I/71gsoP3kKZL.jpg'
      },
      {
        id: 5,
        name: 'Ashwagandha Root',
        description: 'Adaptogenic herb for stress relief',
        price: 650,
        category: 'vata',
        image: 'https://m.media-amazon.com/images/I/61t4MrH7LyL.jpg'
      },
      {
        id: 6,
        name: 'Brahmi Hair Oil',
        description: 'Nourishing hair treatment with brahmi',
        price: 750,
        category: 'pitta',
        image: 'https://rukminim2.flixcart.com/image/850/1000/jepzrm80/hair-oil/k/z/d/100-anti-hairfall-sesame-ayush-original-imaf3chzdmbrqzdj.jpeg?q=20&crop=false'
      },
      {
        id: 7,
        name: 'Neem Face Wash',
        description: 'Purifying cleanser with neem and turmeric',
        price: 550,
        category: 'kapha',
        image: 'https://ikrishwellness.com/uploads/products/production-20240113110738-zwf2j.jpg'
      },
      {
        id: 8,
        name: 'Rose Water Toner',
        description: 'Cooling, soothing facial toner',
        price: 450,
        category: 'pitta',
        image: 'https://www.thenaturalwash.com/cdn/shop/files/product_-ingredients100.jpg?v=1699004457'
      }
    ];
    
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);
  
  const filterProducts = (category) => {
    setActiveFilter(category);
    
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category === category || product.category === 'all'
      );
      setFilteredProducts(filtered);
    }
  };
  
  const addToCart = (product) => {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
      // Increase quantity
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product
      cart.push({
        ...product,
        quantity: 1
      });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in header
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
    
    // Show message
    alert(`Added ${product.name} to cart!`);
  };
  
  return (
    <section id="products" className="products">
      <h2>Our Products</h2>
      
      <div className="products-filter">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => filterProducts('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'vata' ? 'active' : ''}`}
          onClick={() => filterProducts('vata')}
        >
          Vata
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'pitta' ? 'active' : ''}`}
          onClick={() => filterProducts('pitta')}
        >
          Pitta
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'kapha' ? 'active' : ''}`}
          onClick={() => filterProducts('kapha')}
        >
          Kapha
        </button>
      </div>
      
      <div className="products-container">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card" data-category={product.category}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">₹{product.price}</p>
            <button 
              className="add-to-cart btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// Dosha Section Component
function DoshaSection() {
  return (
    <section id="doshas" className="doshas">
      <h2>Understand Your Dosha</h2>
      <p className="section-desc">
        Ayurveda teaches us that each person has a unique constitution, or dosha. 
        Understanding your dosha helps you choose the right products for your needs.
      </p>
      
      <div className="dosha-cards">
        <div className="dosha-card vata">
          <h3>Vata</h3>
          <img src="https://www.planetayurveda.com/pa-wp-images/Vata-Logo.jpg" alt="Vata Dosha" />
          <p>
            Vata types are creative, energetic, and quick-thinking. They benefit from 
            warming, grounding, and nourishing products.
          </p>
          <a href="https://en.wikipedia.org/wiki/Vata" className="btn">Vata Products</a>
        </div>
        
        <div className="dosha-card pitta">
          <h3>Pitta</h3>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr4FG2eF_3yvdFS8ogIriby-jD5xywoTbXHQ&s"  alt="Pitta Dosha" />
          <p>
            Pitta types are focused, passionate, and driven. They benefit from 
            cooling, soothing, and balancing products.
          </p>
          <a href="https://en.wikipedia.org/wiki/Dosha"className="btn">Pitta Products</a>
        </div>
        
        <div className="dosha-card kapha">
          <h3>Kapha</h3>
          <img src="https://www.planetayurveda.com/wp-content/uploads/2024/04/kapha-logo.jpg" alt="Kapha Dosha" />
          <p>
            Kapha types are steady, compassionate, and grounded. They benefit from 
            warming, stimulating, and energizing products.
          </p>
          <a href="https://ayurwiki.org/Ayurwiki/Kapha" className="btn">Kapha Products</a>
        </div>
      </div>
    </section>
  );
}

// Dosha Quiz Component
function DoshaQuiz({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  
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
    },
    {
      id: 'sleep',
      text: 'How would you describe your sleep pattern?',
      options: [
        { value: 'vata', text: 'Light sleeper, tendency to wake up' },
        { value: 'pitta', text: 'Moderate sleep, wake up feeling refreshed' },
        { value: 'kapha', text: 'Heavy sleeper, difficult to wake up' }
      ]
    },
    {
      id: 'mind',
      text: 'How would you describe your mind?',
      options: [
        { value: 'vata', text: 'Quick, creative, easily distracted' },
        { value: 'pitta', text: 'Focused, determined, competitive' },
        { value: 'kapha', text: 'Calm, loyal, methodical' }
      ]
    }
  ];
  
  const handleAnswer = (value) => {
    const updatedAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(updatedAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };
  
  const calculateResult = (allAnswers) => {
    let vataCount = 0;
    let pittaCount = 0;
    let kaphaCount = 0;
    
    Object.values(allAnswers).forEach(answer => {
      if (answer === 'vata') vataCount++;
      if (answer === 'pitta') pittaCount++;
      if (answer === 'kapha') kaphaCount++;
    });
    
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
    
    setResult(dominantDosha);
  };
  
  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };
  
  const doshaDescriptions = {
    vata: 'Vata types are creative, energetic, and quick-thinking. Your products should include warming herbs and foods, nourishing oils, and grounding spices.',
    pitta: 'Pitta types are focused, passionate, and driven. Your products should include cooling herbs, soothing spices, and balancing foods.',
    kapha: 'Kapha types are steady, compassionate, and grounded. Your products should include stimulating herbs, warming spices, and light, energizing foods.'
  };
  
  return (
    <div className="quiz-modal">
      <div className="quiz-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        {!result ? (
          <>
            <h2>Discover Your Dosha Type</h2>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{width: `${(currentStep / questions.length) * 100}%`}}
              ></div>
            </div>
            
            <h3>{questions[currentStep].text}</h3>
            
            <div className="options">
              {questions[currentStep].options.map((option, index) => (
                <button 
                  key={index} 
                  className="option-btn"
                  onClick={() => handleAnswer(option.value)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <h2>Your Dominant Dosha: {result.charAt(0).toUpperCase() + result.slice(1)}</h2>
            <img src={`/images/${result}-dosha.jpg`} alt={`${result} dosha`} />
            <p>{doshaDescriptions[result]}</p>
            
            <div className="result-buttons">
              <a href={`#${result}-products`} className="btn" onClick={onClose}>
                View Recommended Products
              </a>
              <button className="btn secondary" onClick={resetQuiz}>
                Take Quiz Again
              </button>
              <button className="close-text" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// Testimonials Section Component
function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'I ve been using the Vata Balancing Oil for three months now, and it has completely transformed my dry skin. I feel more grounded and balanced.',
      image: 'https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8='
    },
    {
      id: 2,
      name: 'Arjun Patel',
      location: 'Bangalore',
      text: 'The Pitta Cooling Cream has been a lifesaver during summers. It calms my skin inflammation and helps me stay cool and composed.',
      image: 'https://media.licdn.com/dms/image/v2/C5603AQHcKz-zZz5n-A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517703288857?e=2147483647&v=beta&t=GjCiOGUTqorw2n8RQgDlElFFn_sDUKH0OEStbNux_oY'
    },
    {
      id: 3,
      name: 'Meera Reddy',
      location: 'Chennai',
      text: 'I love the Kapha Energizing Tea! It gives me the perfect boost in the morning without the jitters of coffee. Highly recommend!',
      image: 'https://media.istockphoto.com/id/1369508766/photo/beautiful-successful-latin-woman-smiling.jpg?s=612x612&w=0&k=20&c=LoznG6eGT42_rs9G1dOLumOTlAveLpuOi_U755l_fqI='
    }
  ];
  
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };
  
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="testimonials">
      <h2>What Our Customers Say</h2>
      
      <div className="testimonial-slider">
        <button className="slider-btn prev" onClick={prevTestimonial}>❮</button>
        
        <div className="testimonial-card">
          <div className="testimonial-image">
            <img 
              src={testimonials[currentTestimonial].image} 
              alt={testimonials[currentTestimonial].name} 
            />
          </div>
          <div className="testimonial-content">
            <p>"{testimonials[currentTestimonial].text}"</p>
            <h4>{testimonials[currentTestimonial].name}</h4>
            <p className="location">{testimonials[currentTestimonial].location}</p>
          </div>
        </div>
        
        <button className="slider-btn next" onClick={nextTestimonial}>❯</button>
      </div>
      
      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <button 
            key={index} 
            className={`dot ${index === currentTestimonial ? 'active' : ''}`}
            onClick={() => setCurrentTestimonial(index)}
          ></button>
        ))}
      </div>
    </section>
  );
}

// Blog Section Component
function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Your Dosha for Better Health',
      excerpt: 'Learn how knowing your dosha can help you make better lifestyle choices...',
      image: 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=640:*',
      date: 'March 15, 2025',
      author: 'Dr. Amita Sharma'
    },
    {
      id: 2,
      title: 'Seasonal Eating: Ayurvedic Guide',
      excerpt: 'Discover how to adjust your diet according to the seasons for optimal health...',
      image: 'https://www.future-doctor.de/wp-content/uploads/2024/08/shutterstock_2480850611.jpg',
      date: 'February 28, 2025',
      author: 'Rahul Mehra'
    },
    {
      id: 3,
      title: 'DIY Ayurvedic Face Masks for Glowing Skin',
      excerpt: 'Try these simple homemade face masks using kitchen ingredients...',
      image: 'https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?semt=ais_hybrid&w=740',
      date: 'January 20, 2025',
      author: 'Priya Patel'
    }
  ];
  
return (
  <section id="blog" className="blog">
    <h2>Ayurvedic Wisdom Blog</h2>
    
    <div className="blog-posts">
      {blogPosts.map(post => (
        <article key={post.id} className="blog-card">
          <div className="blog-image">
            <img src={post.image} alt={post.title} />
          </div>
          <div className="blog-content">
            <h3>{post.title}</h3>
            <div className="blog-meta">
              <span className="date">{post.date}</span>
              <span className="author">By {post.author}</span>
            </div>
            <p>{post.excerpt}</p>
           <a href="https://example.com/product/123" className="small-btn" target="_blank" rel="noopener                noreferrer">Details</a>
          </div>
        </article>
      ))}
    </div>
    
    <a href="https://organicallyblissful.com/" className="btn view-all">View All Blog Posts</a>
  </section>
);
}


function NewsletterSection() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated with our latest products, promotions, and Ayurvedic wisdom.</p>

        {/* Replace YOUR_GETFORM_URL with the copied endpoint */}
        <form action="https://getform.io/f/akkyvxea" method="POST">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Your Name" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Your Email" 
              required 
            />
          </div>

          <button type="submit" className="btn">Subscribe Now</button>
        </form>
      </div>
    </section>
  );
}// Footer Component
function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <img src="https://media.licdn.com/dms/image/v2/C560BAQGLkqvQ52y-bQ/company-logo_200_200/company-logo_200_200/0/1630593082638/one_earth_projects_india_logo?e=2147483647&v=beta&t=33OdpmkxKkPqdYhp02MvcUjnxUxvf3kF09paGmKEfb4" alt="Prakruti Organics Logo" />
          <h3>Prakruti Organics</h3>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Products</h4>
            <ul>
              <li><a href="#vata-products">Vata Balancing</a></li>
              <li><a href="#pitta-products">Pitta Cooling</a></li>
              <li><a href="#kapha-products">Kapha Energizing</a></li>
              <li><a href="#all-products">All Products</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p>Email: info@prakrutiorganics.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: 123 Ayurveda Lane, Mumbai, India</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Prakruti Organics. All Rights Reserved.</p>
        <div className="social-icons">
          <a href="#facebook">F</a>
          <a href="#instagram">I</a>
          <a href="#twitter">T</a>
          <a href="#youtube">Y</a>
        </div>
      </div>
    </footer>
  );
}

export default App;
