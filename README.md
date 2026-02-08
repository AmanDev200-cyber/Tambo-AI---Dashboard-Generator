# 📊 **Tambo AI Dashboard Generator**

## **🚀 AI-Powered Generative Analytics Dashboards**

**Tambo AI Dashboard Generator** is a **generative UI dashboard builder powered by AI**.  
It allows users to upload structured datasets and instantly generate **interactive, explainable analytics dashboards** using **AI-driven visualization and layout reasoning**.

Built with **modern React, Tailwind CSS, and AI orchestration**, Tambo AI transforms **raw data into meaningful insights** with minimal configuration.

---

## 📚 **Table of Contents**

- 📌 Introduction  
- 🚀 Features  
- 🧱 Tech Stack  
- 📁 Repository Structure  
- 💡 Installation  
- ▶️ Run Locally  
- 🎯 Usage  
- 🧪 Error Handling  
- ⚙️ How It Works  
- 🛡️ Design Principles  
- 🧠 Future Enhancements  
- 🤝 Contributing  
- 📜 License  

---

## 📌 **Introduction**

Tambo AI enables users to:

- 📂 Upload **CSV or Excel** datasets  
- 🗣️ Describe analytics needs in **natural language**  
- 📊 Instantly receive **AI-generated dashboards** with:
  - Interactive charts  
  - What-if simulations  
  - Explainability & confidence scores  

🔒 The system **strictly relies on verified user data**, ensuring **zero hallucinations**.

---

## 🚀 **Features**

### 🧠 **Generative Dashboard Creation**
Automatically builds dashboards from datasets and natural language prompts.

### 📄 **CSV / Excel Ingestion**
Upload structured data and let the system infer schema, metrics, and relationships.

### 📈 **AI-Powered Visualization**
AI selects optimal chart types such as **heatmaps, bar charts, and area charts**.

### 🔐 **Strict Data Trust Mode**
Prevents hallucinations by **only using verified user-provided data**.

### 📊 **Interactive Charts & What-If Simulations**
Real-time sliders and scenario modeling embedded in dashboards.

### 📐 **Explainability & Confidence Scores**
Displays **why** a layout or visualization was chosen, with confidence levels.

---

## 🧱 **Tech Stack**

| Layer | Technology |
|------|-----------|
| **Frontend** | React, Tailwind CSS |
| **AI Orchestration** | Google Gemini API |
| **Data Parsing** | PapaParse, XLSX |
| **Visualization** | Recharts, D3, React-Simple-Maps |
| **State & UI** | React Hooks + Custom Components |

---

## 📁 **Repository Structure**

├── public/                     # Static assets
├── src/
│   ├── components/            # UI components (Upload, Charts, Panels)
│   ├── services/              # API clients and AI orchestration logic
│   ├── hooks/                 # Custom hooks for UI + AI integration
│   ├── styles/                # Tailwind config + global CSS
│   └── App.tsx                # Main application entry
├── package.json
└── README.md

## 💡 **Installation**

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/AmanDev200-cyber/Tambo-AI---Dashboard-Generator.git
cd Tambo-AI---Dashboard-Generator
```
## 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```
## 3️⃣ Environment Variables
```bash
Create a .env file in the root directory:

VITE_GEMINI_API_KEY=your_google_gemini_api_key
```
⚠️ Important:
The application will not run without a valid Gemini API key.

## ▶️ Run Locally
```bash
npm run dev
```
```bash
Open your browser at:

http://localhost:3000
```
## 🎯 Usage
### 📂 Upload Data
Upload a CSV or Excel file using the upload button.

## 🧠 Generate Dashboard
###
Enter a natural language prompt, for example:
```text
Show me churn risk for Q3

What the AI Does
🔍 Infer schema and metrics

📊 Choose optimal visualizations

⚡ Generate an interactive dashboard

🧪 Error Handling
❗ Invalid API Key
Ensure VITE_GEMINI_API_KEY is set correctly

Restart the development server after making changes

❗ Schema Inference Failure
Use clear and descriptive column names

Avoid mixed data types within a single column
```

## ⚙️ How It Works
```text
1️⃣ Data Ingestion
CSV and Excel files are parsed using PapaParse and XLSX

2️⃣ Schema Inference
Detects column types, distributions, and relationships

3️⃣ AI Layout Orchestration
Schema and user intent are sent to the Gemini API

4️⃣ Interactive Rendering
Dashboards are rendered with interactive charts and simulation controls

🛡️ Design Principles
✅ Explainable Outputs – Every AI decision includes clear reasoning

❌ No Hallucinations – Missing data triggers a Data Requirement Card

📱 Mobile-Responsive – Adaptive layouts for all screen sizes
```
## 🧠 Future Enhancements

### Feature	Status
```text
Multi-source joins	Planned

Voice activation	Planned

Live DB connectors (Snowflake, Postgres)	Planned

Downloadable reports	Idea
```
## 🤝 Contributing

Contributions are welcome!
Before opening a pull request:

Follow coding conventions

Add tests where applicable

Update documentation if behavior changes

## 📜 License

MIT License
Free to use, modify, and distribute.

## User Guide
### Check out the USER_GUIDE.md in this repo
