$(document).ready(function () {
  // Cache
  const $navbar = $("#navbar");
  const $hamburger = $("#hamburger");
  const $navMenu = $("#nav-menu");
  const $navLinks = $(".nav-link");
  const $contactForm = $("#contactForm");
  const $submitBtn = $("#submitBtn");
  const $toast = $("#toast");
  const $body = $("body");
  const $window = $(window);

  // Navbar scroll effect
  $window.on(
    "scroll",
    throttle(function () {
      if ($window.scrollTop() > 50) {
        $navbar.addClass("scrolled");
      } else {
        $navbar.removeClass("scrolled");
      }
    }, 16)
  );

  // Mobile menu toggle
  $hamburger.on("click", function () {
    $(this).toggleClass("active");
    $navMenu.toggleClass("active");
  });

  // Close mobile menu when clicking on links
  $navLinks.on("click", function () {
    $hamburger.removeClass("active");
    $navMenu.removeClass("active");
  });

  // Smooth scrolling for navigation links
  $navLinks.on("click", function (e) {
    e.preventDefault();
    const targetId = $(this).attr("href");
    const $targetSection = $(targetId);

    if ($targetSection.length) {
      const offsetTop = $targetSection.offset().top - 80;
      $("html, body").animate(
        {
          scrollTop: offsetTop,
        },
        800
      );
    }
  });

  // Active navigation link highlighting
  $window.on(
    "scroll",
    throttle(function () {
      const sections = $("section");
      const scrollPos = $window.scrollTop() + 100;

      sections.each(function () {
        const $section = $(this);
        const sectionTop = $section.offset().top;
        const sectionHeight = $section.outerHeight();
        const sectionId = $section.attr("id");

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          $navLinks.removeClass("active");
          $navLinks.filter(`[href="#${sectionId}"]`).addClass("active");
        }
      });
    }, 16)
  );

  // Skill bars animation with Intersection Observer
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const $skillBars = $(entry.target).find(".skill-progress");
        $skillBars.each(function () {
          const $bar = $(this);
          const width = $bar.data("width");
          if (width) {
            setTimeout(() => {
              $bar.css("width", width + "%");
            }, 200);
          }
        });
      }
    });
  }, observerOptions);

  // Observe skills section
  const $skillsSection = $("#skills");
  if ($skillsSection.length) {
    skillObserver.observe($skillsSection[0]);
  }

  // Fade-in animation observer
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).css({
            opacity: "1",
            transform: "translateY(0)",
          });
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Initialize fade-in animations
  const $animateElements = $(".about-card, .skill-item, .contact-item");
  $animateElements.each(function () {
    $(this).css({
      opacity: "0",
      transform: "translateY(30px)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
    });
    fadeObserver.observe(this);
  });

  // Typing effect for hero section
  const $heroTitle = $(".title-name");
  if ($heroTitle.length) {
    const text = $heroTitle.text();
    $heroTitle.text("");
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        $heroTitle.text($heroTitle.text() + text.charAt(i));
        i++;
        setTimeout(typeWriter, 150);
      }
    };

    setTimeout(typeWriter, 1000);
  }

  // Contact form handling
  $contactForm.on("submit", async function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: $("#name").val(),
      email: $("#email").val(),
      subject: $("#subject").val(),
      message: $("#message").val(),
    };

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    // Show loading state
    $submitBtn.addClass("loading").prop("disabled", true);

    try {
      // EmailJS template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "stallplayz123@gmail.com",
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        "service_0958elr",
        "template_ncduz2t",
        templateParams
      );

      if (response.status === 200) {
        showToast("Message sent successfully!", "success");
        $contactForm[0].reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      // Remove loading state
      $submitBtn.removeClass("loading").prop("disabled", false);
    }
  });

  // Toast notification function
  function showToast(message, type = "success") {
    const $toastMessage = $toast.find(".toast-message");
    const $toastIcon = $toast.find("i");

    // Update message
    $toastMessage.text(message);

    // Update icon based on type
    $toastIcon.attr(
      "data-feather",
      type === "success" ? "check-circle" : "alert-circle"
    );
    if (typeof feather !== "undefined") {
      feather.replace();
    }

    // Update toast color
    $toast.css("background", type === "success" ? "var(--primary)" : "#ef4444");

    // Show toast
    $toast.addClass("show");

    // Hide toast after 3 seconds
    setTimeout(() => {
      $toast.removeClass("show");
    }, 3000);
  }

  // Parallax effect for hero section
  $window.on(
    "scroll",
    throttle(function () {
      const scrolled = $window.scrollTop();
      const $heroImage = $(".profile-image");

      if ($heroImage.length && scrolled < $window.height()) {
        $heroImage.css("transform", `translateY(${scrolled * 0.3}px)`);
      }
    }, 16)
  );

  // Lazy loading for images
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const $img = $(entry.target);

          // Only apply fade effect to images that aren't already visible
          if (entry.target.complete && entry.target.naturalHeight !== 0) {
            $img.css("opacity", "1");
          } else {
            $img.css({
              opacity: "0",
              transition: "opacity 0.3s ease",
            });

            $img.on("load", function () {
              $(this).css("opacity", "1");
            });
          }

          imageObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all images
  $("img[src]").each(function () {
    imageObserver.observe(this);
  });

  // Timeline animation
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const $timelineContent = $(entry.target).find(".timeline-content");
          const $achievementCard = $(entry.target).find(".achievement-card");

          $timelineContent.css({
            opacity: "1",
            transform: "translateX(0)",
          });

          $achievementCard.css({
            opacity: "1",
            transform: "translateX(0)",
          });
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Initialize timeline animations
  $(".timeline-item").each(function (index) {
    const $item = $(this);
    const $timelineContent = $item.find(".timeline-content");
    const $achievementCard = $item.find(".achievement-card");

    // Apply initial styles to containers
    $timelineContent.css({
      opacity: "0",
      transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${
        index * 0.1
      }s`,
      transform: index % 2 === 0 ? "translateX(-50px)" : "translateX(50px)",
    });

    $achievementCard.css({
      opacity: "0",
      transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${
        index * 0.1
      }s`,
      transform: index % 2 === 0 ? "translateX(-50px)" : "translateX(50px)",
    });

    timelineObserver.observe(this);
  });

  // Handle contact form input focus states
  $("input, textarea")
    .on("focus", function () {
      $(this).parent().addClass("focused");
    })
    .on("blur", function () {
      if (!$(this).val()) {
        $(this).parent().removeClass("focused");
      }
    })
    .each(function () {
      // Check if input has value on page load
      if ($(this).val()) {
        $(this).parent().addClass("focused");
      }
    });

  // Add ripple effect to buttons
  function createRipple(event) {
    const $button = $(event.currentTarget);
    const $circle = $("<span>").addClass("ripple");
    const diameter = Math.max($button.outerWidth(), $button.outerHeight());
    const radius = diameter / 2;

    $circle.css({
      width: diameter + "px",
      height: diameter + "px",
      left: event.pageX - $button.offset().left - radius + "px",
      top: event.pageY - $button.offset().top - radius + "px",
    });

    // Remove existing ripple
    $button.find(".ripple").remove();
    $button.append($circle);
  }

  // Add ripple CSS dynamically
  $("<style>")
    .prop("type", "text/css")
    .html(
      `
      .btn {
        position: relative;
        overflow: hidden;
      }
      
      .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 600ms linear;
        background-color: rgba(255, 255, 255, 0.6);
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `
    )
    .appendTo("head");

  // Apply ripple effect to all buttons
  $(".btn").on("click", createRipple);

  // Scroll to top functionality
  const scrollToTop = () => {
    $("html, body").animate({ scrollTop: 0 }, 800);
  };

  // Create scroll to top button
  const createScrollToTopButton = () => {
    const $button = $(
      '<button class="scroll-to-top"><i data-feather="arrow-up"></i></button>'
    );
    $button.on("click", scrollToTop);

    const styles = `
      .scroll-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        border: none;
        box-shadow: var(--shadow-lg);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 999;
      }
      
      .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
      }
      
      .scroll-to-top:hover {
        background: var(--secondary);
        transform: translateY(-2px);
      }
      
      @media (max-width: 768px) {
        .scroll-to-top {
          bottom: 1rem;
          right: 1rem;
          width: 45px;
          height: 45px;
        }
      }
    `;

    if (!$("#scroll-to-top-styles").length) {
      $("<style>")
        .attr("id", "scroll-to-top-styles")
        .html(styles)
        .appendTo("head");
    }

    $body.append($button);

    // Show/hide button based on scroll position
    $window.on(
      "scroll",
      throttle(function () {
        if ($window.scrollTop() > 500) {
          $button.addClass("visible");
        } else {
          $button.removeClass("visible");
        }
      }, 16)
    );

    // Update feather icons after adding button
    setTimeout(() => {
      if (typeof feather !== "undefined") {
        feather.replace();
      }
    }, 100);
  };

  // Initialize scroll to top button
  createScrollToTopButton();

  // Performance optimization: Throttle function
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Preload images for better performance
  const preloadImages = () => {
    const imageUrls = [
      "Saya.jpg",
      "/img/skill/html.png",
      "/img/skill/css.png",
      "/img/skill/javascript.png",
      "/img/skill/C++.png",
      "/img/skill/minecraft.png",
      "/img/skill/sekiro.png",
      "/img/skill/ds3.png",
      "/img/skill/factorio.png",
    ];

    $.each(imageUrls, function (index, url) {
      $("<img>").attr("src", url);
    });
  };

  // Initialize preloading
  preloadImages();

  // Add loading states for better UX
  $('a[href^="http"]').on("click", function (e) {
    const $link = $(this);

    if (
      $link.attr("target") === "_blank" ||
      $link.attr("href").includes("mailto:") ||
      $link.attr("href").includes("tel:")
    ) {
      return;
    }

    $link.css({
      opacity: "0.7",
      pointerEvents: "none",
    });

    setTimeout(() => {
      $link.css({
        opacity: "1",
        pointerEvents: "auto",
      });
    }, 1000);
  });

  // Add keyboard navigation support
  $(document).on("keydown", function (e) {
    // ESC key closes mobile menu
    if (e.key === "Escape" && $navMenu.hasClass("active")) {
      $hamburger.removeClass("active");
      $navMenu.removeClass("active");
    }

    // Enter key on hamburger menu
    if (e.key === "Enter" && $(e.target).is($hamburger)) {
      $hamburger.trigger("click");
    }
  });

  // Make hamburger menu accessible
  $hamburger.attr({
    role: "button",
    "aria-label": "Toggle navigation menu",
    tabindex: "0",
  });

  // Add focus visible styles
  $("<style>")
    .html(
      `
      .hamburger:focus-visible,
      .nav-link:focus-visible,
      .btn:focus-visible,
      input:focus-visible,
      textarea:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
    `
    )
    .appendTo("head");

  // Enhanced error handling for EmailJS
  const initEmailJS = () => {
    if (typeof emailjs === "undefined") {
      console.warn("EmailJS not loaded. Contact form will not work.");
      return;
    }

    const SERVICE_ID = "service_0958elr";
    const TEMPLATE_ID = "template_ncduz2t";
    const PUBLIC_KEY = "SUN5kVn5DG8LrBP0Y";

    try {
      emailjs.init({
        publicKey: PUBLIC_KEY,
      });
    } catch (error) {
      console.error("EmailJS initialization failed:", error);
    }
  };

  // Initialize EmailJS
  initEmailJS();

  // Console welcome message
  console.log(
    "%c👋 Hello Developer!",
    "color: #6366f1; font-size: 24px; font-weight: bold;"
  );
  console.log(
    "%cThanks for checking out the code! Feel free to reach out if you have any questions.",
    "color: #64748b; font-size: 14px;"
  );
  console.log(
    "%c📧 stallplayz123@gmail.com",
    "color: #06b6d4; font-size: 14px;"
  );

  // Export functions for potential external use
  window.portfolioUtils = {
    showToast,
    scrollToTop,
    createRipple,
    throttle,
  };
});

// Simplified page load event - no longer needed for opacity management
$(window).on("load", function () {
  // Just add a loaded class for any CSS that might need it
  $("body").addClass("loaded");
});
