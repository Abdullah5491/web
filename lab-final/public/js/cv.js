$(document).ready(function () {
  'use strict';

  // Add smooth reveal animation on page load
  $('.cv-card').each(function (index) {
    $(this).css({
      'opacity': '0',
      'transform': 'translateY(30px)'
    });

    setTimeout(() => {
      $(this).css({
        'opacity': '1',
        'transform': 'translateY(0)',
        'transition': 'opacity 0.6s ease, transform 0.6s ease'
      });
    }, index * 150);
  });

  // Track expanded state for mobile
  let expandedCard = null;

  // Handle card click for mobile devices
  $('.cv-card').on('click', function (e) {
    // Only on mobile/tablet (max-width: 1024px)
    if ($(window).width() <= 1024) {
      e.stopPropagation();

      const $card = $(this);
      const $body = $card.find('.cv-card-body');

      // If this card is already expanded, collapse it
      if ($card.hasClass('expanded')) {
        $card.removeClass('expanded');
        $body.slideUp(400);
        expandedCard = null;
      } else {
        // Collapse any previously expanded card
        if (expandedCard) {
          expandedCard.removeClass('expanded');
          expandedCard.find('.cv-card-body').slideUp(400);
        }

        // Expand this card
        $card.addClass('expanded');
        $body.slideDown(400);
        expandedCard = $card;

        // Scroll to card header smoothly
        setTimeout(() => {
          $('html, body').animate({
            scrollTop: $card.offset().top - 20
          }, 300);
        }, 100);
      }
    }
  });

  // Add indicator icon for mobile
  if ($(window).width() <= 1024) {
    $('.cv-card-header').append('<span class="mobile-indicator">▼</span>');

    // Add styles for mobile indicator
    $('<style>')
      .text(`
        .mobile-indicator {
          margin-left: auto;
          font-size: 16px;
          color: #fff;
          transition: transform 0.3s ease;
        }
        .cv-card.expanded .mobile-indicator {
          transform: rotate(180deg);
        }
        @media (min-width: 1025px) {
          .mobile-indicator {
            display: none;
          }
        }
      `)
      .appendTo('head');
  }

  // Handle window resize
  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Reset mobile functionality if switching to desktop
      if ($(window).width() > 1024) {
        $('.cv-card').removeClass('expanded');
        $('.cv-card-body').removeAttr('style');
        expandedCard = null;
        $('.mobile-indicator').remove();
      } else if ($('.mobile-indicator').length === 0) {
        // Add indicator if switching to mobile
        $('.cv-card-header').append('<span class="mobile-indicator">▼</span>');
      }
    }, 250);
  });

  // Smooth scroll for anchor links
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    const target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 80
      }, 600);
    }
  });

  // Add animation to skill items on hover (desktop only)
  if ($(window).width() > 1024) {
    $('.cv-skill-category li').each(function () {
      $(this).on('mouseenter', function () {
        $(this).css({
          'transform': 'translateX(5px)',
          'transition': 'transform 0.2s ease'
        });
      }).on('mouseleave', function () {
        $(this).css('transform', 'translateX(0)');
      });
    });
  }

  // Add copy to clipboard functionality for contact items (including sidebar)
  $('.cv-contact-item, .cv-sidebar-contact-item').on('click', function () {
    const text = $(this).find('span').text();

    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
      });
    } else {
      fallbackCopyToClipboard(text);
    }
  });

  // Fallback copy function for older browsers
  function fallbackCopyToClipboard(text) {
    const $temp = $('<textarea>');
    $('body').append($temp);
    $temp.val(text).select();
    try {
      document.execCommand('copy');
      showNotification('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text');
    }
    $temp.remove();
  }

  // Show notification function
  function showNotification(message) {
    // Remove any existing notification
    $('.cv-notification').remove();

    const $notification = $('<div class="cv-notification">')
      .text(message)
      .css({
        'position': 'fixed',
        'bottom': '30px',
        'right': '30px',
        'background': '#393b6a',
        'color': '#fff',
        'padding': '15px 25px',
        'border-radius': '6px',
        'box-shadow': '0 4px 12px rgba(0,0,0,0.3)',
        'z-index': '9999',
        'font-family': 'Raleway, Arial, Helvetica, sans-serif',
        'font-size': '14px',
        'font-weight': '600',
        'opacity': '0',
        'transform': 'translateY(20px)',
        'transition': 'opacity 0.3s ease, transform 0.3s ease'
      })
      .appendTo('body');

    // Animate in
    setTimeout(() => {
      $notification.css({
        'opacity': '1',
        'transform': 'translateY(0)'
      });
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      $notification.css({
        'opacity': '0',
        'transform': 'translateY(20px)'
      });
      setTimeout(() => {
        $notification.remove();
      }, 300);
    }, 2000);
  }


  // Add tooltip on hover for contact items (including sidebar)
  $('.cv-contact-item, .cv-sidebar-contact-item').each(function () {
    $(this).attr('title', 'Click to copy');
    $(this).css('cursor', 'pointer');
  });

  // Log loaded message
  console.log('%c✓ CV Interactive Features Loaded', 'color: #393b6a; font-weight: bold; font-size: 14px;');
  console.log('%c• Hover over sections to reveal details (Desktop)', 'color: #666; font-size: 12px;');
  console.log('%c• Click on sections to expand (Mobile)', 'color: #666; font-size: 12px;');
  console.log('%c• Click contact items to copy to clipboard', 'color: #666; font-size: 12px;');
  console.log('%c• Use Print button to print your CV', 'color: #666; font-size: 12px;');
});

