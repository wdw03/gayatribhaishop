import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import type { Product, View } from "../../types"
import Button from "../common/Button"
import Icon from "../common/Icon"

export interface SlideData {
  id: number
  eyebrow: string
  title: string
  italicTitle: string
  description: string
  desktopImage: string
  mobileImage: string
  tag: string
  badge: string
  locationNote: string
  stats: { val: string label: string }[]
  ctaText: string
  secondaryCta: string
  targetCategory?: string
  productId?: string
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    eyebrow: "Summer Atelier 2026",
    title: "Artisanal Linen",
    italicTitle: "woven by hand.",
    description: "Pure linen, handcrafted in small batches.",
    desktopImage: "/assets/site_banners/slide1_desktop.jpg",
    mobileImage: "/assets/site_banners/slide1_mobile.jpg",
    tag: "SUMMER ATELIER",
    badge: "Limited Edition",
    locationNote: "HANDCRAFTED IN INDIA",
    stats: [],
    ctaText: "Shop Collection",
    secondaryCta: "Explore Edit",
  },
  {
    id: 2,
    eyebrow: "The Resort Edit",
    title: "Coastal State",
    italicTitle: "ocean breeze.",
    description: "Airy cuban collars for summer days.",
    desktopImage: "/assets/site_banners/slide2_desktop.jpg",
    mobileImage: "/assets/site_banners/slide2_mobile.jpg",
    tag: "COASTAL RESORT",
    badge: "Artisan Series",
    locationNote: "RESORT COLLECTION",
    stats: [],
    ctaText: "Shop Resort",
    secondaryCta: "View Lookbook",
  },
  {
    id: 3,
    eyebrow: "Private Atelier",
    title: "After Dark",
    italicTitle: "evening tailoring.",
    description: "Midnight tones with gold stitch finish.",
    desktopImage: "/assets/site_banners/slide3_desktop.jpg",
    mobileImage: "/assets/site_banners/slide3_mobile.jpg",
    tag: "AFTER DARK",
    badge: "Private Vault",
    locationNote: "EVENING EDIT",
    stats: [],
    ctaText: "Shop Evening",
    secondaryCta: "View Vault",
  },
]

export interface HeroSliderProps {
  go: (v: View) => void
  openProduct: (p: Product) => void
  products: Product[]
}

export function HeroSlider({ go, openProduct, products }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")

  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const textContainerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  const progressLineRef = useRef<HTMLDivElement>(null)

  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isAnimating = useRef(false)

  // 2-second auto-slide timer
  useEffect(() => {
    if (isPaused) {
      if (progressLineRef.current) {
        gsap.killTweensOf(progressLineRef.current)
      }
      return
    }

    // Animate progress bar from 0% to 100% over 2 seconds
    if (progressLineRef.current) {
      gsap.fromTo(progressLineRef.current, { width: "0%" }, {
        width: "100%",
        duration: 2,
        ease: "linear",
      })
    }

    timerRef.current = setTimeout(() => {
      setDirection("next")
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 2000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressLineRef.current) gsap.killTweensOf(progressLineRef.current)
    }
  }, [current, isPaused])

  // GSAP 3D Slide Transition from Right
  useEffect(() => {
    const activeSlide = slideRefs.current[current]
    if (!activeSlide || !containerRef.current) return

    isAnimating.current = true

    // Context for clean GSAP garbage collection
    const ctx = gsap.context(
      () => {
        const fromRight = direction === "next"

        // Slide container 3D perspective setup
        gsap.set(containerRef.current, {
          perspective: 1400,
          transformStyle: "preserve-3d",
        })

        // Image Parallax & 3D Tilt entry from right side
        const img = activeSlide.querySelector(".slider-img-wrap")
        if (img) {
          gsap.fromTo(
            img,
            {
              xPercent: fromRight ? 35 : -35,
              rotationY: fromRight ? 18 : -18,
              z: -120,
              scale: 1.12,
              opacity: 0.3,
            },
            {
              xPercent: 0,
              rotationY: 0,
              z: 0,
              scale: 1,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
            },
          )
        }

        // Backdrop 3D ambient aura
        const aura = activeSlide.querySelector(".slider-ambient-glow")
        if (aura) {
          gsap.fromTo(aura, { opacity: 0, scale: 0.8 }, {
            opacity: 0.7,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
          })
        }

        // Text animations with 3D flip-up and staggered reveal
        const eyebrow = activeSlide.querySelector(".slide-eyebrow")
        const titleMain = activeSlide.querySelector(".slide-title-main")
        const titleItalic = activeSlide.querySelector(".slide-title-italic")
        const desc = activeSlide.querySelector(".slide-desc")
        const actions = activeSlide.querySelector(".slide-actions")
        const proof = activeSlide.querySelector(".slide-proof")
        const floatingBadge = activeSlide.querySelector(".slide-floating-badge")

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating.current = false
          },
        })

        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { y: -20, opacity: 0, letterSpacing: "0.45em" },
            {
              y: 0,
              opacity: 1,
              letterSpacing: "0.28em",
              duration: 0.4,
              ease: "power2.out",
            },
            0.05,
          )
        }

        if (titleMain) {
          tl.fromTo(
            titleMain,
            {
              y: 35,
              rotationX: 35,
              opacity: 0,
              transformOrigin: "bottom left",
            },
            {
              y: 0,
              rotationX: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
            },
            0.1,
          )
        }

        if (titleItalic) {
          tl.fromTo(
            titleItalic,
            {
              y: 25,
              rotationX: 25,
              opacity: 0,
              transformOrigin: "bottom left",
            },
            {
              y: 0,
              rotationX: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
            },
            0.18,
          )
        }

        if (desc) {
          tl.fromTo(
            desc,
            { y: 20, opacity: 0, filter: "blur(4px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.45,
              ease: "power2.out",
            },
            0.26,
          )
        }

        if (actions) {
          tl.fromTo(
            actions,
            { y: 15, opacity: 0, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.4)",
            },
            0.32,
          )
        }

        if (proof) {
          tl.fromTo(
            proof,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
            0.38,
          )
        }

        if (floatingBadge) {
          tl.fromTo(
            floatingBadge,
            { scale: 0.6, opacity: 0, rotation: 12 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.55,
              ease: "back.out(1.7)",
            },
            0.22,
          )
        }
      },
      containerRef,
    )

    return () => ctx.revert()
  }, [current, direction])

  const goToSlide = (index: number) => {
    if (index === current || isAnimating.current) return
    setDirection(index > current ? "next" : "prev")
    setCurrent(index)
  }

  const handleNext = () => {
    if (isAnimating.current) return
    setDirection("next")
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }

  const handlePrev = () => {
    if (isAnimating.current) return
    setDirection("prev")
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swiped left -> next slide
        handleNext()
      } else {
        // Swiped right -> prev slide
        handlePrev()
      }
    }
  }

  const slide = SLIDES[current]

  return (
    <section
      className="hero-slider-container"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Artisanal Shirts Showcase"
    >
      {/* Background ambient lighting */}
      <div className="slider-ambient-glow" />

      {/* Main Slide Presentation */}
      <div
        className="hero-slide-wrapper"
        ref={(el) => {
          slideRefs.current[current] = el
        }}
        key={slide.id}
      >
        {/* Left / Center Copy */}
        <div className="hero-slide-copy" ref={textContainerRef}>
          <div className="eyebrow-row">
            <span className="eyebrow light slide-eyebrow">{slide.eyebrow}</span>
          </div>

          <h1 className="slide-title">
            <span className="slide-title-main block">{slide.title}</span>
            <em className="slide-title-italic block">{slide.italicTitle}</em>
          </h1>

          <p className="slide-desc">{slide.description}</p>

          <div className="hero-actions slide-actions">
            <Button
              variant="light"
              onClick={() => go("shop")}
              className="slider-cta-btn"
            >
              {slide.ctaText} <Icon name="arrow" />
            </Button>
          </div>
        </div>

        {/* Right 3D Visual with Picture tag for Responsive PC vs Phone */}
        <div className="hero-slide-visual">
          <div className="slider-img-wrap">
            <picture>
              {/* Mobile Phone Screen: Dedicated Portrait 9:16 Image */}
              <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
              {/* Desktop / Laptop Screen: Wide 16:9 Banner Image */}
              <img
                src={slide.desktopImage}
                alt={`${slide.title} - ${slide.eyebrow}`}
                className="slider-primary-img"
                loading="eager"
              />
            </picture>
          </div>
        </div>
      </div>

      {/* Bottom Slider Control Bar */}
      <div className="slider-controls-bar">
        {/* Navigation Tabs with 3-Second Live Progress Indicator */}
        <div className="slider-tabs">
          {SLIDES.map((s, index) => {
            const isActive = index === current
            return (
              <button
                key={s.id}
                type="button"
                className={`slider-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}: ${s.tag}`}
              >
                <div className="tab-progress-track">
                  {isActive && (
                    <div className="tab-progress-fill" ref={progressLineRef} />
                  )}
                </div>
                <div className="tab-info">
                  <span className="tab-num">0{index + 1}</span>
                  <span className="tab-label">{s.tag}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Arrow Navigation & Play/Pause Button */}
        <div className="slider-arrows">
          <button
            type="button"
            className="slider-arrow-btn arrow-prev"
            onClick={handlePrev}
            aria-label="Previous Slide"
          >
            <span
              style={{ display: "inline-flex", transform: "rotate(180deg)" }}
            >
              <Icon name="arrow" size={16} />
            </span>
          </button>

          <span className="slide-counter-badge">
            <b>0{current + 1}</b> / 0{SLIDES.length}
          </span>

          <button
            type="button"
            className="slider-arrow-btn arrow-next"
            onClick={handleNext}
            aria-label="Next Slide"
          >
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
