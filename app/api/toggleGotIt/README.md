🛒 Family Shopping List
A multi‑family shopping list app where each family has its own private list, stores, and items using a unique family code and password.

Fully responsive, secure, and optimized for mobile & desktop.
Built with Next.js, Neon PostgreSQL, and Tailwind CSS.

🚀 Features
🔐 Private family login (family code + password)

🛍️ Add products with quantity & optional store

🏪 Add / delete stores

✔️ Mark items as “Got it”

✏️ Edit items

❌ Delete items

🌙 Dark mode

🌍 Multi‑language support (EN, EL, FR, ES, IT, DE, FI, AR, JA, ZH)

📱 Fully responsive (mobile, tablet, desktop)

⚡ Fast Neon PostgreSQL backend

🔒 Each family sees ONLY its own data

🧠 How it works
Every family has:

family_code

family_password

family_id (internal DB ID)

All items and stores are linked to family_id, so each family sees only its own shopping list.

🗄️ Tech Stack
Next.js 16

React

Tailwind CSS

Neon PostgreSQL

Vercel Deployment

UUID-based items & stores

🔧 Environment Variables
Add this to Vercel:

Code
DATABASE_URL=postgres://YOUR_NEON_URL
📦 Deployment (Vercel)
Push project to GitHub

Import repo into Vercel

Add DATABASE_URL

Deploy

Share the link with families

Each family logs in with its own code & password

📱 Usage
Open the app link

Enter Family Code

Enter Password

Manage your private shopping list

👨‍💻 Author
Vasilis Fanes Nikitaras  
© 2026 VNF Software
Unauthorized copying or resale is strictly prohibited.
Contact: vasilis.nikitaras@gmail.com