📊 Tambo AI Dashboard Generator

A generative UI dashboard builder powered by AI — designed to let users upload data and automatically generate interactive analytics dashboards using AI-driven visualization and layout reasoning.

This project uses modern React + Tailwind + AI orchestration to transform raw inputs into meaningful dashboards with minimal configuration.

🚀 Features

🧠 Generative Dashboard Creation
Automatically constructs dashboards from dataset inputs and natural language prompts.

📄 CSV/Excel Ingestion
Upload structured data and let the system infer schema and insights.

📈 AI-Powered Visualization
Uses AI to mathematically select appropriate chart types (heatmaps, area charts, etc.).

🔐 Strict Data Trust Mode
Prevents hallucination by only using verified data from the user file.

📊 Interactive Charts & What-If Simulations
Real-time sliders and scenario modeling embedded in dashboards.

📐 Explainability & Confidence Scores
Shows why a particular layout was chosen and the confidence behind it.

🧱 Tech Stack
Layer	Technology
Frontend	React, Tailwind CSS
AI Orchestration	Google Gemini API
Data Parsing	PapaParse, XLSX
Visualization	Recharts, D3, React-Simple-Maps
State & UI	React hooks + custom components
📁 Repository Structure

Typical folder layout (inferred):

├── public/                     # Static assets
├── src/
│   ├── components/            # UI components (Upload, Charts, Panels)
│   ├── services/              # API clients and orchestration logic
│   ├── hooks/                 # Custom hooks for UI + AI integration
│   ├── styles/                # Tailwind config + CSS
│   └── App.tsx                # Main application entry
├── package.json
└── README.md

💡 Installation
1. Clone the Project
git clone https://github.com/AmanDev200-cyber/Tambo-AI---Dashboard-Generator.git
cd Tambo-AI---Dashboard-Generator

2. Install Dependencies
npm install
# or
yarn install

3. Add Environment Variables

Copy the example .env (if present) and add your keys:

VITE_GEMINI_API_KEY=<<your_google_gemini_api_key>>


Make sure the key is valid — orchestration will fail without it.

🚀 Run Locally
npm run dev


Then open your browser at:

http://localhost:3000

🎯 Usage
Upload Data

Use the upload button to select a CSV or Excel file.

Generate Dashboard

Enter a natural language query, e.g.:

Show me churn risk for Q3


The AI will infer schema and generate an interactive dashboard.

🧪 Error Handling

Common errors you might encounter:

❗ Invalid API Key
Make sure your Gemini key is set in .env and restarted.

❗ Schema inference fails
Ensure your data columns are clearly named and consistent.

📊 How It Works

Data Ingestion
File parsed using PapaParse/XLSX.

Schema Inference
Deduce types, unique values, and relationships.

AI Layout Orchestration
Send schema and intent to Gemini API.

Interactive Rendering
Render dashboard and built-in simulation panels.

🛡️ Design Principles

Explainable Outputs – All AI decisions come with confidence scores.

No Hallucinations – If data is missing, user sees a Data Requirement Card.

Mobile-Responsive – Adaptive panel behavior for smartphones & tablets.

🧠 Future Enhancements
Feature	Status
Multi-source joins	Planned
Voice-activation	Planned
Live DB connectors (Snowflake, Postgres)	Planned
Downloadable reports	Idea
🤝 Contributing

Contributions are welcome!
Before opening a pull request, please check:

Coding style and conventions

Add tests where appropriate

Update this README with any new behavior

📜 License

MIT License — free to use and modify.
