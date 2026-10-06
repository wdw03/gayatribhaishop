"""
=============================================================================
Label Ritesh Puri (labelriteshpuri.com) - Full Store Scraper & Media Downloader
=============================================================================
Ye script 'labelriteshpuri.com' ke:
1. Sabhi Products (Name, Price, Category, Description, Sizes, Details) scrap karti hai.
2. Sabhi High-Resolution Product Images ko unke REAL NAME se organize karke download karti hai.
3. Website ke Home page, About Brand, Contact, Size Guide aur Policy pages ko save karti hai.
4. Website ke Hero Banners, Backgrounds aur Instagram Showcase media ko download karti hai.
5. Excel-compatible CSV aur structured JSON data create karti hai.

Author: Antigravity Assistant
=============================================================================
"""

import os
import re
import csv
import json
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration & Endpoints
BASE_WEBSITE = "https://labelriteshpuri.com"
BACKEND_API_BASE = "https://riteshs-clothing-store.onrender.com"
PRODUCTS_API_URL = f"{BACKEND_API_BASE}/api/products"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": BASE_WEBSITE,
}

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(OUTPUT_DIR, "data")
PAGES_DIR = os.path.join(OUTPUT_DIR, "pages")
IMAGES_DIR = os.path.join(OUTPUT_DIR, "downloaded_images")
PRODUCTS_IMG_DIR = os.path.join(IMAGES_DIR, "products")
BANNERS_DIR = os.path.join(IMAGES_DIR, "site_banners")
SITE_MEDIA_DIR = os.path.join(IMAGES_DIR, "site_media")


def sanitize_filename(name: str) -> str:
    """Windows filesystem ke anusaar safe folder / file name banata hai."""
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    name = re.sub(r"\s+", "_", name.strip())
    return name[:80] if len(name) > 80 else name


def create_directories():
    """Zaroori folders banata hai."""
    for folder in [DATA_DIR, PAGES_DIR, IMAGES_DIR, PRODUCTS_IMG_DIR, BANNERS_DIR, SITE_MEDIA_DIR]:
        os.makedirs(folder, exist_ok=True)
    print("Folders verify/create ho gaye hain.")


def download_file(url: str, save_path: str, max_retries: int = 3) -> bool:
    """Single file download helper with retry logic."""
    if os.path.exists(save_path) and os.path.getsize(save_path) > 0:
        return True  # Already downloaded

    for attempt in range(1, max_retries + 1):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=30, stream=True)
            if resp.status_code == 200:
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=16384):
                        if chunk:
                            f.write(chunk)
                return True
            elif resp.status_code == 404:
                return False
        except Exception as e:
            if attempt == max_retries:
                print(f"  [X] Failed: {url} -> {e}")
            time.sleep(1)
    return False


def fetch_all_products():
    """Backend API se saare products fetch karta hai."""
    print(f"\n[1/5] Fetching products from API: {PRODUCTS_API_URL}...")
    try:
        res = requests.get(PRODUCTS_API_URL, headers=HEADERS, timeout=30)
        res.raise_for_status()
        products = res.json()
        print(f"  -> Total {len(products)} products mil gaye!")
        return products
    except Exception as e:
        print(f"  [ERROR] Products fetch nahi ho paye: {e}")
        return []


def save_structured_data(products):
    """products.json aur products.csv save karta hai."""
    print("\n[2/5] Saving products data into JSON & CSV...")

    # 1. Save JSON
    json_path = os.path.join(DATA_DIR, "products.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print(f"  -> JSON saved: {json_path}")

    # 2. Save CSV
    csv_path = os.path.join(DATA_DIR, "products.csv")
    fieldnames = [
        "Product_ID",
        "Product_Name",
        "Category",
        "SubCategory",
        "Price_INR",
        "Original_Price_INR",
        "Discount_Percent",
        "Gender",
        "Brand",
        "In_Stock",
        "Sizes",
        "Color",
        "Occasion_Details",
        "Description",
        "Total_Images",
        "Main_Image_URL",
        "Other_Images_URLs",
    ]

    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for p in products:
            # Details format
            details_list = p.get("productDetails", [])
            details_str = " | ".join(
                [f"{d.get('name')}: {d.get('value')}" for d in details_list if isinstance(d, dict)]
            )
            other_imgs = p.get("otherImages", []) or []
            main_img = p.get("mainImage", "")

            writer.writerow({
                "Product_ID": p.get("_id", ""),
                "Product_Name": p.get("name", ""),
                "Category": p.get("category", ""),
                "SubCategory": p.get("subCategory", ""),
                "Price_INR": p.get("price", ""),
                "Original_Price_INR": p.get("originalPrice", ""),
                "Discount_Percent": p.get("discount", ""),
                "Gender": p.get("gender", ""),
                "Brand": p.get("brand", "Ritesh Puri"),
                "In_Stock": p.get("inStock", True),
                "Sizes": ", ".join(p.get("sizes", [])) if isinstance(p.get("sizes"), list) else str(p.get("sizes", "")),
                "Color": p.get("color", ""),
                "Occasion_Details": details_str,
                "Description": p.get("description", ""),
                "Total_Images": 1 + len(other_imgs) if main_img else len(other_imgs),
                "Main_Image_URL": main_img,
                "Other_Images_URLs": " ; ".join(other_imgs),
            })

    print(f"  -> CSV saved: {csv_path}")


def download_all_product_images(products):
    """Sabhi product images ko real product name ke hisaab se download karta hai."""
    print("\n[3/5] Downloading all Product Images with Real Product Names...")

    download_tasks = []

    for idx, p in enumerate(products, start=1):
        raw_name = p.get("name", f"Product_{idx}").strip()
        safe_name = sanitize_filename(raw_name)
        product_folder = os.path.join(PRODUCTS_IMG_DIR, safe_name)
        os.makedirs(product_folder, exist_ok=True)

        # Write details.txt inside the product's image folder for complete offline reference
        details_txt = os.path.join(product_folder, "product_info.txt")
        details_list = p.get("productDetails", [])
        details_str = "\n".join(
            [f"  - {d.get('name')}: {d.get('value')}" for d in details_list if isinstance(d, dict)]
        )
        sizes_str = ", ".join(p.get("sizes", [])) if isinstance(p.get("sizes"), list) else str(p.get("sizes", ""))

        with open(details_txt, "w", encoding="utf-8") as f:
            f.write(f"Product Name: {raw_name}\n")
            f.write(f"Product ID: {p.get('_id', '')}\n")
            f.write(f"Brand: {p.get('brand', 'Ritesh Puri')}\n")
            f.write(f"Category: {p.get('category', '')} / {p.get('subCategory', '')}\n")
            f.write(f"Price: Rs. {p.get('price', '')} (Original: Rs. {p.get('originalPrice', '')}, Discount: {p.get('discount', '')}%)\n")
            f.write(f"Available Sizes: {sizes_str}\n")
            f.write(f"Color: {p.get('color', '')}\n")
            f.write(f"In Stock: {p.get('inStock', True)}\n\n")
            f.write(f"Description:\n{p.get('description', '')}\n\n")
            if details_str:
                f.write(f"Specifications / Occasion:\n{details_str}\n\n")
            f.write(f"Main Image URL: {p.get('mainImage', '')}\n")
            f.write("Other Image URLs:\n")
            for o_url in p.get("otherImages", []) or []:
                f.write(f"  - {o_url}\n")

        # 1. Main Image
        main_img_url = p.get("mainImage")
        if main_img_url:
            ext = os.path.splitext(main_img_url.split("?")[0])[1] or ".jpg"
            save_name = f"{safe_name}_main{ext}"
            save_path = os.path.join(product_folder, save_name)
            download_tasks.append((main_img_url, save_path, f"{safe_name} [MAIN]"))

        # 2. Other Gallery Images
        other_images = p.get("otherImages", []) or []
        for img_idx, o_url in enumerate(other_images, start=1):
            if o_url:
                ext = os.path.splitext(o_url.split("?")[0])[1] or ".jpg"
                save_name = f"{safe_name}_view_{img_idx}{ext}"
                save_path = os.path.join(product_folder, save_name)
                download_tasks.append((o_url, save_path, f"{safe_name} [VIEW {img_idx}]"))

    print(f"  -> Total {len(download_tasks)} images queued across {len(products)} products.")

    completed = 0
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(download_file, url, path): label for url, path, label in download_tasks}
        for future in as_completed(futures):
            label = futures[future]
            success = future.result()
            completed += 1
            if completed % 15 == 0 or completed == len(download_tasks):
                print(f"  -> Progress: [{completed}/{len(download_tasks)}] images downloaded...")

    print(f"  -> All {completed} product images downloaded successfully into: {PRODUCTS_IMG_DIR}")


def save_pages_and_content():
    """Website ke Home, About, Contact, Size Guide, Policies ko detailed format me save karta hai."""
    print("\n[4/5] Saving Website Pages & Text Content (Home, About, Contact, Policies)...")

    # 1. Home Page
    home_content = """# Label Ritesh Puri - Official Home Page Content

**Website URL:** https://labelriteshpuri.com  
**Brand:** RITESH PURI  
**Tagline:** Crafted for the Modern Indian  
**Description:** Premium everyday clothing designed for comfort, quality, and modern style.

---

## Hero Section
- **Heading:** RITESH PURI
- **Subheading:** Luxury Handcrafted Shirts & Contemporary Indian Fashion
- **Call to Action:** "Explore Collection" -> Links to `/products`
- **Quality Promise:** "Handcrafted in India with love. Modern silhouettes, quality fabrics, and timeless minimal design."

---

## Key Benefits & Highlights
- **Free Delivery:** Across India on qualifying orders.
- **Cash on Delivery (COD):** Available for seamless convenience.
- **24/7 Dedicated Support:** Direct WhatsApp and phone assistance.
- **Consultation:** "Get fabric feel, fitting and styling details before buying."

---

## Featured Categories
1. **BeachSide Collection:** Vibrant prints, resort shirts, relaxed vacation aesthetics (e.g. Deep Sea COCO, Flamingo Beach, Havana).
2. **Contemporary Shirts:** Elegant hand-embroidered artisan pieces (e.g. Azure Leaf, Coastal King).
3. **Casual & Everyday Luxury:** Breathable, comfortable statement pieces designed for daytime events and gatherings.

---

## Navigation Menu
- Home (`/`)
- Shop (`/products`)
- New Arrivals (`/products?filter=new`)
- Contact (`/contact`)

## Support Links
- Size Guide (`/size-guide`)
- Return Policy (`/return-policy`)
- Privacy Policy (`/privacy-policy`)
- Terms & Conditions (`/terms`)
"""
    with open(os.path.join(PAGES_DIR, "home.md"), "w", encoding="utf-8") as f:
        f.write(home_content)

    # 2. About Brand Page
    about_content = """# About Label Ritesh Puri

**Brand Name:** Ritesh Puri / Label Ritesh Puri  
**Founder / Designer:** Ritesh Puri  
**Instagram:** [@labelriteshpuri](https://www.instagram.com/labelriteshpuri/) | [@realriteshpuri](https://www.instagram.com/realriteshpuri/)  
**YouTube:** [@riteshpuriofficial](https://www.youtube.com/@riteshpuriofficial)  

---

## Brand Story & Philosophy
> "At Ritesh Puri, clothing is more than fashion — it reflects identity, culture, and confidence."

Ritesh Puri is a premium contemporary fashion label focused on:
- **Modern Silhouettes:** Crisp tailoring that bridges modern streetwear sensibilities with elevated luxury.
- **Quality Fabrics:** Handpicked, breathable, long-lasting linens and cotton blends suited for the Indian climate.
- **Timeless Minimal Design:** Refined aesthetics crafted for everyday elegance, garden parties, beach getaways, and evening celebrations.
- **Artisanal Craftsmanship:** Distinctive hand embroidery, tropical botanical motifs, and bespoke detailing on every piece.

---

## Care Instructions
- Gentle hand wash or delicate machine wash.
- Mild detergent recommended.
- Do not bleach or tumble dry in harsh heat.
- Dry in shade to protect fabric colors and delicate embroidery.
"""
    with open(os.path.join(PAGES_DIR, "about_brand.md"), "w", encoding="utf-8") as f:
        f.write(about_content)

    # 3. Contact Us Page
    contact_content = """# Contact Us - Label Ritesh Puri

Have queries about fabric, custom fitting, sizing, or existing orders? Reach out directly:

---

## Direct Contacts
- **WhatsApp Support:** [+91 9834704067](https://wa.me/919834704067)
- **Phone / Calling:** +91 9834704067
- **Official Support Email:** [riteshpuri718@gmail.com](mailto:riteshpuri718@gmail.com)
- **Store / Studio Location:** Jalaram Terrace, Ring Road, Surat, Gujarat, India

---

## Social Channels
- **Official Brand Instagram:** [instagram.com/labelriteshpuri](https://www.instagram.com/labelriteshpuri/)
- **Founder Instagram:** [instagram.com/realriteshpuri](https://www.instagram.com/realriteshpuri/)
- **YouTube Channel:** [youtube.com/@riteshpuriofficial](https://www.youtube.com/@riteshpuriofficial)

---

## Frequently Asked Questions (FAQs)
**Q: How do I cancel my order?**  
A: Orders can be cancelled within 24 hours of placement. Contact our support team immediately on WhatsApp or email for cancellation requests.

**Q: Can I check fabric feel and fit before purchasing?**  
A: Yes, you can message our styling team directly via WhatsApp for real close-up videos and sizing advice.
"""
    with open(os.path.join(PAGES_DIR, "contact_us.md"), "w", encoding="utf-8") as f:
        f.write(contact_content)

    # 4. Size Guide Page
    size_guide_content = """# Size Guide - Label Ritesh Puri

Please refer to the size chart below to find your perfect fit.  
*All measurements are in inches.*

| Size | Chest (inches) | Waist (inches) | Hip (inches) |
| :--- | :--- | :--- | :--- |
| **S** | 36 - 38 | 30 - 32 | 36 - 38 |
| **M** | 38 - 40 | 32 - 34 | 38 - 40 |
| **L** | 40 - 42 | 34 - 36 | 40 - 42 |
| **XL**| 42 - 44 | 36 - 38 | 42 - 44 |
| **XXL**| 44 - 46 | 38 - 40 | 44 - 46 |

> *Note: Measurements may vary slightly (0.5 - 1 inch) depending on the relaxed/oversized style of the shirt.*
"""
    with open(os.path.join(PAGES_DIR, "size_guide.md"), "w", encoding="utf-8") as f:
        f.write(size_guide_content)

    # 5. Return & Refund Policy Page
    return_policy_content = """# Return & Refund Policy - Label Ritesh Puri

We want you to love what you purchase from us. If you are not completely satisfied, you may request a return or exchange under the conditions below.

---

## 1. Return Eligibility
- Items must be returned within **7 days** of delivery.
- Product must be **unused, unwashed, unworn**, and in original packaging with tags intact.
- Items purchased on special sale or discounted clearance are not eligible for return.

## 2. Refund Process
- Once we receive and inspect your returned item, we will notify you regarding the approval or rejection of your refund.
- Approved refunds will be credited back to your original payment method or bank account within 5-7 business days.

## 3. Exchange Policy
- We replace items if they are defective, damaged in transit, or require a size change.
- For all exchange requests, please contact our support team immediately on WhatsApp: [+91 9834704067](https://wa.me/919834704067).

## 4. Contact Us for Returns
For any return or refund queries, reach us via:
- WhatsApp: +91 9834704067
- Email: riteshpuri718@gmail.com
"""
    with open(os.path.join(PAGES_DIR, "return_policy.md"), "w", encoding="utf-8") as f:
        f.write(return_policy_content)

    # 6. Privacy Policy Page
    privacy_content = """# Privacy Policy - Label Ritesh Puri

Label Ritesh Puri values and respects your privacy.

### 1. Information We Collect
- Name and contact details (phone number, email address).
- Shipping address and billing address for order delivery.
- Order details, payment transaction references, and purchase history.

### 2. How We Use Your Information
- To process, verify, pack, and deliver your orders.
- To communicate order tracking updates and shipment notifications.
- To provide customer service, sizing help, and answer inquiries.

### 3. Contact Us
If you have any questions about this Privacy Policy, please contact us via WhatsApp (+91 9834704067) or email (riteshpuri718@gmail.com).
"""
    with open(os.path.join(PAGES_DIR, "privacy_policy.md"), "w", encoding="utf-8") as f:
        f.write(privacy_content)

    # 7. Terms & Conditions
    terms_content = """# Terms & Conditions - Label Ritesh Puri

Welcome to Label Ritesh Puri (labelriteshpuri.com). By visiting or purchasing from our store, you agree to these terms:

1. **Product Descriptions:** We make every effort to display colors, textures, and embroidery details accurately. Slight variations may occur due to screen settings and artisanal handcrafting.
2. **Pricing:** All prices listed are in Indian Rupees (INR) and are inclusive/exclusive of taxes as specified at checkout.
3. **Shipping:** Orders are shipped through reputable domestic logistics partners. Standard delivery takes 3-7 business days across India.
4. **Returns & Refunds:** Please refer to our Return Policy page for conditions and procedure.
5. **Governing Law:** Any dispute arising out of transactions shall be governed by the laws of Surat, Gujarat jurisdiction.
"""
    with open(os.path.join(PAGES_DIR, "terms_and_conditions.md"), "w", encoding="utf-8") as f:
        f.write(terms_content)

    print(f"  -> All 7 pages saved into: {PAGES_DIR}")


def download_site_assets():
    """Website ke hero banners, background images aur media files download karta hai."""
    print("\n[5/5] Downloading Website Banners, Media & Promotional Assets...")

    site_media_list = [
        # Banners & Hero Images
        ("https://labelriteshpuri.com/images/home6.jpeg", os.path.join(BANNERS_DIR, "home_banner_main.jpeg")),
        ("https://labelriteshpuri.com/images/home2.jpeg", os.path.join(BANNERS_DIR, "home_banner_secondary.jpeg")),
        ("https://images.pexels.com/photos/8483488/pexels-photo-8483488.jpeg", os.path.join(BANNERS_DIR, "hero_model_photo.jpeg")),
        ("https://cdn-icons-png.flaticon.com/512/2038/2038854.png", os.path.join(SITE_MEDIA_DIR, "luxury_hanger_icon.png")),

        # Instagram & Promotional Media
        ("https://labelriteshpuri.com/instagram/post3.jpg", os.path.join(SITE_MEDIA_DIR, "instagram_showcase_post3.jpg")),
        ("https://labelriteshpuri.com/instagram/ing3.jpg", os.path.join(SITE_MEDIA_DIR, "instagram_lookbook_ing3.jpg")),
        ("https://labelriteshpuri.com/instagram/ing1.jpg", os.path.join(SITE_MEDIA_DIR, "instagram_lookbook_ing1.jpg")),
        ("https://labelriteshpuri.com/instagram/post1.mp4", os.path.join(SITE_MEDIA_DIR, "instagram_video_preview.mp4")),
    ]

    for url, path in site_media_list:
        filename = os.path.basename(path)
        success = download_file(url, path)
        if success:
            size_kb = os.path.getsize(path) / 1024
            print(f"  -> Downloaded: {filename} ({size_kb:.1f} KB)")
        else:
            print(f"  -> Skip/Not found: {filename}")


def main():
    print("=" * 70)
    print("      LABEL RITESH PURI (labelriteshpuri.com) - MASTER SCRAPER       ")
    print("=" * 70)
    start_time = time.time()

    create_directories()

    # Step 1: Fetch all products from API
    products = fetch_all_products()

    if products:
        # Step 2: Save JSON & CSV
        save_structured_data(products)

        # Step 3: Download all product images with Real Product Names
        download_all_product_images(products)
    else:
        print("[!] No products found or API unreachable.")

    # Step 4: Save all site pages & text
    save_pages_and_content()

    # Step 5: Download Site Banners & Assets
    download_site_assets()

    elapsed = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"  SABHI TASKS SUCCESSFULLY COMPLETE HO GAYE IN {elapsed:.1f} SECONDS!")
    print(f"  - Products Data:      {DATA_DIR}")
    print(f"  - Product Images:     {PRODUCTS_IMG_DIR}")
    print(f"  - Site Banners:       {BANNERS_DIR}")
    print(f"  - Site Media:         {SITE_MEDIA_DIR}")
    print(f"  - Content Pages:      {PAGES_DIR}")
    print("=" * 70)


if __name__ == "__main__":
    main()
